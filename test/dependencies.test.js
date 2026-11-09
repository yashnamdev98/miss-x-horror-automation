const {test}=require('node:test');
const assert=require('node:assert/strict');
test('upgraded SQLite creates a database and round-trips channel settings',async()=>{
 const sqlite=require('sqlite3');
 const db=await new Promise((resolve,reject)=>{const d=new sqlite.Database(':memory:',e=>e?reject(e):resolve(d));});
 const run=(sql,args=[])=>new Promise((resolve,reject)=>db.run(sql,args,e=>e?reject(e):resolve()));
 try {
  await run('CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT)');
  await run('INSERT INTO settings VALUES (?,?)',['auto_publish','false']);
  const row=await new Promise((resolve,reject)=>db.get('SELECT value FROM settings WHERE key=?',['auto_publish'],(e,r)=>e?reject(e):resolve(r)));
  assert.equal(row.value,'false');
 } finally {await new Promise((resolve,reject)=>db.close(e=>e?reject(e):resolve()));}
});
test('sharp renders an SVG and reads actual output dimensions',async()=>{
 const sharp=require('sharp');
 const png=await sharp(Buffer.from('<svg width="1280" height="720"><rect width="1280" height="720" fill="#222"/></svg>')).png().toBuffer();
 const info=await sharp(png).metadata(); assert.equal(info.width,1280);assert.equal(info.height,720);assert.equal(info.format,'png');
});
test('upgraded google client retains PKCE generation and read-only scope',async()=>{
 const {google}=require('googleapis');
 const client=new google.auth.OAuth2('test-client','test-secret','http://127.0.0.1:3001/oauth2callback');
 const codes=await client.generateCodeVerifierAsync(); assert.ok(codes.codeVerifier.length>=43);
 const url=new URL(client.generateAuthUrl({scope:['https://www.googleapis.com/auth/youtube.readonly'],code_challenge:codes.codeChallenge,code_challenge_method:'S256'}));
 assert.equal(url.searchParams.get('code_challenge_method'),'S256');assert.equal(url.searchParams.get('scope'),'https://www.googleapis.com/auth/youtube.readonly');
});
