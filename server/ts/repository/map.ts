abstract class MapRepository<T> implements Repository<T> {
	protected constructor( protected readonly key: string ) {}

	public async insert( record: T ) {
		const { map, key } = this,
			id = record[ key ];
		if( map.has( id ) ) {
			throw new Error( 'Item exists' );
		}
		map.set( id, record );
	}

	public async get( id: string ) {
		const { map } = this;
		if( !map.has( id ) ) {
			throw new Error( 'Item not found' );
		}
		return map.get( id )!;
	}

	public async update( record: T ) {
		const { map, key } = this;
		if( !map.has( key ) ) {
			throw new Error( 'Item not found' );
		}
		map.set( record[ key ], record );
	}

	public async upsert( record: T ) {
		const { map, key } = this;
		map.set( record[ key ], record );
	}

	public async delete( id: string ) {
		const { map } = this;
		if( !map.has( id ) ) {
			throw new Error( 'Item not found' );
		}
		map.delete( id );
	}

	public async exists( id: string ) {
		const { map } = this;
		return map.has( id );
	}

	public async list() {
		const { map } = this;
		return Array.from( map.values() );
	}

	private map = new Map<string, T>();
}

export default MapRepository;
