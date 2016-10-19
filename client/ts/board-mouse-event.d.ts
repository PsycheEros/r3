import Square from './square';

declare global {
	export interface BoardMouseEvent {
		square: Square|null;
		position: {
			screen: Point,
			canvas: Point,
			board: Point|null
		}
	}
}
