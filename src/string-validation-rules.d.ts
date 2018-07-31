type Pattern = string|RegExp;
type OneOrMore<T> = T|ReadonlyArray<T>;

declare interface StringValidationRules {
	required?: boolean;
	length?: {
		min?: number;
		max?: number;
	};
	matches?: OneOrMore<Pattern>;
	nonMatches?: OneOrMore<Pattern>;
}
