import './default.scss';
import './polyfills';
import './vendor';

import { enableProdMode } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

if( location.hostname !== 'localhost' ) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule( AppModule );
