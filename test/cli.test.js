const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const {spawnSync}=require('node:child_process');
test('CLI exports a real draft from a file and rejects incomplete input',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'horror-cli-'));
 try {
  const brief={topic:'The empty railway platform',mode:'fiction',format:'short',narrator:{gender:'female',locale:'en-GB'},sources:[]};
  const script='I heard the empty station call my name just after midnight. The board showed a train that had stopped running forty years ago. A woman behind the glass held my missing ticket. When she turned around, I recognized the coat my mother had been buried in.';
  const pkg={title:'The Last Ticket | Fictional Horror',script,scenes:[{narration:script,visualPrompt:'Fictional deserted railway platform with an impossible arrival time'}],description:'An original fictional horror story.',tags:['fictional horror'],thumbnailPrompt:'An empty platform and a ticket',teaser:'The station knew her name.'};
  const briefPath=path.join(root,'brief.json'),pkgPath=path.join(root,'production.json'),out=path.join(root,'episode');
  await fs.writeFile(briefPath,JSON.stringify(brief)); await fs.writeFile(pkgPath,JSON.stringify(pkg));
  const result=spawnSync(process.execPath,['horror/cli.js','export',briefPath,pkgPath,out],{cwd:path.join(__dirname,'..'),encoding:'utf8'});
  assert.equal(result.status,0,result.stderr); assert.match(result.stdout,/draft-exported/);
  assert.equal(await fs.readFile(path.join(out,'story.txt'),'utf8'),script);
  const bad=spawnSync(process.execPath,['horror/cli.js','export',briefPath],{cwd:path.join(__dirname,'..'),encoding:'utf8'}); assert.equal(bad.status,1);
 } finally {await fs.rm(root,{recursive:true,force:true});}
});
