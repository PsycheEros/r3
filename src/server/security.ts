import { compare, genSalt, hash } from 'bcrypt-nodejs';
import { Binary } from 'mongodb';
import { promisify } from 'util';

export async function hashPassword( password: string ) {
	if( !password ) return null;
	const salt = await promisify( genSalt )( null );
	const passwordHash = await promisify( hash )( password, salt, null );
	const passwordHashBuffer = Buffer.from( passwordHash, 'utf8' );
	return new Binary( passwordHashBuffer, Binary.SUBTYPE_BYTE_ARRAY );
}

export async function checkPassword( password: string, passwordHash: Binary ) {
	const passwordHashStr = ( passwordHash && passwordHash.buffer.toString( 'utf8' ) ) || '';
	// if a password is specified but hash is empty, go ahead and compare anyway to prevent timing attacks
	if( !password && !passwordHashStr ) return true;
	const result = await promisify( compare )( password, passwordHashStr );
	return result;
}
