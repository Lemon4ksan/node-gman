import { EventEmitter } from "events";
import { GManClient } from "./client";
import { StreamEventsResponse } from "./types";

function toSteamIDObj(id: any): any {
  if (typeof id === "object" && id !== null && typeof id.getSteamID64 === "function") {
    return id;
  }
  const str = String(id);
  return {
    getSteamID64: () => str,
    toString: () => str,
  };
}

export class SteamUserAdapter extends EventEmitter {
  public steamID: any = null;
  public myFriends: Record<string, number> = {};
  public users: Record<string, any> = {};
  public chat: {
    sendFriendMessage: (
      steamID: any,
      message: string,
      options?: any,
      callback?: (err: Error | null, response?: any) => void,
    ) => void;
  };
  private client: GManClient;

  constructor(client: GManClient) {
    super();
    this.client = client;

    this.chat = {
      sendFriendMessage: (
        steamID: any,
        message: string,
        _options?: any,
        callback?: (err: Error | null, response?: any) => void,
      ) => {
        const id =
          typeof steamID === "string" ? steamID : steamID.getSteamID64();
        this.client
          .execAction(440, "send-chat", { steam_id: id, message })
          .then(() => {
            if (callback)
              callback(null, {
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
        this.steamID = {
          getSteamID64: () => status.steam_id,
          toString: () => status.steam_id,
        };
        const sessionID =
          Math.random().toString(16).substring(2, 10) +
          Math.random().toString(16).substring(2, 10) +
          Math.random().toString(16).substring(2, 10) +
          Math.random().toString(16).substring(2, 10);
        const cookies = [
          `sessionid=${sessionID}`,
          `steamLoginSecure=${status.steam_id || "76561198000000000"}%7C%7C${Math.random().toString(16).substring(2, 10)}`,
        ];
        process.nextTick(() => {
          this.emit("loggedOn", this.steamID);
          this.emit("webSession", sessionID, cookies);
        });

        const stream = this.client.streamEvents();
        stream.on("data", (data: StreamEventsResponse) => {
          let evType = data.event_type;
          const idx = evType.lastIndexOf(".");
          if (idx !== -1) {
            evType = evType.substring(idx + 1);
          }
          if (evType.startsWith("*")) {
            evType = evType.substring(1);
          }

          try {
            const safeJson = data.payload_json.replace(
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
                const senderID = toSteamIDObj(sid);
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
                const targetID = toSteamIDObj(sid);
                const target64 = targetID.getSteamID64();
                const relNum = Number(rel);
                if (relNum === 0) {
                  delete this.myFriends[target64];
                } else {
                  this.myFriends[target64] = relNum;
                }
                this.emit("friendRelationship", targetID, relNum);
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

  logOn(details: any) {
    // Daemon handles connection state, trigger event resolution
    this.init();
  }

  logOff() {
    // No-op
  }

  gamesPlayed(apps: any) {
    const appid = Array.isArray(apps) ? apps[0] : apps;
    if (appid === 440) {
      this.client.playGame(440).catch((err) => this.emit("error", err));
    } else if (!appid || (Array.isArray(apps) && apps.length === 0)) {
      this.client.exitGame().catch((err) => this.emit("error", err));
    }
  }

  setPersona(state: number) {
    // No-op
  }

  chatMessage(steamID: string, message: string) {
    this.client
      .execAction(440, "send-chat", { steam_id: steamID, message })
      .catch((err) => this.emit("error", err));
  }

  addFriend(steamID: any, callback?: (err?: Error, personaName?: string) => void) {
    const steamIDInstance = toSteamIDObj(steamID);
    const steamID64 = steamIDInstance.getSteamID64();

    this.myFriends[steamID64] = 3; // Friend
    this.client
      .execRequest({
        type: 2,
        interface: "User",
        action: "AddFriend",
        method: "POST",
        body: Buffer.from(JSON.stringify({ steamid: steamID64 })),
      })
      .catch(() => {})
      .finally(() => {
        this.emit("friendRelationship", steamIDInstance, 3);
        if (callback) callback(undefined, steamID64);
      });
  }

  removeFriend(steamID: any, callback?: (err?: Error) => void) {
    const steamIDInstance = toSteamIDObj(steamID);
    const steamID64 = steamIDInstance.getSteamID64();

    delete this.myFriends[steamID64];
    this.client
      .execRequest({
        type: 2,
        interface: "User",
        action: "RemoveFriend",
        method: "POST",
        body: Buffer.from(JSON.stringify({ steamid: steamID64 })),
      })
      .catch(() => {})
      .finally(() => {
        this.emit("friendRelationship", steamIDInstance, 0);
        if (callback) callback();
      });
  }

  blockUser(steamID: any, callback?: (err?: Error) => void) {
    const steamIDInstance = toSteamIDObj(steamID);
    const steamID64 = steamIDInstance.getSteamID64();

    this.myFriends[steamID64] = 1; // Blocked
    this.emit("friendRelationship", steamIDInstance, 1);
    if (callback) callback();
  }

  unblockUser(steamID: any, callback?: (err?: Error) => void) {
    const steamIDInstance = toSteamIDObj(steamID);
    const steamID64 = steamIDInstance.getSteamID64();

    delete this.myFriends[steamID64];
    this.emit("friendRelationship", steamIDInstance, 0);
    if (callback) callback();
  }

  setFriendNickname(steamID: any, nickname: string, callback?: (err?: Error, resp?: any) => void) {
    const steamID64 =
      typeof steamID === "string" ? steamID : steamID.getSteamID64();
    this.client
      .setFriendNickname(steamID64, nickname)
      .then((resp) => {
        if (callback) callback(undefined, resp);
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  }

  webLogOn() {
    const sessionID =
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10);
    const steamIDStr = this.steamID
      ? this.steamID.toString()
      : "76561198000000000";
    const cookies = [
      `sessionid=${sessionID}`,
      `steamLoginSecure=${steamIDStr}%7C%7C${Math.random().toString(16).substring(2, 10)}`,
    ];
    this.emit("webSession", sessionID, cookies);
  }
}

export class TeamFortress2Adapter extends EventEmitter {
  public haveGCSession: boolean = false;
  private client: GManClient;

  constructor(client: GManClient) {
    super();
    this.client = client;
    this.init();
  }

  private init() {
    const stream = this.client.streamEvents();

    stream.on("data", (data: StreamEventsResponse) => {
      let evType = data.event_type;
      const idx = evType.lastIndexOf(".");
      if (idx !== -1) {
        evType = evType.substring(idx + 1);
      }
      if (evType.startsWith("*")) {
        evType = evType.substring(1);
      }

      try {
        const payload = JSON.parse(data.payload_json);

        switch (evType) {
          case "ConnectedEvent":
            this.haveGCSession = true;
            this.emit("connectedToGC");
            break;
          case "DisconnectedEvent":
            this.haveGCSession = false;
            this.emit("disconnectedFromGC");
            break;
          case "ItemAcquiredEvent":
            const item = payload.item || {};
            this.emit("itemAcquired", {
              id: item.asset_id || item.id,
              def_index: item.def_index,
              quality: item.quality,
              quantity: item.quantity || 1,
              is_tradable: item.is_tradable,
              is_craftable: item.is_craftable,
              attribute: Object.entries(item.attributes || {}).map(
                ([def, val]) => ({
                  def_index: Number(def),
                  value: val,
                }),
              ),
            });
            break;
          case "ItemRemovedEvent":
            this.emit("itemRemoved", { id: payload.asset_id });
            break;
          case "ItemUpdatedEvent":
            this.emit("itemChanged", {
              id: (payload.item && payload.item.asset_id) || payload.asset_id,
            });
            break;
        }
      } catch (err) {
        // Suppress parsing errors
      }
    });

    stream.on("error", (err: any) => {
      this.emit("error", err);
    });

    // Fetch initial GC connection state
    this.client
      .getStatus()
      .then((status) => {
        if (status.connected && status.current_appid === 440) {
          this.haveGCSession = true;
          this.emit("connectedToGC");
        }
      })
      .catch(() => {});
  }

  craft(assetids: string[], recipe: number = -1) {
    this.client
      .execAction(440, "craft", {
        recipe: recipe.toString(),
        items: JSON.stringify(assetids.map((id) => Number(id))),
      })
      .catch((err) => this.emit("error", err));
  }

  useItem(assetid: string) {
    this.client
      .execAction(440, "use-item", { item_id: assetid })
      .catch((err) => this.emit("error", err));
  }

  deleteItem(assetid: string) {
    this.client
      .execAction(440, "delete-item", { item_id: assetid })
      .catch((err) => this.emit("error", err));
  }

  removeItemAttribute(assetid: string, attribute: number) {
    console.warn(
      `[TeamFortress2Adapter] removeItemAttribute not fully supported on daemon: ${assetid}, attribute: ${attribute}`,
    );
  }

  sortBackpack(type: number) {
    this.client
      .execAction(440, "sort-backpack", {
        type: "gc",
        sort_type: type.toString(),
      })
      .catch((err) => this.emit("error", err));
  }
}
