import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import type { PoolClient } from 'pg';

export async function createTableFromCSV(
  client: PoolClient,
  filePath: string,
  tableName: string
) {
  try {
    console.log(`Creating table "${tableName}" from CSV file ${filePath}...`);
    const csvData = readFileSync(filePath, 'utf-8');
    const rows = parse(csvData, {
      skip_empty_lines: true,
      columns: true,
    });

    // Extract column names dynamically from the first row (the header)
    const columns = Object.keys(rows[0]);

    // Infer column types by checking the first row's values
    const sampleRow = rows[0];
    const columnDefinitions = columns.map((column) => {
      const value = sampleRow[column];
      const isNumber = !isNaN(Number(value)) && value !== '';
      return `${column} ${isNumber ? 'NUMERIC' : 'TEXT'}`;
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columnDefinitions.join(',\n')}
      );
    `;

    await client.query(createTableQuery);
    console.log(`Table "${tableName}" created successfully.`);
  } catch (error) {
    console.error('Error creating table from CSV:', error);
  }
}
