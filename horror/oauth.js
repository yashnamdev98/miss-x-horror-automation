require('dotenv').config();
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const {google} = require('googleapis');
const ROOT = path.join(__dirname,'..','config');
function validCallback(url, state) {
  return url.pathname === '/oauth2callback' && url.searchParams.get('state') === state && !!url.searchParams.get('code') && !url.searchParams.has('error');
}
async function authenticate() {
  const raw=JSON.parse(await fs.readFile(path.join(ROOT,'oauth-client.json'),'utf8'));
  const config=raw.installed;
  if (!config?.client_id || !config?.client_secret) throw new Error('Download a Desktop app OAuth client to config/oauth-client.json');
  const state=crypto.randomBytes(32).toString('hex');
  let client, codeVerifier, busy=false;
  const server=http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://127.0.0.1');
    if (req.method !== 'GET' || busy || !validCallback(url,state)) {
      res.writeHead(400); res.end('Invalid OAuth callback. No tokens saved.'); return;
    }
    busy=true;
    let stage='token-exchange';
    try {
      const {tokens}=await client.getToken({code:url.searchParams.get('code'),codeVerifier});
      client.setCredentials(tokens);
      const yt=google.youtube({version:'v3',auth:client});
      stage='channel-read';
      const result=await yt.channels.list({part:'id,snippet',mine:true});
      if (!result.data.items?.some(x=>x.id===require('./pipeline').CHANNEL_ID)) {
        console.error('Channel mismatch. Returned channel identities:',JSON.stringify((result.data.items || []).map(x=>({id:x.id,title:x.snippet?.title}))));
        throw new Error('Wrong channel');
      }
      stage='token-save';
      // Exclusive creation protects any existing integration/token file.
      await fs.writeFile(path.join(ROOT,'tokens.json'),JSON.stringify({youtube:tokens},null,2),{mode:0o600,flag:'wx'});
      res.end('Read-only YouTube OAuth verified and saved. Publishing remains disabled.');
      console.log('Verified target channel; read-only token saved. No automation started.');
      server.close();
    } catch (error) {
      const code=error?.response?.status || error?.code || 'verification-failed';
      console.error('OAuth stopped:',JSON.stringify({stage,code:String(code).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40)}));
      res.writeHead(400); res.end('OAuth failed, wrong channel, or tokens.json already exists. No credentials logged.');
      server.close();
    }
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const redirect=`http://127.0.0.1:${server.address().port}/oauth2callback`;
  client=new google.auth.OAuth2(config.client_id,config.client_secret,redirect);
  const codes=await client.generateCodeVerifierAsync(); codeVerifier=codes.codeVerifier;
  console.log('Open this Google consent URL in your browser. Check the intended channel account:');
  console.log(client.generateAuthUrl({access_type:'offline',scope:['https://www.googleapis.com/auth/youtube.readonly'],prompt:'consent',state,code_challenge_method:'S256',code_challenge:codes.codeChallenge}));
  const timeout=setTimeout(()=>server.close(),300000); timeout.unref();
  server.on('close',()=>clearTimeout(timeout));
  return server;
}
if (require.main === module) authenticate().catch(()=>{console.error('OAuth setup failed. Check config/oauth-client.json and docs/HORROR_SETUP.md.');process.exitCode=1;});
module.exports={authenticate,validCallback};
