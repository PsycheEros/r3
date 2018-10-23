import { Board } from 'src/board';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, OnChanges, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, animationFrameScheduler, combineLatest, fromEvent, merge, of } from 'rxjs';
import { map, filter, switchMap, observeOn, mergeMap } from 'rxjs/operators';
import { colors } from 'data/colors.yaml';
import boardSettings from 'data/board.yaml';

import { Scene, Mesh, WebGLRenderer, Renderer, SpotLight, Color, PCFSoftShadowMap, AmbientLight, Raycaster, Layers, Object3D, PerspectiveCamera, Box3, Vector3, DirectionalLight, PointLight, Camera, AnimationClip } from 'three';
import GLTFLoader from 'three-gltf-loader';

interface GltfFile {
	animations: ReadonlyArray<AnimationClip>;
	scene: Scene;
	scenes: ReadonlyArray<Scene>;
	cameras: ReadonlyArray<Camera>;
	asset: object;
}

function loadResources( src: string ) {
	return new Promise<Map<string, Object3D>>( ( resolve, reject ) => {
		const loader = new GLTFLoader;
		loader.load( src,
			( { scene }: GltfFile ) => {
				const map = new Map<string, Object3D>();
				for( const child of scene.children ) {
					if( child && child.name ) {
						map.set( child.name, child );
					}
				}
				resolve( map );
			},
			() => {},
			err => { reject( new Error( err ) ); }
		)
	} );
}

