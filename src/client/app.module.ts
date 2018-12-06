import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ZoneSchedulerModule } from 'ngx-zone-scheduler';
import { BoardComponent } from './board.component';
import { ChatComponent } from './chat.component';
import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { LobbyComponent } from './lobby.component';
import { MarkdownPipe } from './markdown.pipe';
import { ModalModule } from './modal/modal.module';
import { NavigationComponent } from './navigation.component';
import { R3Component } from './r3.component';
import { AutoScrollDirective } from './auto-scroll.directive';
import { RoomComponent } from './room.component';
import { ScoreboardComponent } from './scoreboard.component';
import { ResponsiveService } from './responsive.service';
import { RoomService } from './room.service';
import { SessionService } from './session.service';
import { SocketService } from './socket.service';
import { ValidatorModule } from './validator/validator.module';

@NgModule( {
	imports:      [ BrowserModule, BrowserAnimationsModule, CommonModule, FormsModule, HttpModule, ModalModule, ZoneSchedulerModule, FontAwesomeModule, ValidatorModule ],
	declarations: [ BoardComponent, ChatComponent, GameComponent, LobbyComponent, MarkdownPipe, NavigationComponent, R3Component, RoomComponent, ScoreboardComponent, AutoScrollDirective ],
	providers:    [ GameService, ResponsiveService, RoomService, SessionService, SocketService ],
	bootstrap:    [ R3Component ]
} )
export class AppModule {}
