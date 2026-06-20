"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const steamid_1 = __importDefault(require("steamid"));
class SteamCommunity extends events_1.EventEmitter {
    steamID = null;
    _jar = null;
    client;
    constructor(client, options) {
        super();
        this.client = client;
        if (options?.steamID) {
            this.steamID = new steamid_1.default(options.steamID);
        }
    }
    loggedIn(callback) {
        this.client
            .getStatus()
            .then((status) => {
            callback(undefined, status.connected, false);
        })
            .catch((err) => {
            callback(err);
        });
    }
    getSessionID() {
        return "dummy_session_id";
    }
    getWebApiKey(callback) {
        callback(new Error("Not supported via g-mand"));
    }
    createWebApiKey(_options, callback) {
        callback(new Error("Not supported via g-mand"));
    }
    setCookies(_cookies) { }
    editProfile(_settings, callback) {
        if (callback)
            callback();
    }
    profileSettings(_settings, callback) {
        if (callback)
            callback();
    }
    uploadAvatar(_image, callback) {
        if (callback)
            callback();
    }
    resetItemNotifications(callback) {
        if (callback)
            callback();
    }
    inviteUserToGroup(_userID, _groupID, callback) {
        if (callback)
            callback();
    }
    getSteamGroup(_id, callback) {
        callback(undefined, {
            steamID: new steamid_1.default("76561198000000000"),
            name: "Dummy Group",
            url: "",
            headline: "",
            summary: "",
            avatarHash: Buffer.alloc(0),
            members: 0,
            membersInChat: 0,
            membersInGame: 0,
            membersOnline: 0,
            join: (_callback) => { },
        });
    }
    getTradeURL(callback) {
        callback(undefined, "", "");
    }
    getSteamUser(_id, callback) {
        callback(undefined, {
            steamID: new steamid_1.default("76561198000000000"),
            name: "Unknown",
            onlineState: "online",
            stateMessage: "",
            privacyState: "public",
            visibilityState: "3",
            avatarHash: "",
            vacBanned: "0",
            tradeBanState: "none",
            isLimitedAccount: "0",
            customURL: "",
            groups: null,
            primaryGroup: null,
            getAvatarURL: (_size) => "",
        });
    }
    acceptConfirmationForObject(_identitySecret, _objectID, callback) {
        callback();
    }
    getFriendsList(callback) {
        callback(undefined, {});
    }
}
exports.default = SteamCommunity;
//# sourceMappingURL=steamcommunity.js.map