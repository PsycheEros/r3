export function screenToCanvas( canvas: HTMLCanvasElement, { x, y }: Point ): Point {
	const { width, height } = canvas,
		rect = canvas.getBoundingClientRect();
	return { x: ( x - rect.left ) * ( width / rect.width ), y: ( y - rect.top ) * ( height / rect.height ) };
}

export function canvasToScreen( canvas: HTMLCanvasElement, { x, y }: Point ): Point {
	const { width, height } = canvas,
		rect = canvas.getBoundingClientRect();
	return { x: ( x * ( rect.width / width ) ) + rect.left, y: ( y * ( rect.height / height ) ) + rect.top };
}
