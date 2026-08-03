import { EventEmitter } from "events";
import SteamID from "steamid";
import { GManClient } from "node-gman";

export enum EResult {
  Invalid = 0,
  OK = 1,
  Fail = 2,
  NoConnection = 3,
  InvalidPassword = 5,
  LoggedInElsewhere = 6,
  InvalidProtocolVer = 7,
  InvalidParam = 8,
  FileNotFound = 9,
  Busy = 10,
  InvalidState = 11,
  InvalidName = 12,
  InvalidEmail = 13,
  DuplicateName = 14,
  AccessDenied = 15,
  Timeout = 16,
  Banned = 17,
  AccountNotFound = 18,
  InvalidSteamID = 19,
  ServiceUnavailable = 20,
  NotLoggedOn = 21,
  Pending = 22,
  EncryptionFailure = 23,
  InsufficientPrivilege = 24,
  LimitExceeded = 25,
  Revoked = 26,
  Expired = 27,
  AlreadyRedeemed = 28,
  DuplicateRequest = 29,
  AlreadyOwned = 30,
  IPNotFound = 31,
  PersistFailed = 32,
  LockingFailed = 33,
  LogonSessionReplaced = 34,
  ConnectFailed = 35,
  HandshakeFailed = 36,
  IOFailure = 37,
  RemoteDisconnect = 38,
  PasswordRequiredToKickSession = 49,
  PasswordUnset = 56,
  TwoFactorCodeMismatch = 88,
  AccountLoginDeniedNeedTwoFactor = 85,
}

export enum EPersonaState {
  Offline = 0,
  Online = 1,
  Busy = 2,
  Away = 3,
  Snooze = 4,
  LookingToTrade = 5,
  LookingToPlay = 6,
  Max = 7,
}

export enum EClanRelationship {
  None = 0,
  Blocked = 1,
  Invited = 2,
  Member = 3,
  Kicked = 4,
  KickAcknowledged = 5,
}

export enum EFriendRelationship {
  None = 0,
  Blocked = 1,
  RequestRecipient = 2,
  Friend = 3,
  RequestInitiator = 4,
  Ignored = 5,
  IgnoredFriend = 6,
  SuggestedFriend = 7,
  Max = 8,
}

export default class SteamUser extends EventEmitter {
  public steamID: SteamID | null = null;
  public myFriends: Record<string, EFriendRelationship> = {};
  public myGroups: Record<string, EClanRelationship> = {};
  public users: Record<string, any> = {};
  public autoRelogin: boolean = true;
  public _playingAppIds: number[] = [];

  public chat: {
    sendFriendMessage: (
      steamID: SteamID | string,
      message: string,
      options?: { chatEntryType?: number; containsBbCode?: boolean },
      callback?: (err: Error, response?: any) => void,
    ) => void;
  };

  public client: GManClient;
  private _loggedOn: boolean = false;

  constructor(client: GManClient) {
    super();
    this.client = client;

    this.chat = {
      sendFriendMessage: (
        steamID: SteamID | string,
        message: string,
        _options?: { chatEntryType?: number; containsBbCode?: boolean },
        callback?: (err: Error, response?: any) => void,
      ) => {
        const id =
          typeof steamID === "string" ? steamID : steamID.getSteamID64();
        this.client
          .execAction(440, "send-chat", { steam_id: id, message })
          .then(() => {
            if (callback)
              callback(null as any, {
                modified_message: message,
                server_timestamp: new Date(),
                ordinal: 0,
              });
          })
          .catch((err: Error) => {
            if (callback) callback(err);
          });
      },
    };

    this.init();
  }