function hslToColor( [ h, s, l ]: [ number, number, number ] ) {
	s *= .01;
	l *= .01;
	const c = ( 1 - Math.abs( 2 * l - 1 ) ) * s;
	const hp = h / 60;
	const x = c * ( 1 - Math.abs( ( hp % 2 ) - 1 ) );
	let rgb1: [ number, number, number ];
	if( isNaN( h ) ) rgb1 = [ 0, 0, 0 ];
	else if( hp <= 1 ) rgb1 = [ c, x, 0 ];
	else if( hp <= 2 ) rgb1 = [ x, c, 0 ];
	else if( hp <= 3 ) rgb1 = [ 0, c, x ];
	else if( hp <= 4 ) rgb1 = [ 0, x, c ];
	else if( hp <= 5 ) rgb1 = [ x, 0, c ];
	else if( hp <= 6 ) rgb1 = [ c, 0, x ];
	const m = l - c * .5;
	return new Color(
		rgb1[ 0 ] + m,
		rgb1[ 1 ] + m,
		rgb1[ 2 ] + m
	);
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

		const assetsPromise = loadResources( require( 'data/board.glb' ) );
		const camera = new PerspectiveCamera;
		camera.name = 'camera';

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
		.pipe( switchMap( async ( gameState ) => {
			const assets = await assetsPromise;
			const boardProto = assets.get( 'Board' );
			const pieceProto = assets.get( 'Piece' );
			const scene = new Scene;
			scene.name = 'scene';
			if( !gameState ) return scene;

			const boardRoot = new Object3D;
			boardRoot.name = 'board_root';
			scene.add( boardRoot );
			const board = Board.fromGameState( gameState );

			for( let y = 0; y < gameState.size.height; ++y )
			for( let x = 0; x < gameState.size.width; ++x ) {
				const square = board.get( { x, y } );
				if( !square.enabled ) continue;
				const squareObject = new Object3D;
				squareObject.name = `square_${x}_${y}`;
				boardRoot.add( squareObject );
				squareObject.position.set( x, y, 0 );
				const pieceMesh = pieceProto.clone() as Mesh;
				pieceMesh.name = `piece_${x}_${y}`;
				pieceMesh.castShadow = true;
				pieceMesh.receiveShadow = true;
				squareObject.add( pieceMesh );
				if( square.color == null ) {
					pieceMesh.visible = false;
				} else {
					pieceMesh.visible = true;
					pieceMesh.rotateX( Math.PI * square.color );
				}
				const boardMesh = boardProto.clone();
				boardMesh.name = `board_${x}_${y}`;
				boardMesh.castShadow = false;
				boardMesh.receiveShadow = true;
				boardMesh.layers.enable( boardLayer );
				boardMap.set( boardMesh, square );
				squareObject.add( boardMesh );
			}

			const boardBounds = new Box3;
			boardBounds.setFromObject( boardRoot );
			const boardCenter = new Vector3;
			boardBounds.getCenter( boardCenter );
			const boardSize = new Vector3;
			boardBounds.getSize( boardSize );
			const maxDim = Math.max( boardSize.x, boardSize.y, boardSize.z );
			const fov = camera.fov * ( Math.PI / 180 );
			const cameraZ = Math.abs( maxDim * .2 * Math.tan( fov * 2 ) );
			camera.position.set( boardCenter.x, boardCenter.y, cameraZ );
			const cameraToFarEdge = ( boardBounds.min.z < 0 ) ? -boardBounds.min.z + cameraZ : cameraZ - boardBounds.min.z;
			camera.near = 1;
			camera.far = cameraToFarEdge * 2;
			camera.lookAt( boardCenter );
			camera.updateMatrixWorld( false );
			camera.updateProjectionMatrix();

			let lightIndex = 0;
			for( const light of boardSettings.lights ) {
				if( 'ambient' in light ) {
					const ambientLight = new AmbientLight( hslToColor( light.ambient.color ), light.ambient.intensity );
					ambientLight.name = `light_${++lightIndex}_ambient`;
					scene.add( ambientLight );
				}
				if( 'directional' in light ) {
					const directionalLight = new DirectionalLight( hslToColor( light.directional.color ), light.directional.intensity );
					directionalLight.name = `light_${++lightIndex}_directional`;
					scene.add( directionalLight );
					scene.add( directionalLight.target );
					directionalLight.target.position.copy( boardCenter );
				}
				if( 'point' in light ) {
					const pointLight = new PointLight( hslToColor( light.point.color ), light.point.intensity );
					pointLight.name = `light_${++lightIndex}_point`;
					pointLight.castShadow = true;
					scene.add( pointLight );
					pointLight.position.set( ...light.point.position );
					pointLight.position.add( boardCenter );
					pointLight.shadow.mapSize.width = 1024;
					pointLight.shadow.mapSize.height = 1024;
				}
				if( 'spotlight' in light ) {
					const spotLight = new SpotLight( hslToColor( light.spotlight.color ), light.spotlight.intensity, light.spotlight.distance, light.spotlight.angle );
					spotLight.name = `light_${++lightIndex}_spotlight`;
					spotLight.decay = light.spotlight.decay;
					spotLight.intensity = light.spotlight.intensity;
					spotLight.penumbra = light.spotlight.penumbra;
					spotLight.castShadow = true;
					scene.add( spotLight );
					spotLight.position.set( ...light.spotlight.position );
					spotLight.position.add( boardCenter );
					scene.add( spotLight.target );
					spotLight.target.position.copy( boardCenter );
					spotLight.shadow.mapSize.width = 1024;
					spotLight.shadow.mapSize.height = 1024;
				}
			}

			// function debugObject( object: Object3D ) {
			// 	function flatten( { x, y, z }: Vector3 ) {
			// 		return [ x, y, z ]
			// 			.map( i => i.toPrecision( 2 ) )
			// 			.join( ', ' );
			// 	}
			// 	const bounds = new Box3;
			// 	bounds.setFromObject( object );
			// 	const center = new Vector3;
			// 	bounds.getCenter( center );
			// 	const size = new Vector3;
			// 	bounds.getSize( size );
			// 	const position = new Vector3;
			// 	object.getWorldPosition( position );
			// 	const direction = new Vector3;
			// 	object.getWorldDirection( direction );
			// 	let nameParts = [] as string[];
			// 	for( let n = object; !!n; n = n.parent ) {
			// 		nameParts.unshift( n.name || 'anonymous' );
			// 	}
			// 	return {
			// 		name: nameParts.join( '.' ),
			// 		position: flatten( position ),
			// 		direction: flatten( direction ),
			// 		center: flatten( center ),
			// 		size: flatten( size )
			// 	};
			// }

			// const objects = [ camera ] as Object3D[];
			// scene.traverse( node => { objects.push( node ); } );
			// console.table( objects.map( debugObject ) );
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
