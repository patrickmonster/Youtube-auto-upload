const express    = require('express');

require("dotenv").config();
const passport = require("passport");
const YoutubeV3Strategy = require('passport-youtube-v3').Strategy
const { youtube_tokens } = require("#models");

const app = express();

app.set('port', 80);

passport.use(new YoutubeV3Strategy({
    clientID: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SC,
    callbackURL: "http://localhost:3000/youtube/callback",
    scope: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/youtube.upload']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile);
    youtube_tokens.findOne({where: {
      youtube_id : profile.id
    }}).then(o=>{
      if(o){
        o.refresh_token = refreshToken;
      }else{
        return youtube_tokens.create({
          youtube_id: profile.id,
          youtube_name: profile.displayName,
          refresh_token: refreshToken
        })
      }
    }).then(()=>{done()}).catch();
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
// app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(3000, () => {
  console.log('Express server listening on port ' + app.get('port'));
});