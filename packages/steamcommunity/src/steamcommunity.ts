import { EventEmitter } from 'events';
import SteamID from 'steamid';
import { GManClient } from 'node-gman';

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

  loggedIn(callback: (err: any, loggedIn?: boolean, familyView?: boolean) => void): void {
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
    return 'dummy_session_id';
  }

  getWebApiKey(callback: (err?: Error, key?: string) => void): void {
    callback(new Error('Not supported via g-mand'));
  }

  createWebApiKey(
    _options: { domain: string; identitySecret?: string; requestID?: string },
    callback: (
      err?: Error,
      result?: { confirmationRequired: boolean; apiKey: string; finalizeOptions: Record<string, any> }
    ) => void
  ): void {
    callback(new Error('Not supported via g-mand'));
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
    callback?: (err?: Error) => void
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
    callback?: (err?: Error) => void
  ): void {
    if (callback) callback();
  }

  uploadAvatar(_image: Buffer | string, callback?: (err?: Error, url?: string) => void): void {
    if (callback) callback();
  }

  resetItemNotifications(callback?: (err?: Error) => void): void {
    if (callback) callback();
  }

  inviteUserToGroup(_userID: SteamID | string, _groupID: SteamID | string, callback?: (err?: Error) => void): void {
    if (callback) callback();
  }

  getSteamGroup(_id: SteamID | string, callback: (err?: Error, group?: any) => void): void {
    callback(undefined, {
      steamID: new SteamID('76561198000000000'),
      name: 'Dummy Group',
      url: '',
      headline: '',
      summary: '',
      avatarHash: Buffer.alloc(0),
      members: 0,
      membersInChat: 0,
      membersInGame: 0,
      membersOnline: 0,
      join: (_callback?: (err?: Error) => void) => {},
    });
  }

  getTradeURL(callback: (err?: Error, url?: string, token?: string) => void): void {
    callback(undefined, '', '');
  }

  getSteamUser(_id: SteamID | string, callback: (err?: Error, user?: any) => void): void {
    callback(undefined, {
      steamID: new SteamID('76561198000000000'),
      name: 'Unknown',
      onlineState: 'online',
      stateMessage: '',
      privacyState: 'public',
      visibilityState: '3',
      avatarHash: '',
      vacBanned: '0',
      tradeBanState: 'none',
      isLimitedAccount: '0',
      customURL: '',
      groups: null,
      primaryGroup: null,
      getAvatarURL: (_size: string) => '',
    });
  }

  acceptConfirmationForObject(_identitySecret: string, _objectID: string, callback: (err?: Error) => void): void {
    callback();
  }

  getFriendsList(callback: (err?: Error, friendlist?: Record<string, number>) => void): void {
    callback(undefined, {});
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
