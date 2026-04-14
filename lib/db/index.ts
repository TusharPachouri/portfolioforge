import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { PgDatabase } from "drizzle-orm/pg-core";

type Db = ReturnType<typeof drizzle<typeof schema>>;

function createDb(): Db {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Build a proxy that passes DrizzleAdapter's `is(db, PgDatabase)` type check
    // (by inheriting from PgDatabase.prototype) but throws on any actual method call.
    const stub = Object.create(PgDatabase.prototype) as Db;
    return new Proxy(stub, {
      get(_target, prop) {
        // Let DrizzleAdapter read static metadata without throwing
        if (prop === "constructor" || typeof prop === "symbol") {
          return Reflect.get(_target, prop);
        }
        throw new Error(
          "DATABASE_URL is not configured. Add it to .env.local to enable auth and data persistence."
        );
      },
    });
  }
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

export const db = createDb();
