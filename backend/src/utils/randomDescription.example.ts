/**
 * Example usage of randomDescription generator
 *
 * Run with: npx ts-node src/utils/randomDescription.example.ts
 */

import { generateRandomDescription, generateRandomDescriptions } from './randomDescription';

// Generate a single random description
console.log('=== Single Random Description ===');
const singleDesc = generateRandomDescription();
console.log(JSON.stringify(singleDesc, null, 2));

console.log('\n=== 5 Random Descriptions ===');
const multiDesc = generateRandomDescriptions(5);
multiDesc.forEach((desc, index) => {
  console.log(`\n--- Description ${index + 1} ---`);
  console.log(JSON.stringify(desc, null, 2));
});
