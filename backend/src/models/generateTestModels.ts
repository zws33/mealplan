import {writeFileSync} from 'fs';
import {ModelGenerator} from './modelGenerator';

(async () => {
  const filePath = process.argv[2];
  const count = parseInt(process.argv[3], 10) || 10;
  const recipes = new ModelGenerator().generateRecipes(count);
  try {
    const jsonString = JSON.stringify(recipes, null, 2);
    writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`JSON data written to ${filePath}`);
  } catch (error) {
    console.error('Error writing JSON to file:', error);
  }
})();
