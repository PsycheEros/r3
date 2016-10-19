import Board from '../board';
import Square from '../square';

import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { screenToCanvas } from '../canvas';

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
	public click1 = new EventEmitter<BoardMouseEvent>();

	@Output()
	public mousemove1 = new EventEmitter<BoardMouseEvent>();

	protected ngAfterViewInit() {
		const { canvasElement } = this,
			canvas = canvasElement.nativeElement as HTMLCanvasElement,
			{ width, height } = canvas,
			c2d = canvas.getContext( '2d' );
		const render = ( time: number ) => {
			const { board } = this;
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
				const radius = Math.min( width, height ) * .5;
				if( color !== null ) {
					const radialGradient = c2d.createRadialGradient( center.x, center.y, 0, center.x, center.y - 2, radius ),
						rgb = color === 0 ? '255,255,255' : '0,0,0';
					radialGradient.addColorStop( 0,   `rgba(${rgb},0)` );
					radialGradient.addColorStop( .5,  `rgba(${rgb},.1)` );
					radialGradient.addColorStop( .75, `rgba(${rgb},0)` );
					radialGradient.addColorStop( 1,   `rgba(${rgb},.75)` );

					c2d.save();
					c2d.lineWidth = 1;
					c2d.beginPath();
					c2d.arc( center.x, center.y, radius * .8, 0, Math.PI * 2 );
					c2d.fillStyle = color === 0 ? '#111' : '#fff';
					c2d.shadowColor = 'rgba(0,0,0,.4)';
					c2d.shadowBlur = 4;
					c2d.shadowOffsetX = 0;
					c2d.shadowOffsetY = 2;
					c2d.fill();
					c2d.shadowColor = undefined;
					c2d.globalCompositeOperation = color === 0 ? 'screen' : 'multiply';
					c2d.fillStyle = radialGradient;
					c2d.fill();
					c2d.stroke();
					c2d.restore();
				}

				c2d.restore();
			}

			c2d.restore();
			requestAnimationFrame( render );
		};
		requestAnimationFrame( render );
	}

	private handleEvent( emitter: EventEmitter<BoardMouseEvent>, { clientX, clientY }: MouseEvent ) {
		const { board, mousemove1, canvasElement } = this,
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
			} } );
	}
}

