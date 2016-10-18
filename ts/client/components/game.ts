import GameState from '../../shared/game-state';
import Square from '../../shared/square';
import Rules from '../../shared/rules';

import { Component, ViewChild, ElementRef } from '@angular/core';
import { SessionService } from '../services/index';

import { screenToCanvas } from '../canvas';

@Component( {
	selector: 'game',
	templateUrl: 'templates/game.html',
	providers: []
} )
export class GameComponent {
	constructor( private element: ElementRef, private session: SessionService ) {}

	@ViewChild( 'canvasElement' )
	private canvasElement: ElementRef;

	protected ngOnInit() {
		const { session } = this,
			rules = new Rules;
		session.getGameState().subscribe( gameState => {
			this.gameState = gameState;
			const { board } = gameState;
			for( let color of [ 0, 1 ] ) {
				this.scores[ color ] = rules.getScore( board, color ); 
			}
		} );
	}

	protected ngAfterViewInit() {
		const { session, canvasElement } = this,
			canvas = canvasElement.nativeElement as HTMLCanvasElement,
			{ width, height } = canvas,
			rules = new Rules,
			c2d = canvas.getContext( '2d' );
		let selectedSquare: Square|null = null;
		const render = ( time: number ) => {
			const { gameState: { board, turn } } = this;
			c2d.clearRect( 0, 0, width, height );
			c2d.save();
			c2d.fillStyle = '#6c6';
			c2d.fillRect( board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height );
			c2d.strokeStyle = 'black';
			for( const { enabled, color, position: { x, y }, bounds: { left, top, width, height, center } } of board ) {
				if( !enabled ) { continue; }
				c2d.save();
				c2d.lineWidth = 1;
				c2d.fillStyle = '#8c8';
				c2d.fillRect( left, top, width, height );
				c2d.strokeRect( left, top, width, height );

				if( color !== null ) {
					const radialGradient = c2d.createRadialGradient( center.x, center.y, 0, center.x, center.y - 6, 32 ),
						rgb = color === 0 ? '255,255,255' : '0,0,0';
					radialGradient.addColorStop( 0,   `rgba(${rgb},0)` );
					radialGradient.addColorStop( .5,  `rgba(${rgb},.1)` );
					radialGradient.addColorStop( .75, `rgba(${rgb},0)` );
					radialGradient.addColorStop( 1,   `rgba(${rgb},.75)` );
					c2d.save();
					c2d.lineWidth = 1;
					c2d.beginPath();
					c2d.ellipse( center.x, center.y, width * .4, height * .4, 0, 0, Math.PI * 2 );
					c2d.fillStyle = color === 0 ? '#111' : '#fff';
					c2d.shadowColor = 'rgba(0,0,0,.2)';
					c2d.shadowBlur = 4;
					c2d.shadowOffsetX = 0;
					c2d.shadowOffsetY = -2;
					c2d.fill();
					c2d.shadowColor = undefined;
					c2d.globalCompositeOperation = color === 0 ? 'screen' : 'multiply';
					c2d.fillStyle = radialGradient;
					c2d.fill();
					c2d.stroke();
					c2d.restore();
				}

				if( rules.isValid( board, { x, y }, turn ) ) {
					c2d.save();
					c2d.lineWidth = 8;
					c2d.strokeStyle = turn === 0 ? '#222' : '#ddd';
					c2d.beginPath();
					c2d.moveTo( center.x - width * .25, center.y - height * .25 );
					c2d.lineTo( center.x + width * .25, center.y + height * .25 );
					c2d.moveTo( center.x + width * .25, center.y - height * .25 );
					c2d.lineTo( center.x - width * .25, center.y + height * .25 );
					c2d.stroke();
					c2d.restore();
				}

				c2d.restore();
			}

			c2d.restore();
			requestAnimationFrame( render );
		};
		requestAnimationFrame( render );

		const onMouseMove = ( { clientX, clientY }: { clientX: number, clientY: number } ) => {
			const { gameState: { board, turn } } = this;
			const { x, y } = screenToCanvas( canvas, { x: clientX, y: clientY } );
			selectedSquare = board.hitTest( { x, y } );
			document.documentElement.style.cursor =
				rules.isGameOver( board )
			||	( selectedSquare && rules.isValid( board, selectedSquare.position, turn ) ) ? 'pointer' : null;
		};

		const onClick = ( { clientX, clientY }: { clientX: number, clientY: number } ) => {
			const { gameState: { board } } = this;
			if( rules.isGameOver( board ) ) {
				session.newGame();
				return;
			}

			const { x, y } = screenToCanvas( canvas, { x: clientX, y: clientY } ),
				square = board.hitTest( { x, y } );
			if( square ) {
				session.makeMove( square.position );
			}
		};

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'click', onClick, false );
		document.addEventListener( 'touchstart', e => {
			for( const touch of Array.from( e.touches ) ) {
				onClick( touch );
			}
		}, false );
	}

	public gameState = new GameState;
	public scores = [] as number[];
}

