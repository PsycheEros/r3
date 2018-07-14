import { validation as config } from 'data/config.yaml';

export function isValidNick( nick: string ) {
	if( !nick ) return false;
	if( nick.length > config.maxNickLength ) return false;
	return /^[_a-z][-_a-z0-9]+[_a-z0-9]+/i.test( nick );
}

export function isValidRoomName( roomName: string ) {
	if( !roomName ) return false;
	if( roomName.length > config.maxRoomNameLength ) return false;
	return true;
}
