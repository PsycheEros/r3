import { Bounds } from './bounds';

declare global {
	export interface SquareMetrics {
		position: Point;
		bounds: Bounds;
		color: Color;
	}
}
