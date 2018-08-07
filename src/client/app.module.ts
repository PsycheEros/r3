import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ScoreboardComponent } from './scoreboard.component';
import { RoomService } from './room.service';
import { SessionService } from './session.service';
import { SocketService } from './socket.service';
import { ValidatorModule } from './validator/validator.module';

@NgModule( {
	imports:      [ BrowserModule, BrowserAnimationsModule, CommonModule, FormsModule, HttpModule, ModalModule, NgxAutoScrollModule, ZoneSchedulerModule, FontAwesomeModule, ValidatorModule ],
	declarations: [ BoardComponent, ChatComponent, GameComponent, LobbyComponent, NavigationComponent, R3Component, RoomComponent, ScoreboardComponent ],
	providers:    [ GameService, RoomService, SessionService, SocketService ],
	bootstrap:    [ R3Component ]
} )
export class AppModule {}
