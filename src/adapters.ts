import { EventEmitter } from "events";
import { GManClient } from "./client";
import { StreamEventsResponse } from "./types";

export class SteamUserAdapter extends EventEmitter {
  public steamID: any = null;
  private client: GManClient;

  constructor(client: GManClient) {
    super();
    this.client = client;
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
    // No-op (handled inside high-level chat systems or logging)
    console.log(
      `[SteamUserAdapter] Mock chatMessage to ${steamID}: ${message}`,
    );
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
