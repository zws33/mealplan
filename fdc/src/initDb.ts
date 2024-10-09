import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { importCSV } from './importCsv';
import { createTableFromCSV } from './createTableFromCsv';
import { getClient } from './db';
import { readdirSync } from 'fs';

const argv = await yargs(hideBin(Bun.argv))
  .options('dir', {
    alias: 'd',
    type: 'string',
    description: 'Directory containing CSV files',
    demandOption: false,
  })
  .option('files', {
    alias: 'f',
    type: 'array',
    description: 'List of CSV file paths',
    demandOption: false,
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    description: 'Limit the number of rows to insert from each CSV',
    default: 1000,
  })
  .help().argv;
let files: string[] = [];
if (argv.dir) {
  files = readdirSync(argv.dir).map((file) => `${argv.dir}/${file}`);
  console.log(`Processing files:\n${files.join('\n')}`);
} else if (argv.files) {
  files = argv.files as string[];
} else {
  console.error('Please provide a directory or list of files to process');
  process.exit(1);
}

const pool = await getClient();
const client = await pool.connect();
try {
  for (const filePath of files) {
    const tableName = getTableName(filePath);
    console.log(`Processing file: ${filePath}, Table: ${tableName}`);
    await createTableFromCSV(client, filePath, tableName);
    console.log(`Table created: ${tableName}`);
    await importCSV(client, filePath, tableName, argv.limit);
    console.log(`Data imported for table: ${tableName}`);
  }
} catch (error) {
  console.error('Error processing files:', error);
} finally {
  client.release();
  await pool.end();
}

function getTableName(filePath: string): string {
  const fileNameWithExt = filePath.split('/').pop() || '';
  const tableName = fileNameWithExt.replace(/\.[^/.]+$/, '');
  return tableName;
}
