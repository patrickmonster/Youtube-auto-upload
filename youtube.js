const google = require('googleapis').google;
const fs      = require('fs');
const OAuth2 = google.auth.OAuth2;
const request    = require('sync-request');

//토큰 취소
//https://accounts.google.com/o/oauth2/revoke?token=
//검증
//https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=
//UPDATE `twitchAuto` SET `id`=[value-1],`tid`=[value-2],`tname`=[value-3],`oauth_crate`=[value-4],`oauth_youtube`=[value-5],`refresh_token`=[value-6],`oauth_twitch`=[value-7] WHERE 1

const videoUpload = async (videoDetails,token) => {
  const {
    path,
    title,
    tags = [],
    description = '',
    status = 'public',
    showUploadProgress = false
  } = videoDetails;
  const videoSize = fs.statSync(path).size;
  const requestParams = {
    part: 'snippet, status',
    requestBody: {
      snippet: {
        title,
        description,
        tags
      },
      status: {privacyStatus: status}
    },
    media: {
      body: fs.createReadStream(path)
    }
  };
  const youtubeResponse = await google.youtube({ version: 'v3', auth: token}).videos.insert(requestParams, {
    onUploadProgress: (event) => {
      if(showUploadProgress) {
        const progress = Math.round((event.bytesRead / videoSize) * 100);
        console.info(`Uploading video [${title}/${path}] progress: ${progress}%`);
      }
    }
  });
  console.log(`Video available [${title}/${path}] at: https:/youtu.be/${youtubeResponse.data.id}`);
  return youtubeResponse.data;
};
const isAuth = function(token){
  return request('GET', 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token).statusCode==200;
}

const updateToken=function(client,secret,refresh_token){
    var data =  request('POST', 'https://accounts.google.com/o/oauth2/token', {headers: {'content-type': 'application/x-www-form-urlencoded'},body:[
      'client_id='+client,
      'client_secret='+secret,
      'refresh_token='+refresh_token,
      'grant_type=refresh_token'
    ].join('&')});
    if(data.statusCode!=200){
      //토큰 교환 실패
      return false;
    }
    return JSON.parse(data.getBody('utf8'));// 토큰 데이터(갱신용 데이터)
}


///https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=
module.exports = { videoUpload ,updateToken, isAuth};
