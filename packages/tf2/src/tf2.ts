import { EventEmitter } from "events";
import SteamID from "steamid";
import { GManClient } from "node-gman";

class TF2Class extends EventEmitter {
  public haveGCSession: boolean = false;
  public itemSchema: any = null;
  public backpack: any = null;
  public premium: boolean = false;
  public backpackSlots: number | undefined = undefined;
  public canSendProfessorSpeks: boolean = false;

  private client: GManClient;

  constructor(client: GManClient) {
    super();
    this.client = client;
    this.init();
  }

  private init() {
    const stream = this.client.streamEvents();

    stream.on("data", (data: any) => {
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
            this.emit("connectedToGC", "7898640");
            break;
          case "DisconnectedEvent":
            this.haveGCSession = false;
            this.emit("disconnectedToGC", "unknown");
            break;
          case "ItemAcquiredEvent":
            this.emit("itemAcquired", payload.item || {});
            break;
          case "ItemRemovedEvent":
            this.emit("itemRemoved", { id: payload.asset_id });
            break;
          case "ItemUpdatedEvent":
            this.emit("itemChanged", { id: payload.asset_id });
            break;
        }
      } catch (err) {
        // Suppress parsing errors
      }
    });

    stream.on("error", (err: any) => {
      this.emit("error", err);
    });

    this.client
      .getStatus()
      .then((status) => {
        if (status.connected && status.current_appid === 440) {
          this.haveGCSession = true;
          this.emit("connectedToGC", "7898640");
        }
      })
      .catch(() => {});
  }

  setLang(_localizationFile: string): void {}

  craft(items: string[], recipe?: number): void {
    this.client
      .execAction(440, "craft", {
        recipe: (recipe ?? -1).toString(),
        items: JSON.stringify(items.map(Number)),
      })
      .catch((err) => this.emit("error", err));
  }

  trade(_steamID: SteamID): void {}

  cancelTradeRequest(): void {}

  respondToTrade(_tradeID: string, _accept: boolean): void {}

  setStyle(_item: string, _style: number): void {}

  setPosition(_item: string, _position: number): void {}

  deleteItem(item: string): void {
    this.client
      .execAction(440, "delete-item", { item_id: item })
      .catch((err) => this.emit("error", err));
  }

  wrapItem(_wrapID: string, _itemID: string): void {}

  deliverGift(_gift: string, _steamID: SteamID): void {}

  unwrapGift(_gift: string): void {}

  useItem(item: string): void {
    this.client
      .execAction(440, "use-item", { item_id: item })
      .catch((err) => this.emit("error", err));
  }

  tradeUP(_items: string[]): void {}

  removeItemAttribute(_item: string, _attribute: any): void {}

  applyStrangePart(_item: string, _strangPartItemID: string): void {}

  applyStrangifierOrUnusualifier(
    _item: string,
    _strangifierOrUnusualifierID: string,
  ): void {}

  sortBackpack(sortType: number): void {
    this.client
      .execAction(440, "sort-backpack", {
        type: "gc",
        sort_type: sortType.toString(),
      })
      .catch((err) => this.emit("error", err));
  }

  sendProfessorSpeks(_steamID: SteamID): void {}

  createServerIdentity(): void {}

  getRegisteredServers(): void {}

  resetServerIdentity(_id: string): void {}

  openCrate(_keyID: string, _crateID: string): void {}

  requestWarStats(
    _warID?: number,
    callback?: (err: Error, data: any) => void,
  ): void {
    if (callback) callback(new Error("Not supported"), {});
  }
}

export default TF2Class;

export namespace TF2 {
  export enum GCGoodbyeReason {
    GC_GOING_DOWN = 1,
    NO_SESSION = 2,
  }

  export enum TradeResponse {
    Accepted = 0,
    Declined = 1,
    Cancel = 7,
  }

  export enum Class {
    Scout = 1,
    Sniper = 2,
    Soldier = 3,
    Demoman = 4,
    Medic = 5,
    Heavy = 6,
    Pyro = 7,
    Spy = 8,
    Engineer = 9,
  }

  export enum Attributes {
    Paint = 1031,
    CustomTexture = 1051,
    MakersMark = 1053,
    Killstreak = 1094,
    GiftedBy = 2570,
    Festivizer = 2572,
  }
}
