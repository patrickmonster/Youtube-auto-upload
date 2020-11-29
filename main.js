const express    = require('express');
const mysql      = require('mysql');
const request    = require('sync-request');
const moment     = require('moment');
const bodyParser   = require('body-parser');
///// 트위치 비디오 다운로더
const fs      = require('fs');

var config = require('./dbconfig');//디비

const app = express();

// configuration =========================
app.set('port', 80);
app.use(express.json());

var clientIdTwitch = "";//클라이언트 id
var redirect_uri = encodeURI("http://localhost")

const callDB=function(qury,func){
  var connection = mysql.createConnection(config.databaseOptions);//연결
  connection.query(qury,func);
  connection.end();
}
////////////////////////////////////////////////////////////////////////////////
// app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', (req, res) => {
  fs.readFile('index.html',function(error, data){
    if(!error){
      res.writeHead(200,{'Content-Type':'text/html'});
      res.end(data);
    }else console.log(error);
  });
});
app.get('/info', (req, res) => {
  fs.readFile('info.html',function(error, data){
    if(!error){
      res.writeHead(200,{'Content-Type':'text/html'});
      res.end(data);
    }else console.log(error);
  });
});
app.post('/user', (req, res) => {
  const token={'youtube':req.headers.youtube,'twitch':req.headers.twitch,'user':req.headers.user};
  // res.writeHead(200,{'Content-Type':'text/html'});res.end("??");return;
  var data = request('GET', 'https://api.twitch.tv/helix/users', {
    headers: {
      'client-id': clientIdTwitch,
      'Authorization': `Bearer ${token.twitch}`
    }
  });
  var user = JSON.parse(data.getBody('utf8')).data[0];
  if(token.user.indexOf('gast')!=-1 || user && user.login===token.user){
    try {
      data =  request('POST', 'https://oauth2.googleapis.com/token', {headers: {'content-type': 'application/x-www-form-urlencoded'},body:[
        'code='+token.youtube,
        'client_id='+config.youtubeOption.client,
        'client_secret='+config.youtubeOption.password,
        'redirect_uri='+redirect_uri,
        'grant_type=authorization_code'
      ].join('&')});
      var Ytoken = JSON.parse(data.getBody('utf8'));
      if(Ytoken.access_token){// 토큰이 정상
        var update_time = moment(Date.now()).add(5,'M').add(3,'w').format('YYYY-MM-DD HH:mm:ss');// 갱신시간 (리프레쉬  토큰)
        request('GET', 'https://oauth2.googleapis.com/revoke?token='+Ytoken.access_token, {headers: {'content-type': 'application/x-www-form-urlencoded'}});
        callDB("INSERT INTO `twitchAuto`(`tid`, `tname`, `update_time`,`refresh_token`, `oauth_twitch`) VALUES ('"+user.id+"','"+user.login+"','"+update_time+"','"+Ytoken.refresh_token+"','"+token.twitch+"')",(error, rows) => {
          if (error) throw error;
          res.writeHead(200,{'Content-Type':'text/html'});
          res.end("ok");
        });
      }else{
        res.writeHead(400,{'Content-Type':'text/html'});
        res.end('Error');
      }
    } catch (e) {
      console.log(e);
      res.writeHead(400,{'Content-Type':'text/html'});
      res.end('Error');
    }
  }else if(token.user.indexOf('update')!=-1) {
    try {
      data =  request('POST', 'https://oauth2.googleapis.com/token', {headers: {'content-type': 'application/x-www-form-urlencoded'},body:[
        'code='+token.youtube,
        'client_id='+config.youtubeOption.client,
        'client_secret='+config.youtubeOption.password,
        'redirect_uri='+redirect_uri,
        'grant_type=authorization_code'
      ].join('&')});
      var Ytoken = JSON.parse(data.getBody('utf8'));
      if(Ytoken.access_token){// 토큰이 정상
        var update_time = moment(Date.now()).add(5,'M').add(3,'w').format('YYYY-MM-DD HH:mm:ss');// 갱신시간 (리프레쉬  토큰)
        request('GET', 'https://oauth2.googleapis.com/revoke?token='+Ytoken.access_token, {headers: {'content-type': 'application/x-www-form-urlencoded'}});
        callDB("UPDATE `twitchAuto` SET refresh_token='"+Ytoken.refresh_token+"', update_time='"+update_time+"' WHERE id="+user.id,(error, rows) => {
          if (error) throw error;
          res.writeHead(200,{'Content-Type':'text/html'});
          res.end("ok");
        });
      }else{
        res.writeHead(400,{'Content-Type':'text/html'});
        res.end('Error');
      }
    } catch (e) {
      console.log(e);
      res.writeHead(400,{'Content-Type':'text/html'});
      res.end('Error');
    }
  }else {
    res.writeHead(400,{'Content-Type':'text/html'});
    res.end('Error - unmach token');
  }
});

app.listen(process.env.PORT, () => {
  console.log('Express server listening on port ' + app.get('port'));
});
