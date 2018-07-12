import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { BoardComponent } from './board.component';
import { ChatComponent } from './chat.component';
import { GameComponent } from './game.component';
import { LobbyComponent } from './lobby.component';
import { R3Component } from './r3.component';
import { RoomComponent } from './room.component';
import { GameService } from './game.service';
import { RoomService } from './room.service';
import { SessionService } from './session.service';
import { ModalModule } from './modal.module';

@NgModule( {
	imports:      [ BrowserModule, CommonModule, FormsModule, HttpModule, ModalModule, NgxAutoScrollModule ],
	declarations: [ BoardComponent, ChatComponent, GameComponent, LobbyComponent, R3Component, RoomComponent ],
	providers:    [ GameService, RoomService, SessionService ],
	bootstrap:    [ R3Component ]
} )
export class AppModule {}
