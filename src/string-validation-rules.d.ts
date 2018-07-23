declare interface StringValidationRules {
	required?: boolean;
	length?: {
		min?: number;
		max?: number;
	};
	matches?: string|ReadonlyArray<string>; // pattern matches all, case-sensitive
	nonMatches?: string|ReadonlyArray<string>; // pattern does not match any, case-sensitive
	equals?: string|ReadonlyArray<string>; // equal to at least one, case-insensitive
	nonEquals?: string|ReadonlyArray<string>; // not equal to any, case-insensitive
}
