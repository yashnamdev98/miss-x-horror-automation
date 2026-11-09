require('dotenv').config();
const http = require('node:http');
function createServer() {
  return http.createServer((req,res) => {
    if (!['/','/health'].includes(req.url) || req.method !== 'GET') {
      res.writeHead(403,{'Content-Type':'application/json'});
      return res.end(JSON.stringify({error:'Staging: use reviewed CLI exports; publishing disabled'}));
    }
    res.writeHead(200,{'Content-Type':'application/json'});
    res.end(JSON.stringify({status:'staging',autoPublish:false,paidAPIs:false,scheduler:false,workflow:'npm run horror -- plan examples/horror-brief.json'}));
  });
}
if (require.main === module) createServer().listen(Number(process.env.PORT || 3456),'127.0.0.1',()=>console.log('Staging status: http://127.0.0.1:'+(process.env.PORT || 3456)));
module.exports = {createServer};
