import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { validateString } from 'src/validation';

@Directive( {
	selector: '[stringValidationRules]',
	providers: [ { provide: NG_VALIDATORS, useExisting: ValidatorStringDirective, multi: true } ]
} )
export class ValidatorStringDirective implements Validator, OnChanges {
	public constructor(
		private readonly renderer: Renderer2,
		private readonly hostElement: ElementRef
	){}

	public ngOnChanges() {
		const { renderer, hostElement: { nativeElement }, stringValidationRules } = this;
		const minLength = ( stringValidationRules && stringValidationRules.length && stringValidationRules.length.min ) || 0;
		const maxLength = ( stringValidationRules && stringValidationRules.length && stringValidationRules.length.max ) || null;
		const required = stringValidationRules &&
			(	( stringValidationRules.required === true ) ? true
			:	( stringValidationRules.required === false ) ? false
			:	( minLength > 0 ) ? true
			:	null
			);
		if( required ) {
			renderer.setAttribute( nativeElement, 'required', 'required' );
		} else if( required === false ) {
			renderer.removeAttribute( nativeElement, 'required' );
		}
		if( minLength > 0 ) {
			renderer.setAttribute( nativeElement, 'minlength', String( minLength ) );
		} else {
			renderer.removeAttribute( nativeElement, 'minlength' );
		}
		if( maxLength != null ) {
			if( ( nativeElement.value || '' ).length > maxLength ) nativeElement.value = nativeElement.value.slice( 0, maxLength );
			renderer.setAttribute( nativeElement, 'maxlength', String( maxLength ) );
		} else {
			renderer.removeAttribute( nativeElement, 'maxlength' );
		}
	}

	@Input( 'stringValidationRules' )
	public stringValidationRules: StringValidationRules;

	public validate( control: AbstractControl ): ValidationErrors | null {
		const { stringValidationRules: rules } = this;
		if( !rules || control.value == null ) return null;
		return validateString( control.value, rules ).reduce( ( prev, err ) => ( { ...prev, [ err ]: true } ), {} );
	}
}
