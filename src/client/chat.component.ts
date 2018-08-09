import { combineLatest, SchedulerLike } from 'rxjs';
import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { RoomService } from './room.service';
import { chatMessageRules, commandRules } from 'src/validation';
import { NgForm } from '@angular/forms';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { observeOn } from 'rxjs/operators';

@Component( {
	selector: 'chat',
	templateUrl: './chat.component.html',
	styleUrls: [ './chat.component.scss' ],
	animations: [
		trigger( 'message', [

		] )
	]
} )
export class ChatComponent {
	constructor(
		private readonly roomService: RoomService,
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {}

	protected ngOnInit() {
		const { roomService, scheduler } = this,
			currentRoomId = roomService.getCurrentRoomId(),
			allMessages = roomService.getMessages();
		currentRoomId.subscribe( roomId => {
			this.roomId = roomId;
		} );
		combineLatest( currentRoomId, allMessages, ( roomId, messages ) =>
			roomId
			? messages.filter( message => message.roomId === roomId )
			: []
		)
		.pipe( observeOn( scheduler ) )
		.subscribe( messages => {
			this.messages = messages;
		} );
	}

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

	public async sendMessage() {
		const { messageForm, roomService, roomId, text: message, textbox } = this;
		if( !roomId || !message ) return;
		messageForm.resetForm();
		await roomService.sendMessage( roomId, message );
		textbox.nativeElement.focus();
	}
}
