import { Board } from 'src/board';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, OnChanges, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, animationFrameScheduler, combineLatest, fromEvent, merge, of } from 'rxjs';
import { map, filter, switchMap, observeOn, mergeMap } from 'rxjs/operators';
import { colors } from 'data/colors.yaml';

import { Scene, Mesh, OrthographicCamera, MeshPhongMaterial, WebGLRenderer, Renderer, SpotLight, Color, CylinderGeometry, Material, BoxGeometry, PCFSoftShadowMap, AmbientLight, Raycaster, Layers, Object3D } from 'three';

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

@Component( {
	selector: 'board',
	templateUrl: './board.component.html',
	styleUrls: [ './board.component.css' ]
} )
export class BoardComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
	private readonly renderer = new Subject<Renderer>();
	private readonly scene = new Subject<Scene>();
	private readonly gameState = new ReplaySubject<ClientGameState>( 1 );

	public ngOnInit() {
		const boardLayer = 1;
		const boardMaterial = new MeshPhongMaterial( {
			color: new Color( 0, 1, 0 ),
			dithering: true,
			shininess: 0
		} );

		const pieceDepth = .1;
		const pieceRadius = .45;
		const pieceGeometry = new CylinderGeometry(
			pieceRadius,
			pieceRadius,
			pieceDepth,
			36,
			2,
			false
		);
		const boardGeometry = new BoxGeometry( 1, 1, 1, 1, 1, 1 );
		const pieceMaterialMap =
			new Map(
				Object.entries( colors )
				.map( ( [ key, { color: [ h, s, l ] } ] ) => {
					const material = new MeshPhongMaterial( {
						color: new Color( ...hslToRgb( h, s, l ) ),
						dithering: true,
						shininess: 100,
						specular: new Color( .5, .5, .5 )
					} );
					return [ key, material ] as [ string, Material ];
				} )
			);

		const camera = new OrthographicCamera( 0, 0, 0, 0, 0, 10 );

		combineLatest( this.renderer, this.scene )
		.pipe(
			filter( e => e.every( e => !!e ) ),
			observeOn( animationFrameScheduler )
		)
		.subscribe( ( [ renderer, scene ] ) => {
			renderer.render( scene, camera );
		} );

		const boardMap = new WeakMap<Object3D, Square>();

		const mouseEvents =
		combineLatest( this.scene, this.renderer )
		.pipe(
			filter( e => e.every( e => !!e ) ),
			switchMap( ( [ scene, renderer ] ) => {
				const { domElement: canvas } = renderer;
				const layerMask = new Layers;
				layerMask.set( boardLayer );
				return merge(
					of( 'mousemove', 'click' )
					.pipe(
						mergeMap( type =>
							fromEvent<MouseEvent>( canvas, type )
							.pipe(
								map( ( { clientX, clientY } ) => ( { type, clientX, clientY } ) )
							)
						)
					),
					of( 'touchend' )
					.pipe(
						mergeMap( type =>
							fromEvent<TouchEvent>( canvas, type )
							.pipe(
								mergeMap( ( { touches } ) => touches ),
								map( ( { clientX, clientY } ) => ( { type, clientX, clientY } ) )
							)
						)
					)
				)
				.pipe(
					map( ( { clientX, clientY, type } ) => {
						const bounds = canvas.getBoundingClientRect();
						const x = clientX - bounds.left;
						const y = clientY - bounds.top;
						const point = { x: ( x / bounds.width * 2 - 1 ), y: -( y / bounds.height ) * 2 + 1 };
						const raycaster = new Raycaster;
						raycaster.setFromCamera( point, camera );
						const [ square ] =
							raycaster
							.intersectObjects( scene.children, true )
							.map( i => boardMap.get( i.object ) )
							.filter( e => !!e ) || null;

						return {
							type,
							point,
							square
						};
					} )
				);
			} )
		);

		mouseEvents
		.pipe( filter( e => e.type === 'mousemove' ) )
		.subscribe( ( { square } ) => {
			this.mousemove.emit( { square } );
		} );

		mouseEvents
		.pipe( filter( e => [ 'touchend', 'click' ].includes( e.type ) ) )
		.subscribe( ( { square } ) => {
			this.click.emit( { square } );
		} );

		this.gameState
		.pipe( map( ( gameState ) => {
			const scene = new Scene;
			if( !gameState ) return scene;
			camera.right = gameState.size.width;
			camera.bottom = gameState.size.height;
			camera.position.set( 0, 0, 5 );
			camera.updateProjectionMatrix();
			const boardRoot = new Object3D;
			scene.add( boardRoot );
			boardRoot.position.set( 0, 0, 0 );
			const boardCenter = new Object3D;
			boardRoot.add( boardCenter );
			boardCenter.position.set( gameState.size.width * .5, gameState.size.height * .5, 0 );
			const ambientLight = new AmbientLight( new Color( 1, 1, 1 ), 0.02 );
			scene.add( ambientLight );
			const light = new SpotLight( new Color( 1, 1, 1 ), 1, 20 );
			light.decay = 1;
			light.intensity = 1.6;
			light.penumbra = 0.05;
			light.castShadow = true;
			const { shadow } = light;
			shadow.mapSize.width = 1024;
			shadow.mapSize.height = 1024;
			shadow.camera.near = 1;
			shadow.camera.far = 50;
			shadow.camera.fov = 30;
			light.target = boardCenter;
			scene.add( light );
			light.position.set( 0, 0, -5 );
			const board = Board.fromGameState( gameState );

			for( let y = 0; y < gameState.size.height; ++y )
			for( let x = 0; x < gameState.size.width; ++x ) {
				const square = board.get( { x, y } );
				if( !square.enabled ) continue;
				const squareObject = new Object3D;
				squareObject.name = `square_${x}_${y}`;
				boardRoot.add( squareObject );
				squareObject.position.set( x, y, 0 );
				if( square.color != null ) {
					const pieceMaterial = pieceMaterialMap.get( this.colors[ square.color ] );
					const pieceMesh = new Mesh( pieceGeometry, pieceMaterial );
					pieceMesh.rotateX( Math.PI * .5 );
					pieceMesh.name = `piece_${x}_${y}`;
					pieceMesh.castShadow = true;
					pieceMesh.receiveShadow = true;
					pieceMesh.position.set( pieceRadius, pieceRadius, pieceDepth );
					squareObject.add( pieceMesh );
				}
				const boardMesh = new Mesh( boardGeometry, boardMaterial );
				boardMesh.name = `board_${x}_${y}`;
				boardMesh.castShadow = false;
				boardMesh.receiveShadow = true;
				boardMesh.position.set( .5, .5, 0 );
				boardMesh.layers.enable( boardLayer );
				boardMap.set( boardMesh, square );
				squareObject.add( boardMesh );
			}
			return scene;
		} ) )
		.subscribe( this.scene );
	}

	public ngAfterViewInit() {
		const canvas = this.canvasElementRef.nativeElement;
		const renderer = new WebGLRenderer( {
			antialias: true,
			canvas,
			stencil: true
		} );
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = PCFSoftShadowMap;
		this.renderer.next( renderer );
}

	public ngOnChanges() {
		this.gameState.next( this.gameStateValue );
	}

	public ngOnDestroy() {
		this.renderer.complete();
		this.scene.complete();
		this.gameState.complete();
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
