import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalChooseComponent, ModalCreateRoomComponent } from '../components/modal/index';
import { ModalModule as Ng2ModalModule } from 'ng2-bootstrap';

@NgModule( {
	imports:      [ CommonModule, FormsModule, Ng2ModalModule ],
	exports:      [ ModalChooseComponent, ModalCreateRoomComponent ],
	declarations: [ ModalChooseComponent, ModalCreateRoomComponent ]
} )
export class ModalModule {}
