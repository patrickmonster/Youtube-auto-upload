var DataTypes = require("sequelize").DataTypes;
var _authentication = require("./authentication");
var _callback_apis = require("./callback_apis");
var _db_logs = require("./db_logs");
var _discord_subscription = require("./discord_subscription");
var _follow_bot_list = require("./follow_bot_list");
var _live_monit_command = require("./live_monit_command");
var _live_monit_streams = require("./live_monit_streams");
var _live_on_channels = require("./live_on_channels");
var _live_on_monits = require("./live_on_monits");
var _live_on_servers = require("./live_on_servers");
var _live_stream_upload = require("./live_stream_upload");
var _live_stream_upload_state = require("./live_stream_upload_state");
var _question_data = require("./question_data");
var _tokens = require("./tokens");
var _twip_notice_url = require("./twip_notice_url");
var _users = require("./users");
var _youtube_tokens = require("./youtube_tokens");

function initModels(sequelize) {
  var authentication = _authentication(sequelize, DataTypes);
  var callback_apis = _callback_apis(sequelize, DataTypes);
  var db_logs = _db_logs(sequelize, DataTypes);
  var discord_subscription = _discord_subscription(sequelize, DataTypes);
  var follow_bot_list = _follow_bot_list(sequelize, DataTypes);
  var live_monit_command = _live_monit_command(sequelize, DataTypes);
  var live_monit_streams = _live_monit_streams(sequelize, DataTypes);
  var live_on_channels = _live_on_channels(sequelize, DataTypes);
  var live_on_monits = _live_on_monits(sequelize, DataTypes);
  var live_on_servers = _live_on_servers(sequelize, DataTypes);
  var live_stream_upload = _live_stream_upload(sequelize, DataTypes);
  var live_stream_upload_state = _live_stream_upload_state(sequelize, DataTypes);
  var question_data = _question_data(sequelize, DataTypes);
  var tokens = _tokens(sequelize, DataTypes);
  var twip_notice_url = _twip_notice_url(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var youtube_tokens = _youtube_tokens(sequelize, DataTypes);

  discord_subscription.belongsTo(authentication, { as: "id_authentication", foreignKey: "id"});
  authentication.hasMany(discord_subscription, { as: "discord_subscriptions", foreignKey: "id"});
  twip_notice_url.belongsTo(authentication, { as: "id_authentication", foreignKey: "id"});
  authentication.hasOne(twip_notice_url, { as: "twip_notice_url", foreignKey: "id"});
  live_on_channels.belongsTo(live_on_monits, { as: "user_name_live_on_monit", foreignKey: "user_name"});
  live_on_monits.hasMany(live_on_channels, { as: "live_on_channels", foreignKey: "user_name"});
  live_stream_upload.belongsTo(users, { as: "user_uu", foreignKey: "user_uuid"});
  users.hasOne(live_stream_upload, { as: "live_stream_upload", foreignKey: "user_uuid"});
  tokens.belongsTo(users, { as: "user_uu", foreignKey: "user_uuid"});
  users.hasMany(tokens, { as: "tokens", foreignKey: "user_uuid"});

  return {
    authentication,
    callback_apis,
    db_logs,
    discord_subscription,
    follow_bot_list,
    live_monit_command,
    live_monit_streams,
    live_on_channels,
    live_on_monits,
    live_on_servers,
    live_stream_upload,
    live_stream_upload_state,
    question_data,
    tokens,
    twip_notice_url,
    users,
    youtube_tokens,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
