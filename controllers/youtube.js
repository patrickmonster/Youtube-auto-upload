const google = require('googleapis').google;
const fs      = require('fs');
const OAuth2 = google.auth.OAuth2;
const axios = require('axios');
// const request    = require('sync-request');

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
const isAuth = async function(token){
  try{
    await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    return true;
  } catch(e){
    return false;
  }
}
/**
 * ya29.a0AfH6SMAvPom-JQ3BYx0LybbykPHWHp8-9E3sGMzqnKVHfOUBChvkdHCdWT_v1jgxx4v6MyzIu2La8jq5hJ6Cot_NxBfLkjxUW9D61Hj-pfqGoJIOaEJpPArHi1I167FlFCmBUux9wizVsqlzw5IxIUiLq0C_
 * @param {*} client 
 * @param {*} secret 
 * @param {*} refresh_token 1//0eVwZ55aQQND6CgYIARAAGA4SNwF-L9Ir8AATYdLpxoEWW7T6Z-BW_l7vqTCJgs9RlXWUYWoB0nZUgrXnVYSZRf6le_4IKrQZRp0
 * @returns 
 */
const updateToken=async function(){
    const data = await axios.post('https://accounts.google.com/o/oauth2/token?' + [
      'client_id=150751817804-v4clbk35at0eg1252e4vi47covj930pf.apps.googleusercontent.com',
      'client_secret=Tv303D3Lya0K29APFo24q9w6',
      'refresh_token=1//0eVwZ55aQQND6CgYIARAAGA4SNwF-L9Ir8AATYdLpxoEWW7T6Z-BW_l7vqTCJgs9RlXWUYWoB0nZUgrXnVYSZRf6le_4IKrQZRp0',
      'grant_type=refresh_token'
    ].join('&'), {}, {'content-type': 'application/x-www-form-urlencoded'});
    return data.data;
}

const youtube = { videoUpload ,updateToken, isAuth};


///https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=
module.exports = youtube;
