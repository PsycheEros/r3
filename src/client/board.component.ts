import { Board } from 'src/board';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, OnChanges, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { screenToCanvas } from './canvas';
import { Subject, animationFrameScheduler, range, fromEvent, fromEventPattern, Observable } from 'rxjs';
import { observeOn, take, takeUntil, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { colors } from 'data/colors.yaml';

import { Engine, Scene, HemisphericLight, Mesh, Vector3, Camera, TargetCamera, PickingInfo, PointerInfo, Observable as BabylonObservable } from 'babylonjs';

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
export class BoardComponent implements AfterViewInit, OnChanges, OnDestroy {
	private readonly destroyed = new Subject<true>();
	private engine: Engine;
	private scene: Scene;
	private camera: Camera;
	private mesh: Mesh;

	public ngAfterViewInit() {
		const canvas = this.canvasElementRef.nativeElement;
		const { width, height } = canvas;
		const { destroyed } = this;
		const engine = this.engine = new Engine( canvas, true, { preserveDrawingBuffer: true, stencil: true } );
		const scene = this.scene = new Scene( engine );
		const camera = this.camera = new TargetCamera( 'camera1', new Vector3( 0, 5, -10 ), scene, true );
		camera.setTarget( Vector3.Zero() );
		camera.attachControl( canvas, false );
		const light = new HemisphericLight( 'light1', new Vector3( 0, 1, 0 ), scene );
		const mesh = Mesh.CreateCylinder( 'piece', 0.2, 1, 1, 24, 1, scene, false, Mesh.FRONTSIDE );
		mesh.position.y = 1;
		const ground = Mesh.CreateGround( 'ground1', 6, 6, 2, scene, false );
		engine.runRenderLoop( () => { scene.render(); } );

		const pointerMove =
			adaptObservable( scene.onPointerObservable, 4 )
			.pipe( takeUntil( destroyed ) );

		pointerMove
		.pipe(
			map( e => e.pickInfo.ray )
		)
		.subscribe( mesh => {
			console.log( mesh );
		} );


		fromEvent( window, 'resize' )
		.pipe( takeUntil( destroyed ) )
		.subscribe( () => {
			engine.resize();
		} );

		destroyed
		.pipe( take( 1 ) )
		.subscribe( () => {
			engine.stopRenderLoop();
		} );
	}

	public ngOnChanges() {
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
		const { engine } = this;
		if( !engine ) return;
		engine.stopRenderLoop();
	}

	@ViewChild( 'canvasElement' )
	private canvasElementRef: ElementRef;

	@Input()
	public colors: string[] = [];

	public board: null|Board = null;

	@Input()
	public gameState: null|ClientGameState = null;

	@Output()
	public click = new EventEmitter<BoardMouseEvent>();

	@Output()
	public mousemove = new EventEmitter<BoardMouseEvent>();

	public handleEvent( emitter: EventEmitter<BoardMouseEvent>, { clientX, clientY }: MouseEvent ) {
		// const { board, canvas } = this,
		// 	screenPosition = { x: clientX, y: clientY },
		// 	canvasPosition = screenToCanvas( canvas, { x: clientX, y: clientY } ),
		// 	square = board.hitTest( canvasPosition ),
		// 	boardPosition = square && square.position || null;
		// emitter.emit( {
		// 	square,
		// 	position: {
		// 		screen: screenPosition,
		// 		canvas: canvasPosition,
		// 		board: boardPosition
		// 	}
		// } );
	}
}
