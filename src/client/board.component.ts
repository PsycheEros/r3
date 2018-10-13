import { Board } from 'src/board';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, OnChanges, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter, switchMap, mapTo, share } from 'rxjs/operators';
import { colors } from 'data/colors.yaml';

import { Engine, Scene, Mesh, Vector3, StandardMaterial, TargetCamera, PickingInfo, PointerInfo, Observable as BabylonObservable, PointerEventTypes, Color3, AbstractMesh, SpotLight } from 'babylonjs';

function hslToRgb( h: number, s: number, l: number ): [ number, number, number ] {
	s /= 100;
	l /= 100;
	const c = ( 1 - Math.abs( 2 * l - 1 ) ) * s;
	const hp = h / 60.0;
	const x = c * ( 1 - Math.abs( ( hp % 2 ) - 1) );
	let rgb1;
	if( isNaN( h ) ) rgb1 = [ 0, 0, 0 ];
	else if( hp <= 1 ) rgb1 = [ c, x, 0 ];
	else if( hp <= 2 ) rgb1 = [ x, c, 0 ];
	else if( hp <= 3 ) rgb1 = [ 0, c, x ];
	else if( hp <= 4 ) rgb1 = [ 0, x, c ];
	else if( hp <= 5 ) rgb1 = [ x, 0, c ];
	else if( hp <= 6 ) rgb1 = [ c, 0, x ];
	const m = l - c * 0.5;
	return [
		rgb1[ 0 ] + m,
		rgb1[ 1 ] + m,
		rgb1[ 2 ] + m
	];
}

function adaptObservable<T>( observable: BabylonObservable<T>, mask?: number, insertFirst?: boolean, scope?: any, unregisterOnFirstCall?: boolean ): Observable<T> {
	return new Observable<T>( observer => {
		const o = observable.add( e => {
			observer.next( e );
		}, mask, insertFirst, scope, unregisterOnFirstCall );
		return () => {
			observable.remove( o );
		};
	} );
}

@Component( {
	selector: 'board',
	templateUrl: './board.component.html',
	styleUrls: [ './board.component.css' ]
} )
export class BoardComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
	private readonly canvas = new BehaviorSubject<HTMLCanvasElement>( null );
	private readonly engine = new BehaviorSubject<Engine>( null );
	private readonly scene = new BehaviorSubject<Scene>( null );
	private readonly gameState = new BehaviorSubject<ClientGameState>( null );

	public ngOnInit() {
		this.canvas
		.subscribe( canvas => {
			const engine = this.engine.value;
			if( engine ) engine.stopRenderLoop();
			this.engine.next( canvas && new Engine( canvas, true, { preserveDrawingBuffer: true, stencil: true } ) );
		} );

		const meshMap = new WeakMap<AbstractMesh, Square>();

		combineLatest( this.engine, this.gameState )
		.subscribe( ( [ engine, gameState ] ) => {
			if( !engine || !gameState ) return;
			const mid = { x: gameState.size.width * -.5, y: gameState.size.height * -.5 };

			engine.stopRenderLoop();
			const scene = new Scene( engine );
			const camera = new TargetCamera( 'camera1', new Vector3( 0, 0, -10 ), scene, true );

			camera.setTarget( Vector3.Zero() );
			const light = new SpotLight( 'light1', new Vector3( 0, 0, -5 ), Vector3.Forward(), Math.PI * .75, 0.1, scene );
			light.intensity = 0.5;


			const boardMaterial = new StandardMaterial( 'board', scene );
			boardMaterial.diffuseColor = new Color3( 0, 1, 0 );

			const pieceDepth = .2;
			const pieceRadius = .45;
			const pieceDiameter = pieceRadius * 2;
			const pieceMap =
				new Map(
					Object.entries( colors )
					.map( ( [ key, { color: [ h, s, l ] } ] ) => {
						const material = new StandardMaterial( `material_${key}`, scene );
						material.diffuseColor = new Color3( ...hslToRgb( h, s, l ) );
						const piece = Mesh.CreateCylinder( `piece_${key}`, pieceDepth, pieceDiameter, pieceDiameter, 32, 1, scene, false, Mesh.FRONTSIDE );
						piece.isPickable = false;
						piece.setEnabled( false );
						piece.material = material;
						piece.rotate( Vector3.Right(), Math.PI * -.5 );
						return [ key, piece ] as [ string, Mesh ];
					} )
				);

			const board = Board.fromGameState( gameState );

			const groundProto = Mesh.CreateGround( 'ground', 1, 1, 2, scene, false );
			groundProto.material = ( () => {
				const material = new StandardMaterial( 'material_ground', scene );
				material.diffuseColor = new Color3( 0, 1, 0 );
				return material;
			} )();
			groundProto.rotate( Vector3.Right(), Math.PI * -.5 );
			groundProto.setEnabled( false );


			for( let y = 0; y < gameState.size.height; ++y )
			for( let x = 0; x < gameState.size.width; ++x ) {
				const square = board.get( { x, y } );
				if( !square.enabled ) continue;
				if( square.color != null ) {
					const piece = pieceMap.get( this.colors[ square.color ] ).createInstance( `piece_${x}_${y}` );
					piece.position = new Vector3( x + mid.x + pieceRadius, y + mid.y + pieceRadius, 0 );
				}
				const ground = groundProto.createInstance( `ground_${x}_${y}` );
				ground.position = new Vector3( x + mid.x + 0.5, y + mid.y + 0.5, pieceDepth );
				meshMap.set( ground, square );
			}

			engine.runRenderLoop( () => { scene.render(); } );
			this.scene.next( scene );
		} );

		this.engine
		.pipe(
			switchMap( engine =>
				fromEvent( window, 'resize' )
				.pipe( mapTo( engine ) )
			)
		)
		.subscribe( engine => {
			if( engine ) engine.resize();
		} );

		const pointerEvents =
			this.scene
			.pipe(
				filter( e => !!e ),
				switchMap( scene =>
					adaptObservable( scene.onPointerObservable ).pipe(
						map( e => [ e, scene.pickWithRay( e.pickInfo.ray ) ] as [ PointerInfo, PickingInfo ] )
					)
				),
				share()
			);

		pointerEvents
		.pipe( filter( ( [ { type } ] ) => type === PointerEventTypes.POINTERMOVE ) )
		.subscribe( ( [ , rayCast ] ) => {
			const square = meshMap.get( rayCast.pickedMesh ) || null;
			this.mousemove.emit( { square } );
		} );

		pointerEvents
		.pipe( filter( ( [ { type } ] ) => type === PointerEventTypes.POINTERPICK ) )
		.subscribe( ( [ , rayCast ] ) => {
			const square = meshMap.get( rayCast.pickedMesh ) || null;
			this.click.emit( { square } );
		} );
	}

	public ngAfterViewInit() {
		this.canvas.next( this.canvasElementRef.nativeElement );
	}

	public ngOnChanges() {
		this.gameState.next( this.gameStateValue );
	}

	public ngOnDestroy() {
		const scene = this.scene.value;
		this.canvas.next( null );
		this.canvas.complete();
		this.scene.complete();
		this.engine.complete();
		this.scene.complete();
		this.gameState.complete();
		if( scene ) scene.dispose();
	}

	@ViewChild( 'canvasElement' )
	private canvasElementRef: ElementRef;

	@Input()
	public colors: string[] = [];

	public board: null|Board = null;


	@Input( 'gameState' )
	public gameStateValue: null|ClientGameState = null;

	@Output()
	public click = new EventEmitter<BoardMouseEvent>();

	@Output()
	public mousemove = new EventEmitter<BoardMouseEvent>();
}
