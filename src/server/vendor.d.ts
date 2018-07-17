declare module 'bcrypt-nodejs' {
	export function genSalt( rounds: number|void, callback: NodeCallback<string> );
	export function hash( data: string, salt: string, progress: Function|null, callback: NodeCallback<string> );
	export function compare( data: string, encrypted: string, callback: NodeCallback<boolean> );
}