  private async init() {
    try {
      const status = await this.client.getStatus();
      if (status.connected) {
        this.steamID = new SteamID(status.steam_id);
        this._loggedOn = true;

        process.nextTick(() => {
          this.emit("loggedOn");
          this.emit("webSession", "dummy_session_id", ["dummy_cookie"]);
        });

        this.loadFriendsList().catch(() => {});

        const stream = this.client.streamEvents();
        stream.on("data", (data: any) => {
          let evType = data.event_type || "";
          const idx = evType.lastIndexOf(".");
          if (idx !== -1) evType = evType.substring(idx + 1);
          if (evType.startsWith("*")) evType = evType.substring(1);

          try {
            const safeJson = (data.payload_json || "").replace(
              /:\s*(\d{15,})/g,
              ':"$1"',
            );
            const payload = JSON.parse(safeJson);

            if (evType === "MessageEvent" || evType === "FriendMessageEvent") {
              const sid =
                payload.SenderID ||
                payload.sender_id ||
                payload.steam_id ||
                payload.steamid;
              const msg = payload.Message || payload.message;
              if (sid && msg) {
                const senderID = new SteamID(sid.toString());
                this.emit("friendMessage", senderID, msg);
              }
            } else if (
              evType === "FriendRelationshipEvent" ||
              evType === "FriendRelationship" ||
              evType === "RelationshipEvent"
            ) {
              const sid =
                payload.SteamID || payload.steam_id || payload.steamid;
              const rel =
                payload.Relationship !== undefined
                  ? payload.Relationship
                  : payload.relationship;
              if (sid && rel !== undefined) {
                const targetID = new SteamID(sid.toString());
                const target64 = targetID.getSteamID64();
                const relNum = Number(rel);
                if (relNum === EFriendRelationship.None) {
                  delete this.myFriends[target64];
                } else {
                  this.myFriends[target64] = relNum;
                }
                this.emit("friendRelationship", targetID, relNum);
              }
            } else if (
              evType === "UserEvent" ||
              evType === "PersonaStateEvent"
            ) {
              const sid =
                payload.SteamID || payload.steam_id || payload.steamid;
              if (sid) {
                const targetID = new SteamID(sid.toString());
                const target64 = targetID.getSteamID64();
                const userObj = this.buildUserObj(payload);
                this.users[target64] = userObj;
                this.emit("user", targetID, userObj);
              }
            }
          } catch (e) {
            // ignore
          }
        });

        stream.on("error", (err: any) => {
          this.emit("error", err);
        });
      }
    } catch (err) {
      this.emit("error", err);
    }
  }

  private buildUserObj(player: any): any {
    const avatarUrl =
      player.avatar ||
      "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb";
    return {
      rich_presence: player.rich_presence || [],
      player_name: player.personaname || player.player_name || "Unknown",
      avatar_hash: player.avatarhash
        ? Buffer.isBuffer(player.avatarhash)
          ? player.avatarhash
          : Buffer.from(player.avatarhash, "hex")
        : Buffer.alloc(0),
      last_logoff: player.lastlogoff
        ? new Date(player.lastlogoff * 1000)
        : new Date(0),
      last_logon: player.lastlogon
        ? new Date(player.lastlogon * 1000)
        : new Date(0),
      last_seen_online: new Date(),
      avatar_url_icon: avatarUrl,
      avatar_url_medium: player.avatarmedium || avatarUrl,
      avatar_url_full: player.avatarfull || avatarUrl,
    };
  }

  private async loadFriendsList() {
    try {
      const resp = await this.client.execRequest({
        type: 2, // REQUEST_TYPE_UNIFIED
        interface: "User",
        action: "GetFriendList",
        method: "POST",
        body: Buffer.from(JSON.stringify({ relationship: "friend" })),
      });
      if (resp.success && resp.body) {
        const data = JSON.parse(resp.body.toString());
        const friends: any[] = data.friends || data.friendslist?.friends || [];
        const friendIDs: string[] = [];
        for (const f of friends) {
          const sid = f.steamid || f.steam_id;
          if (sid) {
            const rel =
              f.relationship === "friend" || f.efriendrelationship === 3
                ? EFriendRelationship.Friend
                : Number(f.relationship) || EFriendRelationship.Friend;
            this.myFriends[sid] = rel;
            friendIDs.push(sid);
          }
        }
        if (friendIDs.length > 0) {
          await this.loadPlayerSummaries(friendIDs.slice(0, 100));
        }
      }
    } catch {
      // Ignore initial load failure
    }
  }

  private async loadPlayerSummaries(steamIDs: string[]) {
    try {
      const resp = await this.client.execRequest({
        type: 3, // REQUEST_TYPE_WEBAPI
        interface: "ISteamUser",
        action: "GetPlayerSummaries",
        version: 2,
        method: "GET",
        params: { steamids: steamIDs.join(",") },
      });
      if (resp.success && resp.body) {
        const data = JSON.parse(resp.body.toString());
        const players: any[] = data?.response?.players || [];
        for (const player of players) {
          if (player.steamid) {
            this.users[player.steamid] = this.buildUserObj(player);
          }
        }
      }
    } catch {
      // Ignore summary load failure
    }
  }

  logOn(_details: {
    accountName?: string;
    password?: string;
    loginKey?: string;
    twoFactorCode?: string;
    rememberPassword?: boolean;
    refreshToken?: string;
  }): void {
    this.init();
  }

  logOff(): void {
    this._loggedOn = false;
    this.emit("loggedOff");
  }

  webLogOn(): void {
    this.emit("webSession", "dummy_session_id", ["dummy_cookie"]);
  }

  setPersona(_state: number, _name?: string): void {
    // Daemon handles persona state
  }

