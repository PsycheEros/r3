import { combineLatest, SchedulerLike, Subject } from 'rxjs';
import { Component, ViewChild, Inject, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { RoomService } from './room.service';
import { chatMessageRules, commandRules } from 'src/validation';
import { NgForm } from '@angular/forms';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { observeOn, takeUntil } from 'rxjs/operators';
import { AutoScrollDirection } from './auto-scroll.directive';
import { ResponsiveService } from './responsive.service';

@Component( {
	selector: 'chat',
	templateUrl: './chat.component.html',
	styleUrls: [ './chat.component.css' ],
	animations: [
		trigger( 'message', [

		] )
	]
} )
export class ChatComponent implements OnInit, OnDestroy {
	constructor(
		private readonly responsiveService: ResponsiveService,
		private readonly roomService: RoomService,
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {}

	public ngOnInit() {
		const { destroyed, responsiveService, roomService, scheduler } = this,
			currentRoomId = roomService.getCurrentRoomId(),
			allMessages = roomService.getMessages();

		responsiveService
		.getBreakpoint()
		.pipe(
			takeUntil( destroyed ),
			observeOn( scheduler )
		)
		.subscribe( breakpoint => {
			this.scrollDirection = ( breakpoint === ResponsiveBreakpoint.Xs ) ? AutoScrollDirection.Up : AutoScrollDirection.Down;
		} );

		currentRoomId.subscribe( roomId => {
			this.roomId = roomId;
		} );
		combineLatest( currentRoomId, allMessages, ( roomId, messages ) =>
			roomId
			? messages.filter( message => message.roomId === roomId )
			: []
		)
		.pipe(
			takeUntil( destroyed ),
			observeOn( scheduler )
		)
		.subscribe( messages => {
			this.messages = messages;
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	private readonly destroyed = new Subject<true>();

	@ViewChild( 'messageForm' )
	private messageForm: NgForm;

	@ViewChild( 'textbox' )
	private textbox: ElementRef;

	public roomId: string|null;

	public messages = [] as Message[];

	public text: string|void;
	public get isCommand() { return ( this.text || '' ).startsWith( '/' ); }

	public readonly chatMessageRules = chatMessageRules;
	public readonly commandRules = commandRules;

	public scrollDirection = AutoScrollDirection.Down;

	public async sendMessage() {
		const { messageForm, roomService, roomId, text: message, textbox } = this;
		if( !roomId || !message ) return;
		messageForm.resetForm();
		await roomService.sendMessage( roomId, message );
		textbox.nativeElement.focus();
	}
}
