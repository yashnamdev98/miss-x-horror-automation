const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {validateBrief,validatePackage,generate,exportPackage} = require('../horror/pipeline');
const {assertPaid,assertPublishingDisabled} = require('../utils/safety-policy');
const brief = {topic:'The locked platform',mode:'fiction',format:'short',narrator:{gender:'female',locale:'en-GB'},sources:[]};
const script = Array(50).fill('night').join(' ');
const production = {title:'Platform Zero | Fictional Horror',script,scenes:[{narration:script,visualPrompt:'An empty station at night'}],description:'Fictional horror story',tags:['horror'],thumbnailPrompt:'Platform zero',teaser:'An empty train arrives.'};
test('brief enforces female voice, provenance and separate editorial modes',()=>{
  assert.equal(validateBrief(brief),brief);
  assert.throws(()=>validateBrief({...brief,narrator:{gender:'male',locale:'en-US'}}));
  assert.throws(()=>validateBrief({...brief,mode:'true-case'}));
  const sourced = {...brief,mode:'true-case',sources:[{title:'Archive',url:'https://example.org/archive',checkedAt:'2026-11-09'}],claims:[{text:'Reported disappearance',sourceIndexes:[0]}]};
  assert.equal(validateBrief(sourced),sourced);
  assert.throws(()=>validateBrief({...sourced,claims:[{text:'invented',sourceIndexes:[4]}]}));
});
test('rejects incomplete script coverage and false fiction labeling',()=>{
  assert.equal(validatePackage(production,brief).runtimeVerified,false);
  assert.throws(()=>validatePackage({...production,scenes:[{narration:'omitted',visualPrompt:'station'}]},brief));
  assert.throws(()=>validatePackage({...production,description:'True events'},brief));
});
test('default and quota failure never contact paid fallback',async()=>{
  let calls=0;
  const request = async()=>{calls++; return {ok:false,status:429};};
  await assert.rejects(generate(brief,{env:{},request}),/disabled/);
  assert.equal(calls,0);
  await assert.rejects(generate(brief,{env:{ALLOW_EXTERNAL_REQUESTS:'true',GEMINI_FREE_TIER_CONFIRMED:'true',GEMINI_TEXT_MODEL:'explicit-model',GEMINI_API_KEY:'test'},request}),/429/);
  assert.equal(calls,1);
  assert.throws(()=>assertPaid({ALLOW_EXTERNAL_REQUESTS:'true'}),/Paid APIs disabled/);
  assert.throws(assertPublishingDisabled,/Publishing locked/);
});
test('Gemini adapter parses response and sends key only in header',async()=>{
  const env={ALLOW_EXTERNAL_REQUESTS:'true',GEMINI_FREE_TIER_CONFIRMED:'true',GEMINI_TEXT_MODEL:'test-model',GEMINI_API_KEY:'secret-for-test'};
  const p=await generate(brief,{env,request:async(url,opts)=>{
    assert.ok(!url.includes(env.GEMINI_API_KEY));
    assert.equal(opts.headers['x-goog-api-key'],env.GEMINI_API_KEY);
    return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:JSON.stringify(production)}]}}]})};
  }});
  assert.equal(p.script,script);
});
test('export makes truthful handoffs without media or a scheduled date',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'horror-test-'));
  try {
    const dir=path.join(root,'package');
    const m=await exportPackage(brief,production,dir);
    assert.equal(m.publishing.enabled,false);
    assert.equal(m.publishing.scheduledAt,null);
    assert.equal(m.stages.render,'not-started');
    const metadata=JSON.parse(await fs.readFile(path.join(dir,'metadata.json')));
    assert.equal(metadata.privacyStatus,'private');
    assert.equal(metadata.containsSyntheticMedia,true);
    assert.equal(await fs.readFile(path.join(dir,'story.txt'),'utf8'),script);
    await assert.rejects(exportPackage(brief,production,dir),/EEXIST/);
  } finally {await fs.rm(root,{recursive:true,force:true});}
});
test('status server is local-only by caller and rejects publish requests',async()=>{
  const {createServer}=require('../horror/status');
  const server=createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const url=`http://127.0.0.1:${server.address().port}`;
    const health=await (await fetch(url+'/health')).json();
    assert.equal(health.autoPublish,false);
    assert.equal((await fetch(url+'/publish/1',{method:'POST'})).status,403);
  } finally {await new Promise(resolve=>server.close(resolve));}
});
test('legacy direct publishing entry points are also locked',async()=>{
  const {PublishingSchedulingAgent}=require('../agents/publishing-scheduling-agent');
  const agent=new PublishingSchedulingAgent({},{});
  for (const name of ['scheduleContent','publishContent','uploadToYouTube','uploadThumbnail','uploadCaptions','processPublishQueue','emergencyPublish','resumeScheduledContent']) await assert.rejects(agent[name]({}),/Publishing locked/);
});
test('legacy scheduler cannot be initialized or resumed',async()=>{
  const {DailyAutomation}=require('../schedules/daily-automation');
  const scheduler=new DailyAutomation({},{});
  assert.equal(await scheduler.initialize(),false);
  assert.equal(scheduler.scheduledTasks.size,0);
  await assert.rejects(scheduler.resumeAutomation(),/locked/);
  await assert.rejects(scheduler.setupScheduledTasks(),/locked/);
});
test('OAuth callback validates state, path, code and provider denial',()=>{
  const {validCallback}=require('../horror/oauth');
  assert.equal(validCallback(new URL('http://127.0.0.1/oauth2callback?state=expected&code=test'),'expected'),true);
  for(const query of ['/oauth2callback?state=wrong&code=test','/wrong?state=expected&code=test','/oauth2callback?state=expected','/oauth2callback?state=expected&code=test&error=denied']) assert.equal(validCallback(new URL('http://127.0.0.1'+query),'expected'),false);
});
test('paid legacy provider entry points reject before external calls',async()=>{
  const {AIVideoGenerator}=require('../utils/ai-video-generator');
  const old=process.env.ALLOW_PAID_APIS; process.env.ALLOW_PAID_APIS='false';
  try {
    const generator=new AIVideoGenerator({});
    for(const name of ['generateTTSAudio','generateElevenLabsTTS','generateOpenAITTS','generateVisualAssets','generateReplicateVideo','generateThumbnail']) await assert.rejects(generator[name]('test'),/disabled/);
  } finally {if(old === undefined) delete process.env.ALLOW_PAID_APIS; else process.env.ALLOW_PAID_APIS=old;}
});
