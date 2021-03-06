import { Board } from 'src/board';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, OnChanges, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subject, animationFrameScheduler, combineLatest, fromEvent, merge, of, range } from 'rxjs';
import { map, filter, switchMap, mergeMap, takeUntil, scan, observeOn, repeatWhen, distinctUntilChanged } from 'rxjs/operators';
import { colors } from 'data/colors.yaml';
import boardSettings from 'data/board.yaml';

import { Scene, Renderer, SpotLight, Color, PCFSoftShadowMap, AmbientLight, Raycaster, Object3D, Box3, Vector3, DirectionalLight, PointLight, Camera, AnimationClip, Mesh, MeshStandardMaterial, OrthographicCamera, TextGeometry, FontLoader, WebGLRenderer, AnimationMixer, Clock, AnimationAction, LoopOnce, NumberKeyframeTrack, InterpolateSmooth, BooleanKeyframeTrack, KeyframeTrack } from 'three';import GLTFLoader from 'three-gltf-loader';
import { Grid } from 'src/grid';

interface GltfFile {
	animations: ReadonlyArray<AnimationClip>;
	scene: Scene;
	scenes: ReadonlyArray<Scene>;
	cameras: ReadonlyArray<Camera>;
	asset: object;
}

interface LoadedResources {
	animations: Map<string, AnimationClip>;
	objects: Map<string, Object3D>;
}

interface SquareObjects {
	board: Object3D;
	marker: Object3D;
	piece: Object3D;
	square: Object3D;
}

