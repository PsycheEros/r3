import Board from '../board';

import { Observable } from 'rxjs/Rx';

import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { screenToCanvas } from '../canvas';

function toCartesian( { x, y }: Point, center: Point ) {
	return { x: x - center.x, y: center.y - y };
}

function fromCartesian( { x, y }: Point, center: Point ) {
	return { x: x + center.x, y: center.y - y };
}

function drawRect(
	c2d: CanvasRenderingContext2D,
	x: number, y: number,
	width: number, height: number,
	r1: number,
	r2: number,
	r3: number,
	r4: number,
	ccw = false
) {
	const angles = [ Math.PI / 4, 7 * Math.PI / 8, 5 * Math.PI / 4, 3 * Math.PI / 7 ];
	if( ccw ) {
		c2d.moveTo( x + r4, y );
		c2d.quadraticCurveTo( x, y, x, y + r4 );
		c2d.lineTo( x, y + height - r3 );
		c2d.quadraticCurveTo( x, y + height, x + r3, y + height );
		c2d.lineTo( x + width - r2, y + height );
		c2d.quadraticCurveTo( x + width, y + height, x + width, y + height - r2 );
		c2d.lineTo( x + width, y + r1 );
		c2d.quadraticCurveTo( x + width, y, x + width - r1, y );
		c2d.lineTo( x + r4, y );
	} else {
		c2d.moveTo( x + r4, y );
		c2d.lineTo( x + width - r1, y );
		c2d.quadraticCurveTo( x + width, y, x + width, y + r1 );
		c2d.lineTo( x + width, y + height - r2 );
		c2d.quadraticCurveTo( x + width, y + height, x + width - r2, y + height );
		c2d.lineTo( x + r3, y + height );
		c2d.quadraticCurveTo( x, y + height, x, y + height - r3 );
		c2d.lineTo( x, y + r4 );
		c2d.quadraticCurveTo( x, y, x + r4, y );
	}
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
		this.render();
	}

	private render() {
		const { canvasElement } = this,
			canvas = canvasElement.nativeElement as HTMLCanvasElement,
			{ board } = this;
		requestAnimationFrame( () => {
			this.render();
			if( !board ) return;
			const { width, height } = canvas,
				c2d = canvas.getContext( '2d' ),
				lightSource: Point = {
					x: board.bounds.left + board.bounds.width * .25,
					y: board.bounds.top + board.bounds.height * .25
				};
			c2d.clearRect( 0, 0, width, height );

			const squareGradient = c2d.createRadialGradient(
				lightSource.x,
				lightSource.y,
				0,
				board.bounds.center.x,
				board.bounds.center.y,
				Math.min( board.bounds.width, board.bounds.height ) * .7
			);
			squareGradient.addColorStop(  0,  'rgba(255,255,255,.2)' );
			squareGradient.addColorStop( .4,  'rgba(255,255,255,0)' );

			c2d.beginPath();
			drawRect( c2d, board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height, 20, 20, 20, 20 );
			c2d.closePath();

			c2d.save();
			Object.assign( c2d, {
				fillStyle: '#3a3'
			} );
			c2d.fill();
			c2d.restore();

			c2d.save();
			Object.assign( c2d, {
				globalCompositeOperation: 'screen',
				fillStyle: squareGradient
			} );
			c2d.fill();
			c2d.restore();
			for( const { enabled, color, position: { x, y }, bounds: { left, top, width, height, center } } of board ) {
				if( !enabled ) { continue; }
				const lightSourceCart = toCartesian( lightSource, center ),
						lightDirection = Math.atan2( lightSourceCart.y, lightSourceCart.x ),
						lightDistance = 4,
						shadowCenter = fromCartesian( {
							x: Math.cos( lightDirection ) * lightDistance,
							y: Math.sin( lightDirection ) * lightDistance
						}, center ),
						lightCenter = fromCartesian( {
							x: Math.cos( lightDirection + Math.PI ) * lightDistance,
							y: Math.sin( lightDirection + Math.PI ) * lightDistance
						}, center ),
					path = ccw => {
						drawRect( c2d, left, top, width, height,
							x === board.width - 1 && y === 0                ? 16 : 4,
							x === board.width - 1 && y === board.height - 1 ? 16 : 4,
							x === 0               && y === board.height - 1 ? 16 : 4,
							x === 0               && y === 0                ? 16 : 4,
							ccw
						);
					};

				c2d.beginPath();
				path( false );
				c2d.closePath();

				c2d.save();
				Object.assign( c2d, {
					fillStyle: '#6c6',
					strokeStyle: '#363'
				} );
				c2d.fill();
				c2d.stroke();
				c2d.restore();

				c2d.save();
				c2d.clip();

				c2d.save();
				Object.assign( c2d, {
					globalCompositeOperation: 'screen',
					fillStyle: squareGradient
				} );
				c2d.fill();
				c2d.restore();

				c2d.save();
				c2d.beginPath();
				c2d.rect( board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height );
				path( true );
				c2d.closePath();
				Object.assign( c2d, {
					fillStyle: '#000',
					shadowColor: 'rgba(0,0,0,.4)',
					shadowBlur: lightDistance,
					shadowOffsetX: center.x - shadowCenter.x,
					shadowOffsetY: center.y - shadowCenter.y
				} );
				c2d.fill();
				c2d.restore();

				const radius = Math.min( width, height ) * .5;
				if( color !== null ) {
					// dark stones have highlights, light stones have shadows
					const isDark = color === 0,
						// shadows are reversed from light (+pi radians)
						radialGradient = c2d.createRadialGradient(
							center.x, center.y, 0,
							isDark ? lightCenter.x : shadowCenter.x,
							isDark ? lightCenter.y : shadowCenter.y,
							radius
						),
						rgb = isDark ? '255,255,255' : '0,0,0';
					radialGradient.addColorStop( 0,   `rgba(${rgb},0)` );
					radialGradient.addColorStop( .5,  `rgba(${rgb},.1)` );
					radialGradient.addColorStop( .75, `rgba(${rgb},0)` );
					radialGradient.addColorStop( 1,   `rgba(${rgb},.75)` );

					c2d.beginPath();
					c2d.arc( center.x, center.y, radius * .8, 0, Math.PI * 2 );

					c2d.save();
					Object.assign( c2d, {
						fillStyle: isDark ? '#111' : '#fff',
						shadowColor: 'rgba(0,0,0,.4)',
						shadowBlur: lightDistance,
						shadowOffsetX: center.x - shadowCenter.x,
						shadowOffsetY: center.y - shadowCenter.y
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
						globalCompositeOperation: isDark ? 'screen' : 'multiply',
						fillStyle: radialGradient
					} );
					c2d.fill();
					c2d.restore();
				}
				c2d.restore();
			}
		} );
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

