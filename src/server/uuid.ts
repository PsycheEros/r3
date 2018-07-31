import v4 from 'uuid/v4';
import u from 'mongo-uuid';
import { Binary } from 'mongodb';

export function uuid( str = v4() ): Binary {
	return u( Binary, str );
}

export function uuidStr( uuid: Binary ): string|null {
	if( !uuid ) return null;
	return u.stringify( uuid );
}
