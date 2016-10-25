import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BoardComponent, ChatComponent, GameComponent, LobbyComponent, R3Component, RoomComponent } from '../components/index';
import { GameService, RoomService, SessionService } from '../services/index';
import { Ng2BootstrapModule } from 'ng2-bootstrap';

@NgModule( {
	imports:      [ BrowserModule, CommonModule, FormsModule, HttpModule, Ng2BootstrapModule ],
	declarations: [ BoardComponent, ChatComponent, GameComponent, LobbyComponent, R3Component, RoomComponent ],
	providers:    [ GameService, RoomService, SessionService ],
	bootstrap:    [ R3Component ]
} )
export class AppModule {}
