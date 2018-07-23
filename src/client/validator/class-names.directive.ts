import { Directive, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

const controlStatusHost = {
	'[class.is-valid]': 'isClassValid()',
	'[class.is-invalid]': 'isClassInvalid()'
};

@Directive( { selector: '[formControlName],[ngModel],[formControl]', host: controlStatusHost } )
export class ValidatorClassNamesDirective {
	public constructor(
		@Self()
		private readonly control: NgControl
	) {}

	public isClassValid() {
		const c = this.control.control;
		return c && ( c.touched || c.dirty ) && c.valid;
	}

	public isClassInvalid() {
		const c = this.control.control;
		return c && ( c.touched || c.dirty ) && c.invalid;
	}
}
