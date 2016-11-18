import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDirective } from '../directives/index';
import { ModalChooseComponent, ModalCreateRoomComponent } from '../components/modal/index';

@NgModule( {
	imports:      [ CommonModule, FormsModule ],
	exports:      [ ModalChooseComponent, ModalCreateRoomComponent, ModalDirective ],
	declarations: [ ModalChooseComponent, ModalCreateRoomComponent, ModalDirective ]
} )
export class ModalModule {}
