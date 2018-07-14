import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { ZoneSchedulerModule } from 'ngx-zone-scheduler';
import { BoardComponent } from './board.component';
import { ChatComponent } from './chat.component';
import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { LobbyComponent } from './lobby.component';
import { ModalModule } from './modal/modal.module';
import { NavigationComponent } from './navigation.component';
import { R3Component } from './r3.component';
import { RoomComponent } from './room.component';
import { RoomService } from './room.service';
import { SessionService } from './session.service';

@NgModule( {
	imports:      [ BrowserModule, CommonModule, FormsModule, HttpModule, ModalModule, NgxAutoScrollModule, ZoneSchedulerModule, FontAwesomeModule ],
	declarations: [ BoardComponent, ChatComponent, GameComponent, LobbyComponent, NavigationComponent, R3Component, RoomComponent ],
	providers:    [ GameService, RoomService, SessionService ],
	bootstrap:    [ R3Component ]
} )
export class AppModule {}
