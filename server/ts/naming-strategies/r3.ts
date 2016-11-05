import { NamingStrategy } from 'typeorm';
import { DefaultNamingStrategy } from 'typeorm/naming-strategy/DefaultNamingStrategy';

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

@NamingStrategy( 'R3NamingStrategy' )
export class R3NamingStrategy extends DefaultNamingStrategy {
	public tableName( className: string, customName: string ) {
		console.log( 'tableName', ...arguments );
		return super.tableName( className, customName );
	}

	public columnName( propertyName: string, customName: string ) {
		return pascalCase( propertyName );
	}

	public embeddedColumnName( embeddedPropertyName: string, columnPropertyName: string, columnCustomName?: string ) {
		console.log( 'embeddedColumnName', ...arguments );
		return super.embeddedColumnName( embeddedPropertyName, columnPropertyName, columnCustomName );
	}

	public relationName( propertyName: string ) {
		console.log( 'relationName', ...arguments );
		return super.relationName( propertyName );
	}

	public indexName( customName: string|undefined, tableName: string, columns: string[] ) {
		const name = customName || tableName;
		return `ix_${name}_${columns.join('_')}`;
	}

	public joinColumnInverseSideName( joinColumnName: string, propertyName: string ) {
		console.log( 'joinColumnInverseSideName', ...arguments );
		return super.joinColumnInverseSideName( joinColumnName, propertyName );
	}

	public joinTableName( firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string, firstColumnName: string, secondColumnName: string ) {
		return `${firstTableName}_${secondTableName}`;
	}

	public joinTableColumnName( tableName: string, columnName: string, secondTableName: string, secondColumnName: string ) {
		return columnName;
	}

	public joinTableInverseColumnName( tableName: string, columnName: string, secondTableName: string, secondColumnName: string ) {
		return columnName;
	}

	public foreignKeyName( tableName: string, columnNames: string[], referencedTableName: string, referencedColumnNames: string[] ) {
		return `fk_${tableName}_${referencedTableName}`;
	}

	public closureJunctionTableName( tableName: string ) {
		console.log( 'closureJunctionTableName', ...arguments );
		return super.closureJunctionTableName( tableName );
	}

	public classTableInheritanceParentColumnName( parentTableName: any, parentTableIdPropertyName: any ) {
		console.log( 'classTableInheritanceParentColumnName', ...arguments );
		return super.classTableInheritanceParentColumnName( parentTableName, parentTableIdPropertyName );
	}

	public prefixTableName( prefix: string, originalTableName: string ) {
		console.log( 'prefixTableName', ...arguments );
		return super.prefixTableName( prefix, originalTableName );
	}
}
