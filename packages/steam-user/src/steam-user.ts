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
  public myFriends: Map<SteamID | string, EFriendRelationship> = new Map();
  public myGroups: Map<SteamID | string, EClanRelationship> = new Map();
  public users: Map<SteamID | string, any> = new Map();
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

  private client: GManClient;
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
      }
    } catch (err) {
      this.emit("error", err);
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
    // No-op, daemon handles persona state
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
    if (callback) callback();
  }

  removeFriend(_steamID: SteamID | string): void {
    // No-op
  }

  blockUser(steamID: SteamID | string, callback?: (err?: Error) => void): void {
    if (callback) callback();
  }

  unblockUser(
    _steamID: SteamID | string,
    callback?: (err?: Error) => void,
  ): void {
    if (callback) callback();
  }

  respondToGroupInvite(
    _groupSteamID: SteamID | string,
    _accept: boolean,
  ): void {
    // No-op
  }
}
