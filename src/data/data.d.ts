declare module 'data/*.yaml';

declare module 'data/config.yaml' {
	export const workers: number;
	export const cspPolicy: object;
}
