import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChatComponent, GameComponent, R3Component } from '../components/index';

@NgModule( {
	imports:      [ BrowserModule, CommonModule, FormsModule, HttpModule ],
	declarations: [ ChatComponent, GameComponent, R3Component ],
	bootstrap:    [ R3Component ]
} )
export class AppModule {}
