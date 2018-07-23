declare type JsonPrimitive = boolean | null | number | string;
declare type JsonValue = JsonArray | JsonObject | JsonPrimitive;
declare type JsonObject = { [ key: string ]: JsonValue; };
declare interface JsonArray extends Array<JsonValue> {}
