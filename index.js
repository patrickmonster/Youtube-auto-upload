const mysql      = require('mysql');
const request    = require('sync-request');
///// 트위치 비디오 다운로더
// const ffmpeg = require('fluent-ffmpeg');
const fs      = require('fs');
const child_process = require('child_process')


var config = require('./dbconfig');

var clientIdTwitch = "ojp6hz9s8e6cad3rt33q5u4ym0rtj2";
var redirect_uri = encodeURI("http://localhost")

!fs.existsSync("videos") && fs.mkdirSync("videos");

const callDB=function(qury,func){
  var connection = mysql.createConnection(config.databaseOptions);//연결
  connection.query(qury,func);
  connection.end();
}

//정기적으로 youtube 토큰을 업데이트함
const DB_Update=function(){
  callDB("SELECT * FROM `twitchAuto`",(error, rows) => {// 라이브 방송 모니터링
    if (error) throw error;
    var l = [],livs=[];
    for(var i of rows)l.push(i.tid);
    for(var i of rows)if(i.islive)livs.push(i.tid);
    if(!l.length)return;
    var livusers = loadTwitchLiveStreamState(rows[rows.length-1].oauth_twitch,l);
    rows.forEach((item, i) => {
      for(var u of livusers){
        if(u["user_id"]==item.tid){//검색됨
          if(item.islive==0)
            callDB("UPDATE `twitchAuto` SET islive=1 WHERE tid="+item.tid,(error, rows) => {
              if (error) throw error;
              console.log(`${u["user_name"]}님이 라이브 생방을 시작함! - ${u["title"]}`);
            });
          return;
        }
      }
      if(item.islive!=0)
      callDB("UPDATE `twitchAuto` SET islive=0 WHERE tid="+item.tid,(error, rows) => {
        if (error) throw error;
        console.log(item.tid,"처리 시작...");
        var ps = child_process.spawn('node', ['down.js',item.tid])
        ps.stdout.on('data', function(data) {
            console.log(item.tid,":",data.toString());
        });
        ps.on("exit",function(code){
          console.log(item.tid,"처리 완료!" , code);
        });//보조 프로세서 다운로드 시작
      });
    });//
  });
}//rows[0].oauth_twitch

function loadTwitchLiveStreamState(token,l){
  var tag = "";
  if(typeof l == 'string')//next
    tag=`after=${l}`;
  else
    tag=`user_id=${l.join('&user_id=')}`;
  var data = request('GET', `https://api.twitch.tv/helix/streams?first=100&`+tag, {headers: {
    "client-id":clientIdTwitch,
    "Authorization":"Bearer "+token
  }});
  var users = JSON.parse(data.getBody('utf8'));
  if(users.pagination.hasOwnProperty('cursor')){
    users.data=users.data.concat(loadTwitchLiveStreamState(users.pagination.cursor));
  }
  return users.data;
}
DB_Update();
setInterval(DB_Update,60*1000);
