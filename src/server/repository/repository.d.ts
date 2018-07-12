declare interface Repository<T> {
	insert( record: T ): Promise<void>;

	get( id: string ): Promise<T>;

	update( record: T ): Promise<void>;

	delete( id: string ): Promise<void>;

	upsert( record: T ): Promise<void>;

	exists( id: string ): Promise<boolean>;

	list(): Promise<T[]>;
}
