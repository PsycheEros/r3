declare module 'data/responsive.yaml' {
	export const breakpoints: {
		[ breakpoint: ResponsiveBreakpoint ]: { min: number; max: number; }
	};
}
