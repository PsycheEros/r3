export function loadText( url: string ) {
	return new Promise<string>( ( resolve, reject ) => {
		const xhr = new XMLHttpRequest;
		xhr.onreadystatechange = () => {
			if( xhr.readyState !== 4 ) { return; }
			const { status, statusText } = xhr;
			if( !/^2/.test( String( status ) ) ) {
				reject( new Error( `${status} ${statusText}: ${url}` ) );
				return;
			}
			resolve( xhr.responseText );
		};
		xhr.onerror = () => { reject( `Failed to load ${url}` ); };
		xhr.open( 'GET', url );
		xhr.send( null );
	} );
}

export async function loadJson( url: string ) {
	return JSON.parse( await loadText( url ) );
}

export function loadImage( url: string ) {
	return new Promise<HTMLImageElement>( ( resolve, reject ) => {
		const img = new Image;
		img.onload = () => { resolve( img ); };
		img.onerror = () => { reject( new Error( `Failed to load ${url}` ) ); };
		img.src = url;
	} );
}
