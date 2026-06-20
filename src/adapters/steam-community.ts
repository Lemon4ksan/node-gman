import { EventEmitter } from "events";
import { GManClient } from "../client";

export interface SteamCommunityOptions {
  steamID?: string;
}

export class SteamCommunityAdapter extends EventEmitter {
  private client: GManClient;
  private _steamID: string | null = null;
  private _cookies: string[] = [];
  private _sessionID: string = "";

  constructor(client: GManClient, options: SteamCommunityOptions = {}) {
    super();
    this.client = client;
    this._steamID = options.steamID || null;

    // Generate realistic default sessionID and cookies
    this._sessionID =
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10);
    this._cookies = [
      `sessionid=${this._sessionID}`,
      `steamLoginSecure=${this._steamID || "76561198000000000"}%7C%7C${Math.random().toString(16).substring(2, 10)}`,
    ];
  }

  get steamID(): string | null {
    return this._steamID;
  }

  set steamID(id: string | null) {
    this._steamID = id;
    if (id) {
      this._cookies = this._cookies.map((c) =>
        c.startsWith("steamLoginSecure=")
          ? `steamLoginSecure=${id}%7C%7C${Math.random().toString(16).substring(2, 10)}`
          : c,
      );
    }
  }

  async getProfile(steamId: string): Promise<Record<string, unknown>> {
    // Profile data comes from Steam Web API
    return {};
  }

  async getInventory(
    steamId: string,
    appId: number = 440,
    contextId: string = "2",
  ): Promise<unknown[]> {
    const result = await this.client.execAction(440, "get-partner-inventory", {
      partner_id: steamId,
    });

    try {
      return JSON.parse(result.details) as unknown[];
    } catch {
      return [];
    }
  }

  async checkEscrow(tradeOfferId: string): Promise<boolean> {
    const result = await this.client.execAction(440, "check-escrow", {
      offer: JSON.stringify({ tradeofferid: tradeOfferId }),
    });
    return result.details === "true";
  }

  async getTradeOfferUrl(): Promise<string> {
    return "";
  }

  async getWebSession(
    callback: (err: Error | null, session?: unknown) => void,
  ): Promise<void> {
    callback(null, { sessionID: this._sessionID, cookies: this._cookies });
  }

  getWebSessionSync(): unknown {
    return { sessionID: this._sessionID, cookies: this._cookies };
  }

  startSession(sessionData: unknown): void {
    // No-op, handled by g-mand
  }

  setCookie(cookie: string): void {
    const cookieStr =
      typeof cookie === "string" ? cookie : (cookie as any).toString();
    if (cookieStr.includes("sessionid=")) {
      const match = cookieStr.match(/sessionid=([^;]+)/);
      if (match) {
        this._sessionID = match[1];
      }
    }
    const name = cookieStr.split("=")[0];
    this._cookies = this._cookies.filter((c) => !c.startsWith(`${name}=`));
    this._cookies.push(cookieStr);
  }

  setCookies(cookies: string[]): void {
    this._cookies = cookies;
    for (const cookie of cookies) {
      if (cookie.includes("sessionid=")) {
        const match = cookie.match(/sessionid=([^;]+)/);
        if (match) {
          this._sessionID = match[1];
        }
      }
    }
  }

  emitProfileanity(steamId: string): void {
    // No-op
  }

  async getNotifications(): Promise<unknown[]> {
    return [];
  }

  async clearNotification(notification: unknown): Promise<void> {
    // No-op
  }

  async clearAllNotifications(): Promise<void> {
    // No-op
  }

  async postComment(
    steamId: string,
    message: string,
    callback?: (err: Error | null) => void,
  ): Promise<void> {
    if (callback) callback(null);
  }

  async deleteComment(
    steamId: string,
    commentId: string,
    callback?: (err: Error | null) => void,
  ): Promise<void> {
    if (callback) callback(null);
  }

  async getComments(
    steamId: string,
    start: number = 0,
    count: number = 10,
  ): Promise<unknown[]> {
    return [];
  }

  async setupProfile(profileData: Record<string, unknown>): Promise<void> {
    // No-op
  }

  async getGameBadge(
    steamId: string,
  ): Promise<{ level: number; badges: unknown[] }> {
    return { level: 0, badges: [] };
  }

  async getPlayerBans(steamId: string): Promise<Record<string, unknown>> {
    return {};
  }

  async resolveVanityUrl(vanityUrl: string): Promise<string | null> {
    const result = await this.client.execAction(440, "resolve-vanity-url", {
      url: vanityUrl,
    });
    return result.details || null;
  }
}
