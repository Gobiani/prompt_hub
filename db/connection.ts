// db/connection.ts
import { DataSource } from 'typeorm';
import { Prompt } from './entities/Prompt';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Prompt],
    synchronize: true,
  });

  await dataSource.initialize();
  return dataSource;
}