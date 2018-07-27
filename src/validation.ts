import { chatMessage as chatMessageRules, command as commandRules, nick as nickRules, roomName as roomNameRules, roomPassword as roomPasswordRules, userPassword as userPasswordRules } from 'data/validation.config.yaml';
export { chatMessageRules, commandRules, nickRules, roomNameRules, roomPasswordRules, userPasswordRules };

function getArray( s: void|string|ReadonlyArray<string> ) {
	if( !s ) return [];
	return ( typeof s === 'string' ) ? [ s ] : [ ...s ];
}

function chomp( str: string, ...prefixes: string[] ) {
	for( const prefix of prefixes ) {
		if( str.startsWith( prefix ) ) return str.slice( prefix.length ).trimLeft();
	}
	return null;
}

export function validateString( str: string, rules: StringValidationRules ): string[] {
	if( str == null ) return [ 'isNull' ];
	rules = { ...rules };
	if( rules.required == null && rules.length && rules.length.min > 0 ) rules.required = true;
	if( str === '' && rules.required === false ) return [];
	const strLower = str.toLowerCase();
	const errors = [];
	if( rules.length ) {
		if( {}.hasOwnProperty.call( rules.length, 'min' ) && str.length < rules.length.min ) errors.push( 'minLength' );
		if( {}.hasOwnProperty.call( rules.length, 'max' ) && str.length > rules.length.max ) errors.push( 'maxLength' );
	}
	if( rules.matches ) {
		const matches = ( typeof rules.matches === 'string' ) ? [ rules.matches ] : [ ...rules.matches ];
		if( !matches.every( m => new RegExp( m ).test( str ) ) ) errors.push( 'matches' );
	}
	if( rules.nonMatches ) {
		const nonMatches = ( typeof rules.nonMatches === 'string' ) ? [ rules.nonMatches ] : [ ...rules.nonMatches ];
		if( nonMatches.some( m => new RegExp( m ).test( str ) ) ) errors.push( 'nonMatches' );
	}
	if( !getArray( rules.matches ).every( m => new RegExp( m ).test( str ) ) ) errors.push( 'matches' );
	if( getArray( rules.nonMatches ).some( m => new RegExp( m ).test( str ) ) ) errors.push( 'nonMatches' );
	if( getArray( rules.nonEquals ).some( m => strLower === m.toLowerCase() ) ) errors.push( 'nonEquals' );
	return [ ...new Set( errors ) ];
}

export function validateCommand( value: string ) {
	if( value == null ) return [ 'isNull' ];

	const errors = validateString( value, commandRules );
	if( errors.length > 0 ) return errors;
	let str: string;

	str = chomp( value, '/nick' );
	if( str != null ) {
		if( isValidNick( str ) ) return [];
	}

	str = chomp( value, '/?', '/help', '/part', '/who' );
	if( str != null ) {
		if( !str ) return [];
	}

	str = chomp( value, '/say' );
	if( str != null ) {
		if( isValidChatMessage( str ) ) return [];
	}

	return [ 'invalidCommand' ];
}

export function isValidString( str: string, rules: StringValidationRules ) {
	return validateString( str, rules ).length === 0;
}

export function isValidNick( nick: string ) {
	return isValidString( nick, nickRules );
}

export function isValidRoomName( roomName: string ) {
	return isValidString( roomName, roomNameRules );
}

export function isValidRoomPassword( password: string ) {
	return isValidString( password, roomPasswordRules );
}

export function isValidChatMessage( message: string ) {
	return isValidString( message, chatMessageRules );
}

export function isValidCommand( command: string ) {
	return validateCommand( command ).length === 0;
}

export function isValidUserPassword( password: string ) {
	return isValidString( password, userPasswordRules );
}
