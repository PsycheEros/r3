abstract class Repository<T> {
	protected constructor( protected readonly key: string ) {}

	public async create( record: T ) {
		const { map, key } = this;
		map.set( record[ key ], record );
		return true;
	}

	public async read( id: string ) {
		const { map } = this;
		return map.get( id ) || null;
	}

	public async update( record: T ) {
		const { map, key } = this;
		map.set( record[ key ], record );
	}

	public async delete( id: string ) {
		const { map } = this;
		return map.delete( id );
	}

	public async listAll() {
		const { map } = this;
		return Array.from( map.values() ); 
	}

	private map = new Map<string, T>();
}

export default Repository;
