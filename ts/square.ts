import Bounds from './bounds';

export default class Square {
	public constructor( public readonly position: Point, public readonly bounds: Bounds ) {}

	public enabled = true;
	public color: number|null = null;

	public get empty() { return this.color === null; }
}
