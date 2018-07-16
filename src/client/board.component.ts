import { Board } from 'src/board';
import { AfterViewInit, Component, ViewChild, ElementRef, Input, Output, OnChanges, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { screenToCanvas } from './canvas';
import { Subject, animationFrameScheduler, range } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { colors } from 'data/colors.yaml';

function toCartesian( { x, y }: Point, center: Point ) {
	return { x: x - center.x, y: center.y - y };
}

function fromCartesian( { x, y }: Point, center: Point ) {
	return { x: x + center.x, y: center.y - y };
}

function drawRect(
	c2d: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	r1: number,
	r2: number,
	r3: number,
	r4: number,
	ccw = false
) {
	c2d.moveTo( x + r4, y );
	if( ccw ) {
		c2d.quadraticCurveTo( x, y, x, y + r4 );
		c2d.lineTo( x, y + height - r3 );
		c2d.quadraticCurveTo( x, y + height, x + r3, y + height );
		c2d.lineTo( x + width - r2, y + height );
		c2d.quadraticCurveTo( x + width, y + height, x + width, y + height - r2 );
		c2d.lineTo( x + width, y + r1 );
		c2d.quadraticCurveTo( x + width, y, x + width - r1, y );
		c2d.lineTo( x + r4, y );
	} else {
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
	templateUrl: './board.component.html',
	styleUrls: [ './board.component.scss' ]
} )
export class BoardComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
	public ngAfterViewInit() {
		const canvas = this.canvas = this.canvasElementRef.nativeElement;
		this.c2d = canvas.getContext( '2d' );
		this.dirty.next( true );
	}

	public ngOnChanges() {
		this.dirty.next( true );
	}

	public ngOnDestroy() {
		const { dirty } = this;
		dirty.complete();
	}

	public ngOnInit() {
		this.dirty
		.pipe( observeOn( animationFrameScheduler ) )
		.subscribe( () => { this.render(); } );
	}

	@ViewChild( 'canvasElement' )
	private canvasElementRef: ElementRef;
	private canvas: HTMLCanvasElement;
	private c2d: CanvasRenderingContext2D;
	private readonly dirty = new Subject<true>();

	@Input()
	public colors: string[] = [];

	@Input()
	public board: Board;

	@Input()
	public lastMove: null|Point = null;

	@Output()
	public click = new EventEmitter<BoardMouseEvent>();

	@Output()
	public mousemove = new EventEmitter<BoardMouseEvent>();

	private render() {
		const { board } = this;
		if( !board ) return;
		const { canvas, c2d } = this,
			{ width, height } = canvas,
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
		squareGradient.addColorStop(  0, 'rgba(255,255,255,.2)' );
		squareGradient.addColorStop( .4, 'rgba(255,255,255,0)' );

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
			if( !enabled ) continue;
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
			Object.assign( c2d, {
				fillStyle: '#000'
				// shadowColor: 'hsla(0,0%,0%,.4)',
				// shadowBlur: lightDistance,
				// shadowOffsetX: center.x - shadowCenter.x,
				// shadowOffsetY: center.y - shadowCenter.y
			} );
			c2d.fill();
			c2d.restore();

			const radius = Math.min( width, height ) * .5;
			if( color !== null ) {
				const colorDef = colors[ this.colors[ color ] ];
				const [ hue, saturation, lightness ] = colorDef.color;
				const hsl = `${hue},${saturation}%,${lightness}%`;
				// dark stones have highlights, light stones have shadows
				const isDark = lightness < 50,
					// shadows are reversed from light (+pi radians)
					radialGradient = c2d.createRadialGradient(
						center.x, center.y, 0,
						isDark ? lightCenter.x : shadowCenter.x,
						isDark ? lightCenter.y : shadowCenter.y,
						radius
					);
				radialGradient.addColorStop( 0,   `hsla(${hue},${saturation}%,0%,0)` );
				radialGradient.addColorStop( .5,  `hsla(${hue},${saturation}%,0%,.1)` );
				radialGradient.addColorStop( .75, `hsla(${hue},${saturation}%,0%,0)` );
				radialGradient.addColorStop( 1,   `hsla(${hue},${saturation}%,0%,.75)` );

				c2d.beginPath();
				c2d.arc( center.x, center.y, radius * .8, 0, Math.PI * 2 );

				c2d.save();
				Object.assign( c2d, {
					fillStyle: `hsl(${hsl})`,
					shadowColor: 'hsla(0,0,0,.4)',
					shadowBlur: lightDistance,
					shadowOffsetX: center.x - shadowCenter.x,
					shadowOffsetY: center.y - shadowCenter.y
				} );
				c2d.fill();
				c2d.restore();

				c2d.save();
				Object.assign( c2d, {
					lineWidth: 1,
					strokeStyle: 'hsla(0,0,0,.5)'
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
		const { lastMove } = this;
		if( lastMove ) {
			const { bounds } = board.get( lastMove );
			c2d.save();
			const r = 5;
			const p = 7;
			const center = { x: bounds.right - r - p, y: bounds.top + r + p };

			const radialGradient = c2d.createRadialGradient(
				center.x, center.y, 0,
				center.x, center.y, r
			);
			radialGradient.addColorStop( 0,   `hsl(180,0%,50%)` );
			radialGradient.addColorStop( .5,  `hsl(180,100%,50%)` );
			radialGradient.addColorStop( 1,   `hsl(180,0%,50%)` );

			c2d.fillStyle = radialGradient;
			c2d.beginPath();
			c2d.ellipse( bounds.right - r - p, bounds.top + r + p, r, r, 0, 0, Math.PI * 2 );
			c2d.fill();
			c2d.closePath();
			c2d.restore();
		}
	}

	public handleEvent( emitter: EventEmitter<BoardMouseEvent>, { clientX, clientY }: MouseEvent ) {
		const { board, canvas } = this,
			screenPosition = { x: clientX, y: clientY },
			canvasPosition = screenToCanvas( canvas, { x: clientX, y: clientY } ),
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