import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

interface DatabaseSchema {
  [key: string]: unknown;
}

export async function readDB(): Promise<DatabaseSchema> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as DatabaseSchema;
}

export async function writeDB(data: DatabaseSchema): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
