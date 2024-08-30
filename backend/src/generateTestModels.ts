import {ModelGenerator} from './models/ModelGenerator';
import * as fs from 'fs';
async function writeJsonToFile(filePath: string, data: any) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`JSON data written to ${filePath}`);
  } catch (error) {
    console.error('Error writing JSON to file:', error);
  }
}

(async () => {
  const recipes = ModelGenerator.generateRecipes(100);
  await writeJsonToFile('./src/models/recipes.json', recipes);
})();
