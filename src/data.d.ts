declare module 'data/*.yaml';

declare module 'data/colors.yaml' {
	export const colors: { [ name: string ]: {
		displayName: string;
		color: [ number, number, number ];
	} };
}

declare module 'data/enums.yaml' {
	export const ruleSets: string[];
}

declare module 'data/validation.config.yaml' {
	export const nick: StringValidationRules;
	export const roomName: StringValidationRules;
	export const roomPassword: StringValidationRules;
	export const userPassword: StringValidationRules;
	export const chatMessage: StringValidationRules;
	export const command: StringValidationRules;
}
