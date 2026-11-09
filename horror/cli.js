require('dotenv').config();
const fs = require('node:fs/promises');
const {buildPrompt, generate, exportPackage} = require('./pipeline');
async function main(args = process.argv.slice(2)) {
  const [command, briefPath, packageOrOutput, output] = args;
  if (!['plan','generate','export'].includes(command) || !briefPath) throw new Error('Usage: npm run horror -- plan brief.json | generate brief.json NEW_OUTPUT_DIR | export brief.json production.json NEW_OUTPUT_DIR');
  const brief = JSON.parse(await fs.readFile(briefPath,'utf8'));
  if (command === 'plan') return console.log(buildPrompt(brief));
  if (!packageOrOutput || (command === 'export' && !output)) throw new Error('Output directory and production file required');
  const production = command === 'generate' ? await generate(brief) : JSON.parse(await fs.readFile(packageOrOutput,'utf8'));
  const manifest = await exportPackage(brief,production,command === 'generate' ? packageOrOutput : output);
  console.log(JSON.stringify({status:'draft-exported',words:manifest.words,publishingEnabled:false}));
}
if (require.main === module) main().catch(e => {console.error(e.message); process.exitCode=1;});
module.exports = {main};
