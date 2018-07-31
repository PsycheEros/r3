import { chatMessage as chatMessageRules, command as commandRules, nick as nickRules, roomName as roomNameRules, roomPassword as roomPasswordRules, userPassword as userPasswordRules } from 'data/validation.config.yaml';
export { chatMessageRules, commandRules, nickRules, roomNameRules, roomPasswordRules, userPasswordRules };
import { isArrayLikeObject } from 'lodash';

type Pattern = string|RegExp;

function isArray<T>( s: any ): s is ReadonlyArray<T> {
	return isArrayLikeObject( s );
}

function getArray( s: void|Pattern|ReadonlyArray<Pattern> ) {
	if( !s ) return [];
	return isArray( s ) ? [ ...s ] : [ s ];
}

function chomp( str: string, ...prefixes: string[] ) {
	for( const prefix of prefixes ) {
		if( str.startsWith( prefix ) ) return str.slice( prefix.length ).trimLeft();
	}
	return null;
}

function testPattern( str: string, pattern: string, caseSensitive: boolean );
function testPattern( str: string, pattern: Pattern );
function testPattern( str: string, pattern: Pattern, caseSensitive = false ) {
	if( typeof pattern === 'string' ) {
		if( !caseSensitive ) {
			str = str.toLowerCase();
			pattern = pattern.toLowerCase();
		}
		return str.indexOf( pattern ) >= 0;
	} else {
		return pattern.test( str );
	}
}

export function validateString( str: string, rules: StringValidationRules ): string[] {
	if( str == null ) return [ 'isNull' ];
	rules = { ...rules };
	if( rules.required == null && rules.length && rules.length.min > 0 ) rules.required = true;
	if( str === '' && rules.required === false ) return [];
	const errors = [];
	if( rules.length ) {
		if( {}.hasOwnProperty.call( rules.length, 'min' ) && str.length < rules.length.min ) errors.push( 'minLength' );
		if( {}.hasOwnProperty.call( rules.length, 'max' ) && str.length > rules.length.max ) errors.push( 'maxLength' );
	}
	if( !getArray( rules.matches ).every( m => testPattern( str, m ) ) ) {
		errors.push( 'matches' );
	}
	if( getArray( rules.nonMatches ).some( m => testPattern( str, m ) ) ) {
		errors.push( 'nonMatches' );
	}
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
