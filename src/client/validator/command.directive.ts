import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { validateCommand } from 'src/validation';

@Directive( {
	selector: '[commandValidation]',
	providers: [ { provide: NG_VALIDATORS, useExisting: ValidatorCommandDirective, multi: true } ]
} )
export class ValidatorCommandDirective implements Validator {
	public validate( control: AbstractControl ): ValidationErrors | null {
		const { value } = control;
		if( !value || !value.startsWith( '/' ) ) return null;
		return validateCommand( value ).reduce( ( prev, err ) => ( { ...prev, [ err ]: true } ), {} );
	}
}
