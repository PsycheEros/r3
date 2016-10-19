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

	public get center() {
		const { left, top, width, height } = this,
			x = left + width * .5,
			y = top + height * .5;
		return { x, y };
	}

	public get n() {
		const { left, top, width } = this,
			x = left + width * .5,
			y = top;
		return { x, y };
	}

	public get ne() {
		const { left, top, width } = this,
			x = left + width,
			y = top;
		return { x, y };
	}

	public get e() {
		const { left, top, width, height } = this,
			x = left + width,
			y = top + height * .5;
		return { x, y };
	}

	public get se() {
		const { left, top, width, height } = this,
			x = left + width,
			y = top + height;
		return { x, y };
	}

	public get s() {
		const { left, top, width, height } = this,
			x = left + width * .5,
			y = top + height;
		return { x, y };
	}

	public get sw() {
		const { left, top, height } = this,
			x = left,
			y = top + height;
		return { x, y };
	}

	public get w() {
		const { left, top, height } = this,
			x = left,
			y = top + height * .5;
		return { x, y };
	}

	public get nw() {
		const { left, top } = this,
			x = left,
			y = top;
		return { x, y };
	}

	public hitTest( { x, y }: Point ) {
		const { top, right, bottom, left } = this;
		return x >= left && x <= right
			&& y >= top && y <= bottom;
	}
}
