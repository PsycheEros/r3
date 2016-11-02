import 'bootstrap';

import { enableProdMode } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './modules/index';

if( location.hostname !== 'localhost' ) {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule( AppModule );
