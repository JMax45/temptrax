import { Pool } from 'pg';
import { newDb } from 'pg-mem';

const { Pool: MemPool } = newDb().adapters.createPg();

interface Options {
	/** Database connection string */
	databaseUrl?: string;
	/** Table name in which the entries will be stored */
	tableName?: string;
	/** If true will launch an in-memory instance */
	inMemory?: boolean;
}

class Temptrax {
	pool: Pool;
	tableName: string;
	constructor(options: Options) {
		this.tableName = options.tableName || 'temptrax';
		this.pool = options.inMemory
			? new MemPool()
			: new Pool({
					connectionString: options.databaseUrl,
					ssl: {
						rejectUnauthorized: false,
					},
			  });
		this.pool.query(
			`CREATE TABLE IF NOT EXISTS ${this.tableName} (entry_id TEXT PRIMARY KEY, values TEXT[], expiration_date TIMESTAMP)`
		);
		setInterval(() => {
			this.pool.query(
				`DELETE FROM ${this.tableName} WHERE expiration_date < CURRENT_TIMESTAMP`
			);
		}, 60000);
	}
	add = (entryId: string, values: Object, expirationDate: Date) => {
		return this.pool.query(
			`INSERT INTO ${this.tableName} 
                (entry_id, values, expiration_date) 
                VALUES ($1, $2, $3) ON CONFLICT (entry_id) 
                DO UPDATE SET values = $2, expiration_date = $3`,
			[entryId, this.objectToArray(values), expirationDate]
		);
	};
	get = (entryId: string) => {
		return new Promise(async (resolve, reject) => {
			const res = (
				await this.pool.query(
					`SELECT * FROM ${this.tableName} WHERE entry_id = $1`,
					[entryId]
				)
			).rows[0];
			if (res === undefined || res.expiration_date < new Date()) {
				reject('Entry not found or expired');
			} else {
				resolve({ ...res, values: this.arrayToObject(res.values) });
			}
		});
	};
	objectToArray = (obj: any) => {
		const result = Object.keys(obj).map((key) => [key, obj[key]]);
		return result.reduce((a, b) => a.concat(b), []);
	};
	arrayToObject = (arr: any[]) => {
		let obj: any = {};
		arr.map((e, i) => {
			if (i % 2) {
				return (obj[arr[i - 1]] = e);
			}
			return (obj[e] = undefined);
		});
		return obj;
	};
}

export default Temptrax;
