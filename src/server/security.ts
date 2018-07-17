import { compare, genSalt, hash } from 'bcrypt-nodejs';
import { promisify } from 'util';

export async function hashPassword( password: string ) {
	if( !password ) return '';
	const salt = await promisify( genSalt )( null );
	const passwordHash = await promisify( hash )( password, salt, null );
	return passwordHash;
}

export async function checkPassword( password: string, passwordHash: string ) {
	// if a password is specified but hash is empty, go ahead and compare anyway to prevent timing attacks
	if( !password && !passwordHash ) return true;
	const result = await promisify( compare )( password, passwordHash );
	return result;
}
