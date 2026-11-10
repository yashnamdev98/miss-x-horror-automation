require('dotenv').config();
const fs=require('node:fs/promises');
const path=require('node:path');
const {google}=require('googleapis');
const {CHANNEL_ID}=require('./pipeline');
async function verifyYouTube() {
 const root=path.join(__dirname,'..','config');
 const client=JSON.parse(await fs.readFile(path.join(root,'oauth-client.json'),'utf8')).installed;
 const saved=JSON.parse(await fs.readFile(path.join(root,'tokens.json'),'utf8'));
 const scopes=(saved.youtube.scope || '').split(/\s+/);
 if(scopes.length!==1 || scopes[0]!=='https://www.googleapis.com/auth/youtube.readonly') throw new Error('Expected read-only YouTube authorization only');
 const auth=new google.auth.OAuth2(client.client_id,client.client_secret);
 auth.setCredentials(saved.youtube);
 const result=await google.youtube({version:'v3',auth}).channels.list({part:'id,snippet',mine:true});
 const target=result.data.items?.find(x=>x.id===CHANNEL_ID);
 if(!target) throw new Error('Authorized account does not expose the expected MISS X HORROR channel');
 return {verified:true,channelId:target.id,channelName:target.snippet.title,scope:scopes[0],publishingEnabled:false};
}
if(require.main===module) verifyYouTube().then(x=>console.log(JSON.stringify(x,null,2))).catch(()=>{console.error('Read-only verification failed. Check local OAuth setup and account consent; no credentials logged.');process.exitCode=1;});
module.exports={verifyYouTube};