function loadResources( src: string ) {
	return new Promise<LoadedResources>( ( resolve, reject ) => {
		const loader = new GLTFLoader;
		loader.load( src,
			( file: GltfFile ) => {
				const animations = new Map<string, AnimationClip>();
				for( const animation of file.animations ) {
					if( animation && animation.name ) {
						animations.set( animation.name, animation );
					}
				}
				const objects = new Map<string, Object3D>();
				for( const child of file.scene.children ) {
					if( child && child.name ) {
						objects.set( child.name, child );
					}
				}
				resolve( { animations, objects } );
			},
			() => {},
			( { error } ) => { reject( new Error( error ) ); }
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
		if( o instanceof Mesh ) o.castShadow = o.receiveShadow = enable;
		else if( ( o instanceof PointLight ) || ( o instanceof SpotLight ) ) o.castShadow = enable;
	} );
}

function generateFade( obj: Object3D, duration: number, visible: boolean ) {
	const tracks = [
		new BooleanKeyframeTrack( '.visible', [ 0, duration ], [ true, visible ] )
	] as KeyframeTrack[];

	function traverse( o: Object3D, name = '' ) {
		if( o instanceof Mesh ) {
			tracks.push(
				new BooleanKeyframeTrack( `${name}.castShadow`, [ 0, duration * ( visible ? .4 : .6 ) ], [ !visible, visible ] ),
				new NumberKeyframeTrack( `${name}.material.opacity`, [ 0, duration ], [ visible ? 0 : 1, visible ? 1 : 0 ], InterpolateSmooth ),
				new BooleanKeyframeTrack( `${name}.material.transparent`, [ 0, duration ], [ true, false ] )
			);
		}
		for( const child of o.children ) {
			traverse( child, ( name ? `.${name}` : '' ) + child.name );
		}
	}

	traverse( obj );

	return new AnimationClip( `${obj.name}Fade${visible?'In':'Out'}`, duration, tracks );
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
	private readonly destroyed = new Subject<true>();

	public ngOnInit() {
		const assetsPromise = loadResources( require( 'data/board.glb' ) );
		const font = loadFont( require( 'data/font.json' ) );
		let dirty = true;

		const clock = new Clock;

		const textMaterial = new MeshStandardMaterial( {
			color: ( new Color ).setHSL( 3/18, 1, .5 ),
			metalness: 1,
			roughness: .5
		} );

		const orthoCamera = new OrthographicCamera( 0, 0, 0, 0, 0, 50 );
		orthoCamera.name = 'camera';

		const actions = new Set<AnimationAction>();
		function fadeObj( obj: Object3D, firstRun: boolean, wasVisible: boolean, isVisible: boolean ) {
			const fadeInAction = obj.userData.fadeInAction as AnimationAction;
			const fadeOutAction = obj.userData.fadeOutAction as AnimationAction;
			if( fadeInAction.isRunning() ) fadeInAction.stop();
			if( fadeOutAction.isRunning() ) fadeOutAction.stop();
			if( firstRun || ( isVisible === wasVisible ) ) {
				obj.traverse( o => {
					o.visible = isVisible;
					o.castShadow = isVisible;
					if( o instanceof Mesh ) {
						const material = o.material as MeshStandardMaterial;
						material.transparent = false;
						material.opacity = isVisible ? 1 : 0;
					}
				} );
			} else {
				obj.traverse( o => {
					o.visible = true;
					o.castShadow = wasVisible;
					if( o instanceof Mesh ) {
						const material = o.material as MeshStandardMaterial;
						material.transparent = true;
						material.opacity = wasVisible ? 1 : 0;
					}
				} );
				const nextAction = isVisible ? fadeInAction : fadeOutAction;
				actions.add( nextAction.reset().play() );
			}
		}

		combineLatest( this.renderer, this.scene )
		.pipe(
			filter( e => e.every( e => !!e ) ),
			switchMap( ( [ renderer, scene ] ) =>
				of( { renderer, scene } )
				.pipe(
					repeatWhen( () =>
						range( 0, Infinity, animationFrameScheduler )
						// fake animation lag
						// .pipe( switchMap( () => timer( Math.random() * 1000 ) ) )
					)
				)
			),
			takeUntil( this.destroyed ),
			observeOn( animationFrameScheduler )
		)
		.subscribe( ( { renderer, scene } ) => {
			const delta = clock.getDelta();

			const a = [ ...actions.values() ];
			const hasActions = a.length > 0;

			if( a.some( a => a.isRunning() ) ) {
				dirty = true;
			} else if( actions.size > 0 ) {
				actions.clear();
				dirty = true;
			}

			if( hasActions ) {
				const mixer = scene.userData.mixer as AnimationMixer;
				mixer.update( delta );
			}

			if( !dirty ) return;
			renderer.render( scene, orthoCamera );
			dirty = false;
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
						const [ position = null ] =
							raycaster
							.intersectObjects( scene.children, true )
							.map( i => i.object.userData.position as Point )
							.filter( e => !!e );

						return {
							type,
							point,
							position
						};
					} )
				);
			} )
		);

		mouseEvents
		.pipe( filter( e => e.type === 'mousemove' ) )
		.subscribe( ( { position } ) => {
			this.mousemove.emit( { position } );
		} );

		mouseEvents
		.pipe( filter( e => [ 'touchend', 'click' ].includes( e.type ) ) )
		.subscribe( ( { position } ) => {
			this.click.emit( { position } );
		} );

		function getScene( { height, width }: Size, { animations, objects }: LoadedResources ) {
			const scene = new Scene;
			scene.name = 'scene';
			const mixer = new AnimationMixer( scene );
			scene.userData.mixer = mixer;

			const borderProto = objects.get( 'Border' ) as Mesh;
			const boardProto = objects.get( 'Board' ) as Mesh;
			const markerProto = objects.get( 'Marker' ) as Mesh;
			const pieceProto = objects.get( 'Piece' );
			const flipClip = animations.get( 'Flip' );
			const flipDuration = flipClip.duration;
			const pieceFadeInClip = generateFade( pieceProto, flipDuration, true );
			const pieceFadeOutClip = generateFade( pieceProto, flipDuration, false );
			const markerFadeInClip = generateFade( markerProto, flipDuration, true );
			const markerFadeOutClip = generateFade( markerProto, flipDuration, false );

			const boardRoot = new Object3D;
			boardRoot.name = 'board_root';
			scene.add( boardRoot );
			const border = borderProto.clone();
			border.name = 'border';
			boardRoot.add( border );
			border.scale.setX( width + 2 );
			border.scale.setZ( height + 2 );
			border.position.setX( ( width - 1 ) * .5 );
			border.position.setY( ( height - 1 ) * .5 );

			const squareObjects = scene.userData.squareObjects = new Grid<SquareObjects>( width, height );
			for( let y = 0; y < height; ++y )
			for( let x = 0; x < width; ++x ) {
				const square = new Object3D;
				square.name = `square_${x}_${y}`;

				const board = boardProto.clone();
				board.name = `board_${x}_${y}`;
				board.userData.position = { x, y };
				square.add( board );

				square.position.set( x, y, 0 );
				const piece = pieceProto.clone();
				piece.rotateX( Math.PI );
				piece.name = `piece_${x}_${y}`;
				piece.userData.flipAction = mixer.clipAction( flipClip, piece ).setLoop( LoopOnce, 1 );
				piece.userData.fadeInAction = mixer.clipAction( pieceFadeInClip, piece ).setLoop( LoopOnce, 1 );
				piece.userData.fadeInAction.clampWhenFinished = true;
				piece.userData.fadeOutAction = mixer.clipAction( pieceFadeOutClip, piece ).setLoop( LoopOnce, 1 );
				piece.userData.fadeOutAction.clampWhenFinished = true;
				square.add( piece );

				const marker = markerProto.clone();
				square.add( marker );
				marker.name = `marker_${x}_${y}`;
				marker.userData.fadeInAction = mixer.clipAction( markerFadeInClip, marker ).setLoop( LoopOnce, 1 );
				marker.userData.fadeInAction.clampWhenFinished = true;
				marker.userData.fadeOutAction = mixer.clipAction( markerFadeOutClip, marker ).setLoop( LoopOnce, 1 );
				marker.userData.fadeOutAction.clampWhenFinished = true;

				square.traverse( o => {
					if( o instanceof Mesh && o.material instanceof MeshStandardMaterial ) {
						o.material = o.material.clone();
					}
				} );
				boardRoot.add( square );

				squareObjects.set( { x, y }, { board, marker, piece, square } );
			}

		for( let x = 0; x < width; ++x ) {
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
				textGeometry.center();
				const textMesh = new Mesh( textGeometry, textMaterial );
				textMesh.name = `label_${symbol}`;
				textMesh.scale.setScalar( 0.5 );
				boardRoot.add( textMesh );
				textMesh.updateMatrixWorld( false );
				const center = new Vector3( x, -1, 0 );
				textMesh.position.copy( center );
				const textMeshDown = textMesh.clone();
				textMeshDown.rotateOnAxis( new Vector3( 0, 0, 1 ), Math.PI );
				textMeshDown.name += '_down';
				textMeshDown.position.add( new Vector3( 0, height + 1, 0 ) );
				boardRoot.add( textMeshDown );
			}

			for( let y = 0; y < height; ++y ) {
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
				textGeometry.center();
				const textMesh = new Mesh( textGeometry, textMaterial );
				textMesh.name = `label_${symbol}`;
				textMesh.scale.setScalar( 0.5 );
				boardRoot.add( textMesh );
				textMesh.updateMatrixWorld( false );
				const center = new Vector3( -1, height - y - 1, 0 );
				textMesh.position.copy( center );
				const textMeshDown = textMesh.clone();
				textMeshDown.rotateOnAxis( new Vector3( 0, 0, 1 ), Math.PI );
				textMeshDown.name += '_down';
				textMeshDown.position.add( new Vector3( width + 1, 0, 0 ) );
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

			enableShadows( scene );
			return scene;
		}

		this.gameState
		.pipe(
			distinctUntilChanged(),
			switchMap( async ( gameState ) => ( { gameState, assets: await assetsPromise } ) ),
			scan<{ gameState: ClientGameState, assets: LoadedResources }, { gameState: ClientGameState|null, scene: Scene|null }>(
				( { gameState: oldGameState, scene }, { gameState, assets } ) => {
					if( !scene || !oldGameState || gameState.size.width !== oldGameState.size.width || gameState.size.height !== oldGameState.size.height ) {
						oldGameState = null;
						scene = getScene( gameState.size, assets );
					}
					const board = Board.fromGameState( gameState );
					const oldBoard = oldGameState && Board.fromGameState( oldGameState );
					const { lastMove, size: { width, height } } = gameState;

					const squareObjects = scene.userData.squareObjects as Grid<SquareObjects>;

					for( let y = 0; y < height; ++y )
					for( let x = 0; x < width; ++x ) {
						const { piece: pieceObj, marker: markerObj } = squareObjects.get( { x, y } );
						const square = board.get( { x, y } );
						const oldSquare = oldBoard && oldBoard.get( { x, y } );

						fadeObj(
							markerObj,
							!oldGameState,
							!!( oldGameState && oldGameState.lastMove && ( oldGameState.lastMove.x === x ) && ( oldGameState.lastMove.y === y ) ),
							!!( lastMove && ( lastMove.x === x ) && ( lastMove.y === y ) )
						);

						fadeObj(
							pieceObj,
							!oldGameState,
							!!( oldSquare && ( oldSquare.color != null ) ),
							square.color != null
						);

						if( square.color != null ) {
							const [ top, bottom ] = pieceObj.children as Mesh[];
							( top.material as MeshStandardMaterial ).color = hslToColor( colors[ this.colors[ square.color ] ].color );

							if( oldSquare && ( oldSquare.color != null ) && ( oldSquare.color !== square.color ) ) {
								( bottom.material as MeshStandardMaterial ).color = hslToColor( colors[ this.colors[ oldSquare.color ] ].color );
								const action = pieceObj.userData.flipAction as AnimationAction;
								actions.add( action.reset().play() );
							}
						}
					}
					dirty = true;
					return { gameState, scene };
				}, { gameState: null, scene: null }
			),
			map( ( { scene } ) => scene )
		)
		.subscribe( this.scene );
	}

	public ngAfterViewInit() {
		const canvas = this.canvasElementRef.nativeElement;
		const renderer = new WebGLRenderer( {
			antialias: true,
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
		this.destroyed.next( true );
		this.destroyed.complete();
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
