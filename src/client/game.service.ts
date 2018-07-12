import { Inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable()
export class GameService {
	constructor( @Inject(SessionService) private sessionService: SessionService ) {}
}
