type LogOptions = {
	enabled?: boolean;
	logArguments?: boolean;
	logReturnValue?: boolean;
};

const defaultLogOptions = {
	enabled: true,
	logArguments: true,
	logReturnValue: true
};

export function Log( options: LogOptions|boolean = true ) {
	if( typeof options === 'boolean' ) {
		options = { enabled: options };
	}
	const { enabled, logArguments, logReturnValue } = Object.assign( {}, defaultLogOptions, options );
	return ( target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function> ) => {
		if( !enabled ) { return; }
		const { value: method } = descriptor;
		descriptor.value = function( ...args ) {
			let retval: any;
			try {
				retval = method!.apply( this, args );
				return retval;
			} finally {
				const parts = [] as any[];
				if( logArguments ) {
					parts.push( args );
				}
				if( logReturnValue ) {
					parts.push( retval );
				}
				console.log( [ target, propertyKey ], ...parts );
			}
		};
	};
}
