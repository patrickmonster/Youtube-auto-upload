const express    = require('express');
///// 트위치 비디오 다운로더
// const fs      = require('fs');


require("dotenv").config();
const passport = require("passport");
// const twitchStrategy = require("../js/passport-twitch").Strategy;
const YoutubeV3Strategy = require('passport-youtube-v3').Strategy


// var config = require('./dbconfig');//디비

const app = express();

// configuration =========================
app.set('port', 80);;

var clientIdTwitch = "ojp6hz9s8e6cad3rt33q5u4ym0rtj2";//클라이언트 id
// var redirect_uri = encodeURI("http://localhost")

console.log(
  process.env.YOUTUBE_CLIENT_ID, process.env.YOUTUBE_CLIENT_SC);
passport.use(new YoutubeV3Strategy({
    clientID: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SC,
    callbackURL: "http://localhost:3000/youtube/callback",
    scope: ['https://www.googleapis.com/auth/youtube.readonly']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile);
  }
));
app.get("/youtube", passport.authenticate("youtube"));
app.get(
  "/youtube/callback",
  passport.authenticate("youtube", { failureRedirect: "/" }),
  function (req, res) {
    res.status.send("?");
  }
);

// const callDB=function(qury,func){
//   var connection = mysql.createConnection(config.databaseOptions);//연결
//   connection.query(qury,func);
//   connection.end();
// }
////////////////////////////////////////////////////////////////////////////////
// app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/*
ya29.a0AfH6SMAvPom-JQ3BYx0LybbykPHWHp8-9E3sGMzqnKVHfOUBChvkdHCdWT_v1jgxx4v6MyzIu2La8jq5hJ6Cot_NxBfLkjxUW9D61Hj-pfqGoJIOaEJpPArHi1I167FlFCmBUux9wizVsqlzw5IxIUiLq0C_
1//0eVwZ55aQQND6CgYIARAAGA4SNwF-L9Ir8AATYdLpxoEWW7T6Z-BW_l7vqTCJgs9RlXWUYWoB0nZUgrXnVYSZRf6le_4IKrQZRp0
{
  provider: 'youtube',
  _raw: '{\n' +
    '  "kind": "youtube#channelListResponse",\n' +
    '  "etag": "RuuXzTIr0OoDqI4S0RU6n4FqKEM",\n' +
    '  "pageInfo": {\n' +
    '    "totalResults": 0,\n' +
    '    "resultsPerPage": 5\n' +
    '  }\n' +
    '}\n',
  _json: {
    kind: 'youtube#channelListResponse',
    etag: 'RuuXzTIr0OoDqI4S0RU6n4FqKEM',
    pageInfo: { totalResults: 0, resultsPerPage: 5 }
  }
}
*/


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

        // callDB("INSERT INTO `twitchAuto`(`tid`, `tname`, `update_time`,`refresh_token`, `oauth_twitch`) VALUES ('"+user.id+"','"+user.login+"','"+update_time+"','"+Ytoken.refresh_token+"','"+token.twitch+"')",(error, rows) => {
        //   if (error) throw error;
        //   res.writeHead(200,{'Content-Type':'text/html'});
        //   res.end("ok");
        // });
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
        // callDB("UPDATE `twitchAuto` SET refresh_token='"+Ytoken.refresh_token+"', update_time='"+update_time+"' WHERE id="+user.id,(error, rows) => {
        //   if (error) throw error;
        //   res.writeHead(200,{'Content-Type':'text/html'});
        //   res.end("ok");
        // });
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

app.listen(3000, () => {
  console.log('Express server listening on port ' + app.get('port'));
});



/*
모니터링
npx sequelize model:create --name twitch_live_recoding --attributes "login:text"

*/