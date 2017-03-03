import { Bounds } from './bounds';

declare global {
	export interface Square {
		position: Point;
		bounds: Bounds;
		enabled: boolean;
		color: number|null;
	}
}
