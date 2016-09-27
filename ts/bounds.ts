export default class Bounds {
	public constructor( public readonly left: number, public readonly top: number, public readonly width: number, public readonly height: number ) {}

	public get bottom() {
		const { top, height } = this;
		return top + height;
	}

	public get right() {
		const { left, width } = this;
		return left + width;
	}

	public hitTest( { x, y }: Point ) {
		const { top, right, bottom, left } = this;
		return x >= left && x <= right
			&& y >= top && y <= bottom;
	}
}