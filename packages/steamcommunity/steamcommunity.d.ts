import { EventEmitter } from "events";
import SteamID from "steamid";
import { GManClient } from "node-gman";
export default class SteamCommunity extends EventEmitter {
    steamID: SteamID | null;
    _jar: any;
    private client;
    constructor(client: GManClient, options?: any);
    loggedIn(callback: (err: any, loggedIn?: boolean, familyView?: boolean) => void): void;
    getSessionID(): string;
    getWebApiKey(callback: (err?: Error, key?: string) => void): void;
    createWebApiKey(_options: {
        domain: string;
        identitySecret?: string;
        requestID?: string;
    }, callback: (err?: Error, result?: {
        confirmationRequired: boolean;
        apiKey: string;
        finalizeOptions: Record<string, any>;
    }) => void): void;
    setCookies(_cookies: string[]): void;
    editProfile(_settings: {
        name?: string;
        realName?: string;
        summary?: string;
        country?: string;
        state?: string;
        city?: string;
        customURL?: string;
        featuredBadge?: number;
        primaryGroup?: SteamID | string;
    }, callback?: (err?: Error) => void): void;
    profileSettings(_settings: {
        profile?: number;
        comments?: number;
        inventory?: number;
        inventoryGifts?: boolean;
        gameDetails?: number;
        playTime?: boolean;
        friendsList?: number;
    }, callback?: (err?: Error) => void): void;
    uploadAvatar(_image: Buffer | string, callback?: (err?: Error, url?: string) => void): void;
    resetItemNotifications(callback?: (err?: Error) => void): void;
    inviteUserToGroup(_userID: SteamID | string, _groupID: SteamID | string, callback?: (err?: Error) => void): void;
    getSteamGroup(_id: SteamID | string, callback: (err?: Error, group?: any) => void): void;
    getTradeURL(callback: (err?: Error, url?: string, token?: string) => void): void;
    getSteamUser(_id: SteamID | string, callback: (err?: Error, user?: any) => void): void;
    acceptConfirmationForObject(_identitySecret: string, _objectID: string, callback: (err?: Error) => void): void;
    getFriendsList(callback: (err?: Error, friendlist?: Record<string, number>) => void): void;
}
export declare namespace SteamCommunity {
    interface Group {
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
    interface User {
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
    interface FriendList {
        [steamID64: string]: number;
    }
}
