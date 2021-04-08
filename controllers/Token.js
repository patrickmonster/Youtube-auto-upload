
const axios = require('axios');
require("dotenv").config();

process.env.API_TWITCH_TOKEN  = process.env.API_TWITCH_TOKEN || "6rte60vb5q6ma7llikana1hyntoikf"; // 디폴트 토큰
const Token = async function(token){//토큰 없으면 디폴트 토큰으로 생성
	return await axios.create({
		baseURL: 'https://id.twitch.tv/oauth2/validate',
		headers: { 'Authorization':  `Bearer ${token || process.env.API_TWITCH_TOKEN}`},
	}).get().then(recive=>{
		const {data, status} = recive;
		if(status != 200)
			return null;
		data.token = process.env.API_TWITCH_TOKEN;
		return data;
	}).catch(e=>{
		console.error(e.response.data)
	});
};
// orefinger / oauth:6rte60vb5q6ma7llikana1hyntoikf (단순 데이터 수신용 토큰)
module.exports = Token