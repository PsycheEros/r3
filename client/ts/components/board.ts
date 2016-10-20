import Board from '../board';
import Square from '../square';

import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { screenToCanvas } from '../canvas';

function drawRect(
	c2d: CanvasRenderingContext2D,
	x: number, y: number,
	width: number, height: number,
	r1: number,
	r2: number,
	r3: number,
	r4: number
) {
	const angles = [ Math.PI / 4, 7 * Math.PI / 8, 5 * Math.PI / 4, 3 * Math.PI / 7 ];
	c2d.beginPath();
	c2d.moveTo( x + r4, y );
	c2d.lineTo( x + width - r1, y );
	c2d.quadraticCurveTo( x + width, y, x + width, y + r1 );
	c2d.lineTo( x + width, y + height - r2 );
	c2d.quadraticCurveTo( x + width, y + height, x + width - r2, y + height );
	c2d.lineTo( x + r3, y + height );
	c2d.quadraticCurveTo( x, y + height, x, y + height - r3 );
	c2d.lineTo( x, y + r4 );
	c2d.quadraticCurveTo( x, y, x + r4, y );
	c2d.closePath();
}

@Component( {
	selector: 'board',
	templateUrl: 'templates/board.html'
} )
export class BoardComponent {
	constructor( private element: ElementRef ) {}

	@ViewChild( 'canvasElement' )
	private canvasElement: ElementRef;

	@Input()
	public board: Board;

	@Output()
	public click = new EventEmitter<BoardMouseEvent>();

	@Output()
	public mousemove = new EventEmitter<BoardMouseEvent>();

	protected ngAfterViewInit() {
		const { canvasElement } = this,
			canvas = canvasElement.nativeElement as HTMLCanvasElement,
			{ width, height } = canvas,
			c2d = canvas.getContext( '2d' );		
		const render = ( time: number ) => {
			const { board } = this;
			c2d.clearRect( 0, 0, width, height );

			const squareGradient = c2d.createRadialGradient(
				board.bounds.left + board.bounds.width * .25,
				board.bounds.top + board.bounds.height * .25,
				0,
				board.bounds.center.x,
				board.bounds.center.y,
				Math.min( board.bounds.width, board.bounds.height ) * .7
			);
			squareGradient.addColorStop(  0,  'rgba(255,255,255,.2)' );
			squareGradient.addColorStop( .4,  'rgba(255,255,255,0)' );

			c2d.save();
			Object.assign( c2d, {
				fillStyle: '#3c3'
			} );
			drawRect( c2d, board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height, 20, 20, 20, 20 );
			c2d.fill();
			c2d.restore();
			for( const { enabled, color, position: { x, y }, bounds: { left, top, width, height, center } } of board ) {
				if( !enabled ) { continue; }
				drawRect( c2d, left, top, width, height, 
					x === board.width - 1 && y === 0                ? 16 : 0,
					x === board.width - 1 && y === board.height - 1 ? 16 : 0,
					x === 0               && y === board.height - 1 ? 16 : 0,
					x === 0               && y === 0                ? 16 : 0,
				);

				c2d.save();
				Object.assign( c2d, {
					shadowColor: 'rgba(0,0,0,.4)',
					shadowBlur: 2,
					shadowOffsetX: 2,
					shadowOffsetY: 2,
					fillStyle: '#6c6'
				} );
				c2d.fill();
				c2d.restore();

				c2d.save();
				Object.assign( c2d, {
					lineWidth: 1,
					strokeStyle: '#363'
				} );
				c2d.stroke();
				c2d.restore();

				c2d.save();
				Object.assign( c2d, {
					globalCompositeOperation: 'screen',
					fillStyle: squareGradient
				} );
				c2d.fill();
				c2d.restore();

				const radius = Math.min( width, height ) * .5;
				if( color !== null ) {
					const radialGradient = c2d.createRadialGradient( center.x, center.y, 0, center.x, center.y - 2, radius ),
						rgb = color === 0 ? '255,255,255' : '0,0,0';
					radialGradient.addColorStop( 0,   `rgba(${rgb},0)` );
					radialGradient.addColorStop( .5,  `rgba(${rgb},.1)` );
					radialGradient.addColorStop( .75, `rgba(${rgb},0)` );
					radialGradient.addColorStop( 1,   `rgba(${rgb},.75)` );

					c2d.beginPath();
					c2d.arc( center.x, center.y, radius * .8, 0, Math.PI * 2 );
	
					c2d.save();
					Object.assign( c2d, {
						fillStyle: color === 0 ? '#111' : '#fff',
						shadowColor: 'rgba(0,0,0,.4)',
						shadowBlur: 4,
						shadowOffsetX: 2,
						shadowOffsetY: 2
					} );
					c2d.fill();
					c2d.restore();

					c2d.save();
					Object.assign( c2d, {
						lineWidth: 1,
						strokeStyle: 'rgba(0,0,0,.5)'
					} );
					c2d.stroke();
					c2d.restore();
	
					c2d.save();
					Object.assign( c2d, {
						globalCompositeOperation: color === 0 ? 'screen' : 'multiply',
						fillStyle: radialGradient
					} );
					c2d.fill();
					c2d.restore();
				}
		}

			requestAnimationFrame( render );
		};
		requestAnimationFrame( render );
	}

	private handleEvent( emitter: EventEmitter<BoardMouseEvent>, { clientX, clientY }: MouseEvent ) {
		const { board, mousemove, canvasElement } = this,
			screenPosition = { x: clientX, y: clientY },
			canvasPosition = screenToCanvas( canvasElement.nativeElement, { x: clientX, y: clientY } ),
			square = board.hitTest( canvasPosition ),
			boardPosition = square && square.position || null;
		emitter.emit( {
			square,
			position: {
				screen: screenPosition,
				canvas: canvasPosition,
				board: boardPosition
			}
		} );
	}
}

