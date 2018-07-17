import { compare, genSalt, hash } from 'bcrypt';

export async function hashPassword( password: string ) {
	const salt = await genSalt();
	const passwordHash = await hash( password, salt );
	return passwordHash;
}

export async function checkPassword( password: string, passwordHash: string ) {
	const result = await compare( password, passwordHash );
	return result;
}
