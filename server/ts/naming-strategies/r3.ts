import { NamingStrategy } from 'typeorm';
import { DefaultNamingStrategy } from 'typeorm/naming-strategy/DefaultNamingStrategy';
import { Log } from '../decorators/log';

function splitWords( str: string ) {
	const separators = /[-_\s]/g,
		upper = /[A-Z]/,
		lower = /[a-z]/,
		retval = [] as string[];
	let current = '';
	let previousCase = null as boolean|null;
	function add() {
		if( !current ) return;
		retval.push( current );
		current = '';
		previousCase = null;
	}
	for( let char of str.split( '' ) ) {
		if( separators.test( char ) ) {
			add();
			continue;
		}
		const isUpper = upper.test( char ),
			isLower = lower.test( char ),
			currentCase = isUpper ? true : isLower ? false : null;
		if( isUpper && !previousCase ) {
			add();
		}
		current += char;
		previousCase = currentCase;
	}
	add();
	return retval;
}

function caseFirstLetter( upper: boolean, str: string ) {
	let firstLetter = str.slice( 0, 1 );
	if( upper ) {
		firstLetter = firstLetter.toUpperCase();
	} else {
		firstLetter = firstLetter.toLowerCase();
	}
	return firstLetter + str.slice( 1 );
}
const lowerCaseFirstLetter = caseFirstLetter.bind( undefined, false );
const upperCaseFirstLetter = caseFirstLetter.bind( undefined, true );

function pascalCase( str: string ) {
	return splitWords( str ).map( upperCaseFirstLetter ).join( '' );
}

const logEnabled = false;

@NamingStrategy( 'R3NamingStrategy' )
export class R3NamingStrategy extends DefaultNamingStrategy {
	@Log( logEnabled )
	public tableName( className: string, customName: string ) {
		return customName || pascalCase( className.replace( /entity$/i, '' ) );
	}

	@Log( logEnabled )
	public columnName( propertyName: string, customName: string ) {
		return pascalCase( propertyName );
	}

	@Log( logEnabled )
	public embeddedColumnName( embeddedPropertyName: string, columnPropertyName: string, columnCustomName?: string ) {
		return super.embeddedColumnName( embeddedPropertyName, columnPropertyName, columnCustomName );
	}

	@Log( logEnabled )
	public relationName( propertyName: string ) {
		return super.relationName( propertyName );
	}

	@Log( logEnabled )
	public indexName( customName: string|undefined, tableName: string, columns: string[] ) {
		const name = customName || tableName;
		return `ix_${name}_${columns.join('_')}`;
	}

	@Log( logEnabled )
	public joinColumnInverseSideName( joinColumnName: string, propertyName: string ) {
		return super.joinColumnInverseSideName( joinColumnName, propertyName );
	}

	@Log( logEnabled )
	public joinTableName( firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string, firstColumnName: string, secondColumnName: string ) {
		return `${firstTableName}_${secondTableName}`;
	}

	@Log( logEnabled )
	public joinTableColumnName( tableName: string, columnName: string, secondTableName: string, secondColumnName: string ) {
		return columnName;
	}

	@Log( logEnabled )
	public joinTableInverseColumnName( tableName: string, columnName: string, secondTableName: string, secondColumnName: string ) {
		return columnName;
	}

	@Log( logEnabled )
	public foreignKeyName( tableName: string, columnNames: string[], referencedTableName: string, referencedColumnNames: string[] ) {
		return `fk_${tableName}_${referencedTableName}`;
	}

	@Log( logEnabled )
	public closureJunctionTableName( tableName: string ) {
		return super.closureJunctionTableName( tableName );
	}

	@Log( logEnabled )
	public classTableInheritanceParentColumnName( parentTableName: any, parentTableIdPropertyName: any ) {
		return super.classTableInheritanceParentColumnName( parentTableName, parentTableIdPropertyName );
	}

	@Log( logEnabled )
	public prefixTableName( prefix: string, originalTableName: string ) {
		return super.prefixTableName( prefix, originalTableName );
	}
}
