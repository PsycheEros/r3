import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

@Pipe( { name: 'markdown' } )
export class MarkdownPipe implements PipeTransform {
	constructor( private readonly sanitizer: DomSanitizer ) { }

	public transform( markdown: string ) {
		const { sanitizer } = this;
		const unsafeHtml = marked( markdown );
		const saferHtml = sanitizeHtml( unsafeHtml, {
			allowedTags: [ 'a', 'b', 'blockquote', 'br', 'caption', 'code', 'del', 'em', 'hr', 'i', 'img', 'ins', 'li', 'ol', 'p', 'pre', 's', 'strong', 'table', 'td', 'th', 'tbody', 'thead', 'tr', 'ul' ],
			allowedAttributes: {
				a: [ 'href', 'rel', 'target' ],
				code: [],
				img: [ 'src', 'alt', 'title' ],
				td: [ 'align', 'valign' ],
				th: [ 'align', 'valign' ]
			},
			allowedClasses: {},
			transformTags: {
				a: ( tagName, attribs ) => ( {
					tagName,
					attribs: { ...attribs, rel: 'nofollow noreferrer noopener', target: '_blank' }
				} )
			},
			parser: {}
		} );
		const safeHtml = sanitizer.sanitize( SecurityContext.HTML, saferHtml );
		return safeHtml;
	}
}
