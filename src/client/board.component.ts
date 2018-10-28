import { Board } from 'src/board';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, OnChanges, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, animationFrameScheduler, combineLatest, fromEvent, merge, of } from 'rxjs';
import { map, filter, switchMap, observeOn, mergeMap } from 'rxjs/operators';
import { colors } from 'data/colors.yaml';
import boardSettings from 'data/board.yaml';

import { Scene, Renderer, SpotLight, Color, PCFSoftShadowMap, AmbientLight, Raycaster, Object3D, Box3, Vector3, DirectionalLight, PointLight, Camera, AnimationClip, Mesh, MeshStandardMaterial, OrthographicCamera, TextGeometry, FontLoader, WebGLRenderer, BoxHelper } from 'three';
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
		);
	} );
}

function loadFont( src: object ) {
	const loader = new FontLoader;
	return loader.parse( src );
}

function hslToColor( [ h, s, l ]: [ number, number, number ] ) {
	return ( new Color ).setHSL( h / 360, s * .01, l * .01 );
}

function enableShadows( obj: Object3D, enable = true ) {
	obj.traverse( o => {
		o.castShadow = o.receiveShadow = enable;
	} );
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
		const assetsPromise = loadResources( require( 'data/board.glb' ) );
		const font = loadFont( require( 'data/font.json' ) );

		const textMaterial = new MeshStandardMaterial( {
			color: ( new Color ).setHSL( 3/18, 1, .5 ),
			metalness: 1,
			roughness: .5
		} );
		const orthoCamera = new OrthographicCamera( 0, 0, 0, 0, 0, 50 );
		orthoCamera.name = 'camera';

		combineLatest( this.renderer, this.scene )
		.pipe(
			filter( e => e.every( e => !!e ) ),
			observeOn( animationFrameScheduler )
		)
		.subscribe( ( [ renderer, scene ] ) => {
			renderer.render( scene, orthoCamera );
		} );

		const mouseEvents =
		combineLatest( this.scene, this.renderer )
		.pipe(
			filter( e => e.every( e => !!e ) ),
			switchMap( ( [ scene, renderer ] ) => {
				const { domElement: canvas } = renderer;
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
						const point = { x: ( x / bounds.width * 2 - 1 ), y: ( y / bounds.height ) * -2 + 1 };
						const raycaster = new Raycaster;
						raycaster.setFromCamera( point, orthoCamera );
						const [ square = null ] =
							raycaster
							.intersectObjects( scene.children, true )
							.map( i => i.object.userData.square as Square )
							.filter( e => !!e );

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
			const scene = new Scene;
			scene.name = 'scene';
			if( !gameState ) return scene;
			const assets = await assetsPromise;
			const borderProto = assets.get( 'Border' ) as Mesh;
			enableShadows( borderProto );
			const boardProto = assets.get( 'Board' ) as Mesh;
			enableShadows( boardProto );
			const pieceProto = assets.get( 'Piece' );
			enableShadows( pieceProto );

			for( const [ colorIndex, colorKey ] of Object.entries( this.colors ) ) {
				( pieceProto.children[ colorIndex ] as any ).material.color = hslToColor( colors[ colorKey ].color );
			}

			const boardRoot = new Object3D;
			boardRoot.name = 'board_root';
			scene.add( boardRoot );
			const board = Board.fromGameState( gameState );

			const border = borderProto.clone();
			border.name = 'border';
			boardRoot.add( border );
			border.scale.setX( gameState.size.width + 2 );
			border.scale.setZ( gameState.size.height + 2 );
			border.position.setX( ( gameState.size.width - 1 ) * .5 );
			border.position.setY( ( gameState.size.height - 1 ) * .5 );

			for( let y = 0; y < gameState.size.height; ++y )
			for( let x = 0; x < gameState.size.width; ++x ) {
				const square = board.get( { x, y } );
				if( !square.enabled ) continue;
				const squareObject = new Object3D;
				squareObject.name = `square_${x}_${y}`;
				boardRoot.add( squareObject );
				squareObject.position.set( x, y, 0 );
				const pieceMesh = pieceProto.clone();
				pieceMesh.name = `piece_${x}_${y}`;
				squareObject.add( pieceMesh );
				if( square.color == null ) {
					pieceMesh.visible = false;
				} else {
					pieceMesh.visible = true;
					pieceMesh.rotateZ( Math.PI * ( square.color - 1 ) );
				}
				const boardMesh = boardProto.clone();
				boardMesh.name = `board_${x}_${y}`;
				boardMesh.userData.square = square;
				squareObject.add( boardMesh );
			}

			for( let x = 0; x < gameState.size.width; ++x ) {
				const symbol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt( x );
				const textGeometry = new TextGeometry( symbol, {
					font,
					size: 1,
					height: .2,
					curveSegments: 12,
					bevelEnabled: true,
					bevelSegments: 2,
					bevelSize: 0.1,
					bevelThickness: 0.1
				} );
				const textMesh = new Mesh( textGeometry, textMaterial );
				textMesh.name = `label_${symbol}`;
				textMesh.scale.setScalar( 0.5 );
				enableShadows( textMesh );
				boardRoot.add( textMesh );
				textMesh.updateMatrixWorld( false );
				const textBounds = new Box3;
				textBounds.setFromObject( textMesh );
				const textSize = new Vector3;
				textBounds.getSize( textSize );
				textMesh.position.copy(
					new Vector3(
						x - textSize.x * .5,
						textSize.y * -.5 - 1,
						0
					)
				);
				const textMeshDown = textMesh.clone();
				textMeshDown.rotateOnAxis( new Vector3( 0, 0, 1 ), Math.PI );
				textMeshDown.name += '_down';
				textMeshDown.position.add( new Vector3( .5, gameState.size.height + 1.5, 0 ) );
				boardRoot.add( textMeshDown );
			}

			for( let y = 0; y < gameState.size.height; ++y ) {
				const symbol = '1234567890'.charAt( y );
				const textGeometry = new TextGeometry( symbol, {
					font,
					size: 1,
					height: .2,
					curveSegments: 12,
					bevelEnabled: true,
					bevelSegments: 2,
					bevelSize: 0.1,
					bevelThickness: 0.1
				} );
				const textMesh = new Mesh( textGeometry, textMaterial );
				textMesh.name = `label_${symbol}`;
				textMesh.scale.setScalar( 0.5 );
				enableShadows( textMesh );
				boardRoot.add( textMesh );
				textMesh.updateMatrixWorld( false );
				const textBounds = new Box3;
				textBounds.setFromObject( textMesh );
				const textSize = new Vector3;
				textBounds.getSize( textSize );
				textMesh.position.copy(
					new Vector3(
						textSize.x * -.5 - 1,
						textSize.y * -.5 + gameState.size.height - y - 1,
						0
					)
				);
				const textMeshDown = textMesh.clone();
				textMeshDown.rotateOnAxis( new Vector3( 0, 0, 1 ), Math.PI );
				textMeshDown.name += '_down';
				textMeshDown.position.add( new Vector3( gameState.size.width + 1.4, textSize.y, 0 ) );
				boardRoot.add( textMeshDown );
			}

			const boardBounds = new Box3;
			boardBounds.setFromObject( boardRoot );
			const boardCenter = new Vector3;
			boardBounds.getCenter( boardCenter );
			const boardSize = new Vector3;
			boardBounds.getSize( boardSize );

			orthoCamera.position.x = boardCenter.x;
			orthoCamera.position.y = boardCenter.y;
			orthoCamera.position.z = 10;
			orthoCamera.left = boardSize.x * -.5;
			orthoCamera.right = boardSize.x * .5;
			orthoCamera.top = boardSize.y * .5;
			orthoCamera.bottom = boardSize.y * -.5;
			orthoCamera.lookAt( boardCenter );
			orthoCamera.updateMatrixWorld( false );
			orthoCamera.updateProjectionMatrix();

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
					pointLight.shadow.camera.position.copy( pointLight.position );
					pointLight.shadow.camera.lookAt( boardCenter );
					pointLight.shadow.camera.updateMatrixWorld( false );
					pointLight.shadow.camera.updateProjectionMatrix();
				}
				if( 'spotlight' in light ) {
					const spotLight = new SpotLight( hslToColor( light.spotlight.color ), light.spotlight.intensity, light.spotlight.distance, light.spotlight.angle / 180 * Math.PI );
					spotLight.name = `light_${++lightIndex}_spotlight`;
					spotLight.decay = light.spotlight.decay;
					spotLight.intensity = light.spotlight.intensity;
					spotLight.penumbra = light.spotlight.penumbra;
					spotLight.castShadow = true;
					scene.add( spotLight );
					spotLight.position.set( ...light.spotlight.position );
					spotLight.position.add( boardCenter );
					spotLight.updateMatrixWorld( false );
					spotLight.target.position.set( ...light.spotlight.target );
					spotLight.target.position.add( boardCenter );
					spotLight.target.updateMatrixWorld( false );
					spotLight.shadow.mapSize.width = 1024;
					spotLight.shadow.mapSize.height = 1024;
					spotLight.shadow.update( spotLight );
					spotLight.shadow.camera.position.copy( spotLight.position );
					spotLight.shadow.camera.fov = light.spotlight.angle;
					spotLight.shadow.camera.lookAt( spotLight.target.position );
					spotLight.shadow.camera.updateMatrixWorld( false );
					spotLight.shadow.camera.updateProjectionMatrix();
				}
			}


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
			canvas
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
