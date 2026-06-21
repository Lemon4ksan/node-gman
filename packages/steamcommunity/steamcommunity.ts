import { EventEmitter } from "events";
import SteamID from "steamid";
import { GManClient } from "node-gman";

export default class SteamCommunity extends EventEmitter {
  public steamID: SteamID | null = null;
  public _jar: any = null;

  private client: GManClient;

  constructor(client: GManClient, options?: any) {
    super();
    this.client = client;

    if (options?.steamID) {
      this.steamID = new SteamID(options.steamID);
    }
  }

  loggedIn(
    callback: (err: any, loggedIn?: boolean, familyView?: boolean) => void,
  ): void {
    this.client
      .getStatus()
      .then((status) => {
        callback(undefined, status.connected, false);
      })
      .catch((err) => {
        callback(err);
      });
  }

  getSessionID(): string {
    return "dummy_session_id";
  }

  getWebApiKey(callback: (err?: Error, key?: string) => void): void {
    this.client
      .execRequest({
        type: 1, // REQUEST_TYPE_COMMUNITY
        method: "GET",
        path: "dev/apikey",
      })
      .then((resp) => {
        if (!resp.success) {
          return callback(new Error(resp.message));
        }
        const bodyStr = resp.body.toString();
        const match = bodyStr.match(/Key:\s*([0-9A-F]{32})/i);
        if (match && match[1]) {
          callback(undefined, match[1]);
        } else {
          callback(new Error("API key not found on page"));
        }
      })
      .catch((err) => callback(err));
  }

  createWebApiKey(
    options: { domain: string; identitySecret?: string; requestID?: string },
    callback: (
      err?: Error,
      result?: {
        confirmationRequired: boolean;
        apiKey: string;
        finalizeOptions: Record<string, any>;
      },
    ) => void,
  ): void {
    const domain = options.domain || "localhost";
    this.client
      .execRequest({
        type: 1, // REQUEST_TYPE_COMMUNITY
        method: "POST",
        path: "dev/registerkey",
        is_post_form: true,
        params: {
          domain: domain,
          agreeToTerms: "agreed",
          Submit: "Register",
        },
      })
      .then((resp) => {
        if (!resp.success) {
          return callback(new Error(resp.message));
        }
        this.getWebApiKey((err, key) => {
          if (err) {
            callback(err);
          } else if (key) {
            callback(undefined, {
              confirmationRequired: false,
              apiKey: key,
              finalizeOptions: {},
            });
          } else {
            callback(new Error("Failed to register API key"));
          }
        });
      })
      .catch((err) => callback(err));
  }

  setCookies(_cookies: string[]): void {}

  editProfile(
    _settings: {
      name?: string;
      realName?: string;
      summary?: string;
      country?: string;
      state?: string;
      city?: string;
      customURL?: string;
      featuredBadge?: number;
      primaryGroup?: SteamID | string;
    },
    callback?: (err?: Error) => void,
  ): void {
    if (callback) callback();
  }

  profileSettings(
    _settings: {
      profile?: number;
      comments?: number;
      inventory?: number;
      inventoryGifts?: boolean;
      gameDetails?: number;
      playTime?: boolean;
      friendsList?: number;
    },
    callback?: (err?: Error) => void,
  ): void {
    if (callback) callback();
  }

  uploadAvatar(
    _image: Buffer | string,
    callback?: (err?: Error, url?: string) => void,
  ): void {
    if (callback) callback();
  }

  resetItemNotifications(callback?: (err?: Error) => void): void {
    if (callback) callback();
  }

  inviteUserToGroup(
    _userID: SteamID | string,
    _groupID: SteamID | string,
    callback?: (err?: Error) => void,
  ): void {
    if (callback) callback();
  }

  getSteamGroup(
    _id: SteamID | string,
    callback: (err?: Error, group?: any) => void,
  ): void {
    callback(undefined, {
      steamID: new SteamID("76561198000000000"),
      name: "Dummy Group",
      url: "",
      headline: "",
      summary: "",
      avatarHash: Buffer.alloc(0),
      members: 0,
      membersInChat: 0,
      membersInGame: 0,
      membersOnline: 0,
      join: (_callback?: (err?: Error) => void) => {},
    });
  }

