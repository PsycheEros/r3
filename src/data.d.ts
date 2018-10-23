declare module 'data/*.yaml';

type NumberTriple = [ number, number, number ];

declare module 'data/colors.yaml' {
	export const colors: { [ name: string ]: {
		displayName: string;
		color: NumberTriple;
	} };
}

type Light = {
	ambient: {
		color: NumberTriple;
		intensity: number;
	};
} | {
	point: {
		color: NumberTriple;
		intensity: number;
		position: NumberTriple;
	};
} | {
	directional: {
		color: NumberTriple;
		intensity: number;
	};
} | {
	spotlight: {
		color: NumberTriple;
		intensity: number;
		position: NumberTriple;
		decay: number;
		penumbra: number;
		distance: number;
		angle: number;
	};
};

declare module 'data/board.yaml' {
	export const lights: Light[];
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
