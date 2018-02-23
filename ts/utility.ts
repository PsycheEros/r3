export function pick<T, K extends keyof T>( obj: T, ...keys: K[] ): Pick<T, K> {
	return keys.reduce( ( o, key ) => {
		o[ key ] = obj[ key ];
		return o;
	}, {} as Pick<T, K> );
}
