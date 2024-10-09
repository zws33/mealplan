import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import type { PoolClient } from 'pg';

export async function importCSV(
  client: PoolClient,
  filePath: string,
  tableName: string,
  limit = Number.MAX_SAFE_INTEGER
) {
  try {
    console.log(`Importing CSV file ${filePath} into table "${tableName}"...`);
    const csvData = readFileSync(filePath, 'utf-8');

    const rows = parse(csvData, {
      skip_empty_lines: true,
      columns: true,
    });

    const columns = Object.keys(rows[0]);
    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    const queryText = `
      INSERT INTO ${tableName} 
      (${columnNames})
      VALUES (${placeholders})
    `;

    let rowCount = 0;
    for (const row of rows) {
      const values = columns.map((col) => {
        // Convert values to numbers where applicable, or keep them as strings/NULL
        const value = row[col];
        if (value === '') return null;
        if (isNaN(Number(value))) return value;
        return Number(value);
      });

      await client.query(queryText, values);
      rowCount++;
    }
    console.log(`Inserted ${rowCount} rows into table "${tableName}".`);
  } catch (error) {
    console.error('Error processing CSV file:', error);
  }
}
