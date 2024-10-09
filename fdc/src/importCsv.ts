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

    for (let i = 0; i < limit && i < rows.length; i++) {
      const row = rows[i];
      const values = columns.map((col) => {
        // Convert values to numbers where applicable, or keep them as strings/NULL
        const value = row[col];
        if (value === '') return null;
        if (isNaN(Number(value))) return value;
        return Number(value);
      });

      await client.query(queryText, values);
      console.log(`Inserted row with ${columns[0]}: ${row[columns[0]]}`);
    }

    console.log('CSV file successfully processed.');
  } catch (error) {
    console.error('Error processing CSV file:', error);
  }
}
