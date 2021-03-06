import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalChooseComponent } from './choose.component';
import { ModalCreateRoomComponent } from './create-room.component';
import { ModalHeaderComponent } from './header.component';
import { ModalNewGameComponent } from './new-game.component';
import { ModalJoinRoomComponent } from './join-room.component';
import { ModalSignInComponent } from './sign-in.component';
import { ComponentLoaderFactory, ModalModule as NgxModalModule } from 'ngx-bootstrap';
import { ValidatorModule } from 'client/validator/validator.module';

@NgModule( {
	imports:      [ CommonModule, FormsModule, NgxModalModule.forRoot(), FontAwesomeModule, ValidatorModule ],
	exports:      [ ModalChooseComponent, ModalCreateRoomComponent, ModalNewGameComponent, ModalJoinRoomComponent, ModalSignInComponent ],
	declarations: [ ModalChooseComponent, ModalCreateRoomComponent, ModalHeaderComponent, ModalNewGameComponent, ModalJoinRoomComponent, ModalSignInComponent ],
	providers:    [ ComponentLoaderFactory ]
} )
export class ModalModule {}
