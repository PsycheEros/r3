import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorClassNamesDirective } from './class-names.directive';
import { ValidatorCommandDirective } from './command.directive';
import { ValidatorStringDirective } from './string.directive';

@NgModule( {
	imports:      [ FormsModule ],
	exports:      [ ValidatorClassNamesDirective, ValidatorCommandDirective, ValidatorStringDirective ],
	declarations: [ ValidatorClassNamesDirective, ValidatorCommandDirective, ValidatorStringDirective ]
} )
export class ValidatorModule {}
