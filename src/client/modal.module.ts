import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalChooseComponent } from './modal.choose.component';
import { ModalCreateRoomComponent } from './modal.create-room.component';
import { ModalJoinRoomComponent } from './modal.join-room.component';
import { ModalModule as NgxModalModule } from 'ngx-bootstrap';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';

@NgModule( {
	imports:      [ CommonModule, FormsModule, NgxModalModule.forRoot() ],
	exports:      [ ModalChooseComponent, ModalCreateRoomComponent, ModalJoinRoomComponent ],
	declarations: [ ModalChooseComponent, ModalCreateRoomComponent, ModalJoinRoomComponent ],
	providers:    [ ComponentLoaderFactory ]
} )
export class ModalModule {}
