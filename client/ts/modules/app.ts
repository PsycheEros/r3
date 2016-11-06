import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Angular2AutoScroll } from 'angular2-auto-scroll/lib/angular2-auto-scroll.directive';
import { BoardComponent, ChatComponent, GameComponent, LobbyComponent, R3Component, RoomComponent } from '../components/index';
import { RoomService, SocketService } from '../services/index';
import { ModalModule } from './modal';

@NgModule( {
	imports:      [ BrowserModule, CommonModule, FormsModule, HttpModule, ModalModule ],
	declarations: [ BoardComponent, ChatComponent, GameComponent, LobbyComponent, R3Component, RoomComponent, Angular2AutoScroll ],
	providers:    [ RoomService, SocketService ],
	bootstrap:    [ R3Component ]
} )
export class AppModule {}
