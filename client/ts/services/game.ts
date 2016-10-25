import { Inject, Injectable } from '@angular/core';
import { SessionService } from './session';

@Injectable()
export class GameService {
	constructor( @Inject(SessionService) private sessionService: SessionService ) {}
}