  getTradeURL(
    callback: (err?: Error, url?: string, token?: string) => void,
  ): void {
    this.client
      .execRequest({
        type: 1, // REQUEST_TYPE_COMMUNITY
        method: "GET",
        path: "my/tradeoffers/privacy",
      })
      .then((resp) => {
        if (!resp.success) {
          return callback(new Error(resp.message));
        }
        const bodyStr = resp.body.toString();
        const urlMatch = bodyStr.match(/id="trade_offer_access_url"[^>]*value="([^"]+)"/);
        if (urlMatch && urlMatch[1]) {
          const tradeURL = urlMatch[1];
          const tokenMatch = tradeURL.match(/token=([a-zA-Z0-9_-]+)/);
          const token = tokenMatch ? tokenMatch[1] : "";
          callback(undefined, tradeURL, token);
        } else {
          callback(new Error("Trade URL input field not found on page"));
        }
      })
      .catch((err) => callback(err));
  }

  getSteamUser(
    id: SteamID | string,
    callback: (err?: Error, user?: any) => void,
  ): void {
    const steamID = new SteamID(id.toString());
    const steamID64 = steamID.getSteamID64();

    this.client
      .execRequest({
        type: 3, // REQUEST_TYPE_WEBAPI
        interface: "ISteamUser",
        action: "GetPlayerSummaries",
        version: 2,
        method: "GET",
        params: {
          steamids: steamID64,
        },
      })
      .then((resp) => {
        if (!resp.success) {
          return callback(new Error(resp.message));
        }
        try {
          const data = JSON.parse(resp.body.toString());
          const player = data?.response?.players?.[0];
          if (!player) {
            return callback(new Error("User not found"));
          }

          callback(undefined, {
            steamID: steamID,
            name: player.personaname || "Unknown",
            onlineState: player.personastate === 0 ? "offline" : "online",
            stateMessage: "",
            privacyState: player.communityvisibilitystate === 3 ? "public" : "private",
            visibilityState: String(player.communityvisibilitystate || 3),
            avatarHash: player.avatarhash || "",
            vacBanned: player.vacbanned ? "1" : "0",
            tradeBanState: player.tradebanstate || "none",
            isLimitedAccount: "0",
            customURL: "",
            groups: null,
            primaryGroup: null,
            getAvatarURL: (size: string) => {
              const base = player.avatar || "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";
              if (size === "full" && player.avatarfull) return player.avatarfull;
              if (size === "medium" && player.avatarmedium) return player.avatarmedium;
              return base;
            },
          });
        } catch (e: any) {
          callback(new Error("Failed to parse user details: " + e.message));
        }
      })
      .catch((err) => callback(err));
  }

  acceptConfirmationForObject(
    _identitySecret: string,
    _objectID: string,
    callback: (err?: Error) => void,
  ): void {
    callback();
  }

  getFriendsList(
    callback: (err?: Error, friendlist?: Record<string, number>) => void,
  ): void {
    this.client
      .execRequest({
        type: 2, // REQUEST_TYPE_UNIFIED
        interface: "User",
        action: "GetFriendList",
        method: "POST",
        body: JSON.stringify({
          relationship: "friend",
        }),
      })
      .then((resp) => {
        if (!resp.success) {
          return callback(new Error(resp.message));
        }
        try {
          const data = JSON.parse(resp.body.toString());
          const list: Record<string, number> = {};
          if (data && data.friends) {
            for (const f of data.friends) {
              if (f.steamid) {
                list[f.steamid] = 3;
              }
            }
          }
          callback(undefined, list);
        } catch (e: any) {
          callback(new Error("Failed to parse friends list: " + e.message));
        }
      })
      .catch((err) => callback(err));
  }
}

export namespace SteamCommunity {
  export interface Group {
    steamID: SteamID;
    name: string;
    url: string;
    headline: string;
    summary: string;
    avatarHash: Buffer;
    members: number;
    membersInChat: number;
    membersInGame: number;
    membersOnline: number;
    join: (callback?: (err?: Error) => void) => void;
  }

  export interface User {
    steamID: SteamID;
    name: string;
    onlineState: string;
    stateMessage: string;
    privacyState: string;
    visibilityState: string;
    avatarHash: string;
    vacBanned: string;
    tradeBanState: string;
    isLimitedAccount: string;
    customURL: string;
    groups: null;
    primaryGroup: null;
    getAvatarURL: (size: string) => string;
  }

  export interface FriendList {
    [steamID64: string]: number;
  }
}
