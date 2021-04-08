const axios = require('axios');

module.exports =  async function loadTwitchLiveStreamStateUser(token, l, target = "user_id", client_id) {
	let tag = "";
	if (typeof l == "string") tag = `after=${l}`;
	else tag = `${target}=${l.join("&" + target + "=")}`;

	client_id = client_id || twitch_passport_options.clientID;

	let data = await axios({
	  mathod: "GET",
	  url: `https://api.twitch.tv/helix/streams?first=100&${tag}`,
	  headers: {
		"client-id": twitch_passport_options.clientID,
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