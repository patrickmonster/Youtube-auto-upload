const axios = require('axios');
///// 트위치 비디오 다운로더
// const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const child_process = require('child_process');

require("dotenv").config();
const { twitch_live_recoding } = require('#models');
const { Token, youtube: { videoUpload, updateToken, isAuth } } = require('#controllers');

// var clientIdTwitch = "ojp6hz9s8e6cad3rt33q5u4ym0rtj2";
// var redirect_uri = encodeURI("http://localhost")

!fs.existsSync("videos") && fs.mkdirSync("videos");

// const callDB=function(qury,func){
//   var connection = mysql.createConnection(config.databaseOptions);//연결
//   connection.query(qury,func);
//   connection.end();
// }

const online_users = [];
const live_data = {};

let youtube_token = "";

//정기적으로 youtube 토큰을 업데이트함
const DB_Update = function () {
  twitch_live_recoding.findAll().then(async data => {
    data = data.map(i => i.dataValues);

    const { token, client_id: clientID } = await Token();
    const ids = data.map(o => o.login);
    /**
     * {
  "data": [
    {
      "id": "40944942733",
      "user_id": "67931625",
      "user_login": "amar",
      "user_name": "Amar",
      "game_id": "33214",
      "game_name": "Fortnite",
      "type": "live",
      "title": "27h Stream Pringles Deathrun Map + 12k MK Turnier | !sub !JustLegends !Pc !yfood",
      "viewer_count": 14944,
      "started_at": "2021-03-09T16:59:39Z",
      "language": "de",
      "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_amar-{width}x{height}.jpg",
      "tag_ids": [
        "9166ad14-41f1-4b04-a3b8-c8eb838c6be6"
      ]
    },
  ],
  "pagination": {
    "cursor": "eyJiIjp7IkN1cnNvciI6ImV5SnpJam94TkRrME5DNDFOekV5TXpBMU1UWTVNRElzSW1RaU9tWmhiSE5sTENKMElqcDBjblZsZlE9PSJ9LCJhIjp7IkN1cnNvciI6ImV5SnpJam81TlRFMkxqVTNOREF6TmpNNU9UTXpNaXdpWkNJNlptRnNjMlVzSW5RaU9uUnlkV1Y5In19"
  }
}
     */
    const livusers = await loadTwitchLiveStreamStateUser(token, ids, "user_login", clientID);

    const live_data_now = livusers.map(o => {
      return { "display-name": o.user_name, "title": o.title, "startAt": o["started_at"] }
    });

    const online = live_data_now.filter(o => online_users.includes(o["display-name"]));
    const offline = live_data_now.filter(o => !online_users.includes(o["display-name"]));

    //새로운 온라인 유저
    online.filter(o => !online_users.includes(o["display-name"])).forEach(o => {
      live_data[o["display-name"]] = o;
      online_users.push(o["display-name"]);
      console.log(`${o["user_name"]}님이 라이브 생방을 시작함! - ${o["title"]}`);
    });

    offline.filter(o => !online_users.includes(o["display-name"])).forEach(o => {
      delete live_data[o["display-name"]];
      const index = online_users.indexOf(o["display-name"]);
      if (index != -1) {
        online_users.splice(index, 1);
      }

      // './lib/youtube-dl.exe', ['-f','720','--output','clip/%(title)s$'+key+'.%(ext)s','https://clips.twitch.tv/embed?clip='+key]
      child_process.spawn('youtube-dl', ['', item.tid]).stdout.on('data', function (data) {
        console.log(item.tid, ":", data.toString());
      }).on("exit", function (code) {
        console.log(item.tid, "처리 완료!", code);
      });//보조 프로세서 다운로드 시작
    });
    console.log(`활성사용자 : ${online_users.length}명 [${online_users.join(",")}]`);
    // isAuth(youtube_token).then(async i=>{
    //   if(!i){
    //     youtube_token = (await updateToken()).access_token;
    //     console.log(`토큰 업데이트 : ${youtube_token}`);
    //   }
    //   console.log(youtube_token); // 발급토큰r
    // });
  }).catch(e => {
    //
    // console.error(e);
  });
  // callDB("SELECT * FROM `twitchAuto`",(error, rows) => {// 라이브 방송 모니터링
  //   if (error) throw error;
  //   var l = [],livs=[];
  //   for(var i of rows)l.push(i.tid);
  //   for(var i of rows)if(i.islive)livs.push(i.tid);
  //   if(!l.length)return;
  //   var livusers = loadTwitchLiveStreamState(rows[rows.length-1].oauth_twitch,l);
  //   rows.forEach((item, i) => {
  //     for(var u of livusers){
  //       if(u["user_id"]==item.tid){//검색됨
  //         if(item.islive==0)
  //           callDB("UPDATE `twitchAuto` SET islive=1 WHERE tid="+item.tid,(error, rows) => {
  //             if (error) throw error;
  //             console.log(`${u["user_name"]}님이 라이브 생방을 시작함! - ${u["title"]}`);
  //           });
  //         return;
  //       }
  //     }
  //     if(item.islive!=0)
  //     callDB("UPDATE `twitchAuto` SET islive=0 WHERE tid="+item.tid,(error, rows) => {
  //       if (error) throw error;
  //       console.log(item.tid,"처리 시작...");
  //       var ps = child_process.spawn('node', ['down.js',item.tid])
  //       ps.stdout.on('data', function(data) {
  //           console.log(item.tid,":",data.toString());
  //       });
  //       ps.on("exit",function(code){
  //         console.log(item.tid,"처리 완료!" , code);
  //       });//보조 프로세서 다운로드 시작
  //     });
  //   });//
  // });
}//rows[0].oauth_twitch

async function loadTwitchLiveStreamStateUser(token, l, target = "user_id", client_id) {
  let tag = "";
  console.log(token, client_id);
  client_id = client_id || twitch_passport_options.clientID;
  if (typeof l == "string") tag = `after=${l}`;
  else tag = `${target}=${l.join("&" + target + "=")}`;
  let data = await axios({
    mathod: "GET",
    url: `https://api.twitch.tv/helix/streams?first=100&${tag}`,
    headers: {
      "client-id": client_id,
      authorization: `Bearer ${token}`,
    },
  });
  if (data.status != 200) return [];
  data = data.data;
  if (data.pagination.hasOwnProperty("cursor"))
    data.data.push(
      ...loadTwitchLiveStreamStateUser(token, data.pagination.cursor)
    );
  return data.data;
}
DB_Update();
// setInterval(DB_Update,60*1000);
