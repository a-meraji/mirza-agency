declare module 'mongodb' {
  export class ObjectId {
    constructor(id?: string | ObjectId);
    toString(): string;
    toHexString(): string;
    equals(otherId: ObjectId): boolean;
  }

  export interface Collection<T> {
    find(query?: any): {
      sort(sort: any): {
        toArray(): Promise<T[]>;
      };
      toArray(): Promise<T[]>;
    };
    findOne(query?: any): Promise<T | null>;
    insertOne(doc: any): Promise<{ insertedId: ObjectId }>;
    updateOne(filter: any, update: any): Promise<any>;
    deleteOne(filter: any): Promise<any>;
    deleteMany(filter: any): Promise<any>;
  }

  export interface Db {
    collection<T>(name: string): Collection<T>;
  }

  export class MongoClient {
    constructor(uri: string, options?: any);
    connect(): Promise<MongoClient>;
    db(name?: string): Db;
  }
} 