  gamesPlayed(apps: number | number[]): void {
    const appid = Array.isArray(apps) ? apps[0] : apps;
    if (appid === 440) {
      this.client.playGame(440).catch((err: Error) => this.emit("error", err));
    } else if (!appid || (Array.isArray(apps) && apps.length === 0)) {
      this.client.exitGame().catch((err: Error) => this.emit("error", err));
    }
  }

  chatMessage(recipient: SteamID | string, message: string): void {
    const id =
      typeof recipient === "string" ? recipient : recipient.getSteamID64();
    this.client
      .execAction(440, "send-chat", { steam_id: id, message })
      .catch((err: Error) => this.emit("error", err));
  }

  addFriend(
    steamID: SteamID | string,
    callback?: (err?: Error, personaName?: string) => void,
  ): void {
    const steamIDInstance =
      typeof steamID === "string" ? new SteamID(steamID) : steamID;
    const steamID64 = steamIDInstance.getSteamID64();

    this.myFriends[steamID64] = EFriendRelationship.Friend;
    if (!this.users[steamID64]) {
      this.users[steamID64] = this.buildUserObj({ personaname: steamID64 });
    }

    this.client
      .execRequest({
        type: 2, // REQUEST_TYPE_UNIFIED
        interface: "User",
        action: "AddFriend",
        method: "POST",
        body: Buffer.from(JSON.stringify({ steamid: steamID64 })),
      })
      .catch(() => {
        return this.client.execAction(440, "add-friend", { steam_id: steamID64 });
      })
      .catch(() => {})
      .finally(() => {
        this.emit("friendRelationship", steamIDInstance, EFriendRelationship.Friend);
        const name = this.users[steamID64]?.player_name || steamID64;
        if (callback) callback(undefined, name);
      });
  }

  removeFriend(
    steamID: SteamID | string,
    callback?: (err?: Error) => void,
  ): void {
    const steamIDInstance =
      typeof steamID === "string" ? new SteamID(steamID) : steamID;
    const steamID64 = steamIDInstance.getSteamID64();

    delete this.myFriends[steamID64];

    this.client
      .execRequest({
        type: 2, // REQUEST_TYPE_UNIFIED
        interface: "User",
        action: "RemoveFriend",
        method: "POST",
        body: Buffer.from(JSON.stringify({ steamid: steamID64 })),
      })
      .catch(() => {
        return this.client.execAction(440, "remove-friend", { steam_id: steamID64 });
      })
      .catch(() => {})
      .finally(() => {
        this.emit("friendRelationship", steamIDInstance, EFriendRelationship.None);
        if (callback) callback();
      });
  }

  blockUser(
    steamID: SteamID | string,
    callback?: (err?: Error) => void,
  ): void {
    const steamIDInstance =
      typeof steamID === "string" ? new SteamID(steamID) : steamID;
    const steamID64 = steamIDInstance.getSteamID64();

    this.myFriends[steamID64] = EFriendRelationship.Blocked;

    this.client
      .execRequest({
        type: 2, // REQUEST_TYPE_UNIFIED
        interface: "User",
        action: "IgnoreFriend",
        method: "POST",
        body: Buffer.from(JSON.stringify({ steamid: steamID64 })),
      })
      .catch(() => {})
      .finally(() => {
        this.emit("friendRelationship", steamIDInstance, EFriendRelationship.Blocked);
        if (callback) callback();
      });
  }

  unblockUser(
    steamID: SteamID | string,
    callback?: (err?: Error) => void,
  ): void {
    const steamIDInstance =
      typeof steamID === "string" ? new SteamID(steamID) : steamID;
    const steamID64 = steamIDInstance.getSteamID64();

    delete this.myFriends[steamID64];

    this.client
      .execRequest({
        type: 2, // REQUEST_TYPE_UNIFIED
        interface: "User",
        action: "RemoveFriend",
        method: "POST",
        body: Buffer.from(JSON.stringify({ steamid: steamID64 })),
      })
      .catch(() => {})
      .finally(() => {
        this.emit("friendRelationship", steamIDInstance, EFriendRelationship.None);
        if (callback) callback();
      });
  }

  setFriendNickname(
    steamID: SteamID | string,
    nickname: string,
    callback?: (err?: Error, response?: any) => void,
  ): void {
    const steamID64 =
      typeof steamID === "string" ? steamID : steamID.getSteamID64();

    this.client
      .setFriendNickname(steamID64, nickname)
      .then((resp) => {
        if (callback) callback(undefined, resp);
      })
      .catch((err: Error) => {
        if (callback) callback(err);
      });
  }

  respondToGroupInvite(
    _groupSteamID: SteamID | string,
    _accept: boolean,
  ): void {
    // No-op
  }
}

