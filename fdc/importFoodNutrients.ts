// Import necessary modules
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { parse } from 'jsr:@std/csv';
import 'jsr:@std/dotenv/load';
console.log(Deno.env.get('POSTGRES_USER'));

// PostgreSQL client setup
const client = new Client({
  user: Deno.env.get('POSTGRES_USER'), // Replace with your PostgreSQL username
  database: Deno.env.get('POSTGRES_DB'), // Replace with your PostgreSQL database name
  hostname: 'localhost', // Replace with your PostgreSQL host (e.g., localhost)
  password: Deno.env.get('POSTGRES_PASSWORD'), // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port (default: 5432)
});

await client.connect();

async function importCSV(filePath: string) {
  try {
    // Read the entire CSV file as a string
    const csvData = await Deno.readTextFile(filePath);

    // Parse CSV data
    const rows = parse(csvData, {
      skipFirstRow: true, // Skip the header row
      columns: [
        'id',
        'fdc_id',
        'nutrient_id',
        'amount',
        'data_points',
        'derivation_id',
        'min',
        'max',
        'median',
        'footnote',
        'min_year_acquired',
      ],
    });

    // Prepare the SQL insert statement
    const queryText = `
      INSERT INTO food_nutrient 
      (fdc_id, nutrient_id, amount, data_points, derivation_id, min, max, median, footnote, min_year_acquired)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    // Iterate over each row and insert into the database
    for (const row of rows) {
      const values = [
        row.fdc_id ? Number(row.fdc_id) : null,
        row.nutrient_id ? Number(row.nutrient_id) : null,
        row.amount ? Number(row.amount) : null,
        row.data_points ? Number(row.data_points) : null,
        row.derivation_id ? Number(row.derivation_id) : null,
        row.min ? Number(row.min) : null,
        row.max ? Number(row.max) : null,
        row.median ? Number(row.median) : null,
        row.footnote || null,
        row.min_year_acquired ? Number(row.min_year_acquired) : null,
      ];

      // Execute the insert query
      await client.queryArray(queryText, values);
      console.log(`Inserted row with fdc_id: ${row.fdc_id}`);
    }

    console.log('CSV file successfully processed.');
  } catch (error) {
    console.error('Error processing CSV file:', error);
  } finally {
    // Close the database connection
    await client.end();
  }
}

// // Run the import function
importCSV('food_nutrient.csv');
