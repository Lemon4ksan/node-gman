import { EventEmitter } from 'events';
import SteamID from 'steamid';
import { GManClient, TradeOffer as GManTradeOffer } from 'node-gman';

export interface PollData {
  sent: Record<string, number>;
  received: Record<string, number>;
  timestamps: Record<string, number>;
  offersSince: number;
  offerData: Record<string, OfferData>;
}

export interface OfferData {
  partner?: string;
  handleTimestamp?: number;
  notify?: boolean;
  dict?: ItemsDict;
  keyOurSide?: boolean;
  value?: ItemsValue;
  prices?: Prices;
  handledByUs?: boolean;
  processOfferTime?: number;
  action?: Action;
  meta?: any;
  highValue?: any;
  [key: string]: any;
}

export interface ItemsDict {
  our: OurTheirItemsDict;
  their: OurTheirItemsDict;
}

export interface OurTheirItemsDict {
  [sku: string]: number;
}

export interface ItemsValue {
  our?: Values;
  their?: Values;
  rate?: number;
  rates?: { buy?: number; sell?: number };
}

export interface Values {
  total?: number;
  keys: number;
  metal: number;
}

export interface Prices {
  [priceKey: string]: { buy?: any; sell?: any };
}

export interface Action {
  action: 'accept' | 'decline' | 'skip' | 'counter';
  reason: string;
}

export interface EconItem {
  appid: number;
  contextid: string;
  assetid: string;
  classid: string;
  instanceid: string;
  amount: number;
  pos: number;
  id: string;
  background_color: string;
  icon_url: string;
  icon_url_large: string;
  tradable: boolean;
  actions: any[];
  name: string;
  name_color: string;
  type: string;
  market_name: string;
  market_hash_name: string;
  commodity: boolean;
  market_tradable_restriction: number;
  market_marketable_restriction: number;
  marketable: boolean;
  tags: any[];
  is_currency: boolean;
  fraudwarnings: any[];
  descriptions: any[];
  app_data?: any;
  getAction(action: string): string | null;
  getItemTag(category: string): string | null;
  getSKU(schema: any, ...args: any[]): { sku: string; isPainted: boolean } | null;
}

export class TradeOffer {
  public partner: SteamID;
  public id: string | null;
  public message: string | null;
  public state: number;
  public itemsToGive: EconItem[] = [];
  public itemsToReceive: EconItem[] = [];
  public isOurOffer: boolean;
  public created: Date;
  public updated: Date;
  public expires: Date;
  public confirmationMethod: number;
  public _tempData: Record<string, any> = {};
  public manager: SteamTradeOfferManager;

  private _data: Record<string, any> = {};

  constructor(manager: SteamTradeOfferManager, partner: SteamID | string, isOurOffer: boolean = false) {
    this.manager = manager;
    this.partner = typeof partner === 'string' ? new SteamID(partner) : partner;
    this.id = null;
    this.message = null;
    this.state = 0;
    this.isOurOffer = isOurOffer;
    this.created = new Date();
    this.updated = new Date();
    this.expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    this.confirmationMethod = 0;
  }

  static fromGManOffer(manager: SteamTradeOfferManager, offer: GManTradeOffer): TradeOffer {
    const tradeOffer = new TradeOffer(manager, offer.partner, false);
    tradeOffer.id = offer.tradeofferid;
    tradeOffer.message = offer.message || null;
    tradeOffer.state = offer.trade_offer_state;
    tradeOffer.isOurOffer = false;

    if (offer.items_to_give) {
      tradeOffer.itemsToGive = offer.items_to_give.map((item) => ({
        appid: item.appid || 440,
        contextid: item.contextid || '2',
        assetid: item.assetid,
        classid: '',
        instanceid: '',
        amount: item.amount || 1,
        pos: 0,
        id: item.assetid,
        background_color: '',
        icon_url: '',
        icon_url_large: '',
        tradable: true,
        actions: [],
        name: '',
        name_color: '',
        type: '',
        market_name: '',
        market_hash_name: '',
        commodity: false,
        market_tradable_restriction: 0,
        market_marketable_restriction: 0,
        marketable: false,
        tags: [],
        is_currency: false,
        fraudwarnings: [],
        descriptions: [],
        getAction: () => null,
        getItemTag: () => null,
        getSKU: () => null,
      }));
    }

    if (offer.items_to_receive) {
      tradeOffer.itemsToReceive = offer.items_to_receive.map((item) => ({
        appid: item.appid || 440,
        contextid: item.contextid || '2',
        assetid: item.assetid,
        classid: '',
        instanceid: '',
        amount: item.amount || 1,
        pos: 0,
        id: item.assetid,
        background_color: '',
        icon_url: '',
        icon_url_large: '',
        tradable: true,
        actions: [],
        name: '',
        name_color: '',
        type: '',
        market_name: '',
        market_hash_name: '',
        commodity: false,
        market_tradable_restriction: 0,
        market_marketable_restriction: 0,
        marketable: false,
        tags: [],
        is_currency: false,
        fraudwarnings: [],
        descriptions: [],
        getAction: () => null,
        getItemTag: () => null,
        getSKU: () => null,
      }));
    }

    if (offer.data) {
      tradeOffer._data = { ...offer.data };
    }

    return tradeOffer;
  }

  isGlitched(): boolean {
    return false;
  }

  data(): Record<string, any>;
  data(key: string): any;
  data(key: string, value: any): void;
  data(key?: string, value?: any): any {
    if (key === undefined) {
      return this._data;
    }
    if (value === undefined) {
      return this._data[key];
    }
    this._data[key] = value;
  }

  addMyItem(item: { assetid: string; appid?: number; contextid?: string; amount?: number }): boolean {
    this.itemsToGive.push({
      appid: item.appid || 440,
      contextid: item.contextid || '2',
      assetid: item.assetid,
      classid: '',
      instanceid: '',
      amount: item.amount || 1,
      pos: 0,
      id: item.assetid,
      background_color: '',
      icon_url: '',
      icon_url_large: '',
      tradable: true,
      actions: [],
      name: '',
      name_color: '',
      type: '',
      market_name: '',
      market_hash_name: '',
      commodity: false,
      market_tradable_restriction: 0,
      market_marketable_restriction: 0,
      marketable: false,
      tags: [],
      is_currency: false,
      fraudwarnings: [],
      descriptions: [],
      getAction: () => null,
      getItemTag: () => null,
      getSKU: () => null,
    });
    return true;
  }

  addMyItems(items: { assetid: string; appid?: number; contextid?: string; amount?: number }[]): number {
    let added = 0;
    for (const item of items) {
      if (this.addMyItem(item)) added++;
    }
    return added;
  }

  addTheirItem(item: { assetid: string; appid?: number; contextid?: string; amount?: number }): boolean {
    this.itemsToReceive.push({
      appid: item.appid || 440,
      contextid: item.contextid || '2',
      assetid: item.assetid,
      classid: '',
      instanceid: '',
      amount: item.amount || 1,
      pos: 0,
      id: item.assetid,
      background_color: '',
      icon_url: '',
      icon_url_large: '',
      tradable: true,
      actions: [],
      name: '',
      name_color: '',
      type: '',
      market_name: '',
      market_hash_name: '',
      commodity: false,
      market_tradable_restriction: 0,
      market_marketable_restriction: 0,
      marketable: false,
      tags: [],
      is_currency: false,
      fraudwarnings: [],
      descriptions: [],
      getAction: () => null,
      getItemTag: () => null,
      getSKU: () => null,
    });
    return true;
  }

  addTheirItems(items: { assetid: string; appid?: number; contextid?: string; amount?: number }[]): number {
    let added = 0;
    for (const item of items) {
      if (this.addTheirItem(item)) added++;
    }
    return added;
  }

  removeMyItem(_item: any): boolean {
    return true;
  }

  removeMyItems(_items: any[]): number {
    return _items.length;
  }

  removeTheirItem(_item: any): boolean {
    return true;
  }

  removeTheirItems(_items: any[]): number {
    return _items.length;
  }

  setToken(_token: string): void {}

  setMessage(message: string): void {
    this.message = message;
  }

  getUserDetails(callback: (err: Error | null, me?: any, them?: any) => void): void {
    callback(null, { personaName: 'Bot', contexts: {}, escrowDays: 0, avatarIcon: '', avatarMedium: '', avatarFull: '' }, { personaName: 'Partner', contexts: {}, escrowDays: 0, avatarIcon: '', avatarMedium: '', avatarFull: '' });
  }

  accept(callback?: (err: Error | null, status?: string) => void): void;
  accept(skipStateUpdate: boolean, callback?: (err: Error | null, status?: string) => void): void;
  accept(skipStateUpdateOrCallback?: boolean | ((err: Error | null, status?: string) => void), callback?: (err: Error | null, status?: string) => void): void {
    const cb = typeof skipStateUpdateOrCallback === 'function' ? skipStateUpdateOrCallback : callback;
    if (this.id) {
      this.manager.client
        .execAction(440, 'accept-offer', { offer_id: this.id })
        .then(() => {
          this.state = 3; // Accepted
          if (cb) cb(null, 'accepted');
        })
        .catch((err) => {
          if (cb) cb(err);
        });
    } else {
      if (cb) cb(new Error('Offer has no ID'));
    }
  }

  send(callback?: (err: Error | null, state?: string) => void): void {
    const params = {
      partner_id: this.partner.getSteamID64(),
      items_to_give: this.itemsToGive.map((item) => ({ assetid: item.assetid, appid: item.appid, contextid: item.contextid, amount: item.amount })),
      items_to_receive: this.itemsToReceive.map((item) => ({ assetid: item.assetid, appid: item.appid, contextid: item.contextid, amount: item.amount })),
      message: this.message || '',
    };

    this.manager.client
      .execAction(440, 'send-offer', { offer_params: JSON.stringify(params) })
      .then((result) => {
        const response = JSON.parse(result.details);
        this.id = response.tradeofferid;
        this.state = 9; // CreatedNeedsConfirmation
        if (callback) callback(null, 'sent');
      })
      .catch((err) => {
        if (callback) callback(err);
      });
  }

  decline(callback?: (err: Error | null) => void): void {
    if (this.id) {
      this.manager.client
        .execAction(440, 'decline-offer', { offer_id: this.id })
        .then(() => {
          this.state = 7; // Declined
          if (callback) callback(null);
        })
        .catch((err) => {
          if (callback) callback(err);
        });
    } else {
      if (callback) callback(new Error('Offer has no ID'));
    }
  }

  counter(): TradeOffer {
    return new TradeOffer(this.manager, this.partner, true);
  }

  cancel(callback?: (err: Error | null) => void): void {
    this.decline(callback);
  }

  getExchangeDetails(
    _getDetailsIfFailed: boolean,
    callback: (err?: Error | null, status?: number, tradeInitTime?: Date, receivedItems?: any[], sentItems?: any[]) => void
  ): void {
    callback(null, 0, new Date(), [], []);
  }

  log(level: string, message: string, ...meta: any[]): void {
    console.log(`[${level}] ${message}`, ...meta);
  }

  getDiff(): Record<string, any> | null {
    const diff: Record<string, any> = {};

    for (const item of this.itemsToReceive) {
      diff[item.assetid] = (diff[item.assetid] || 0) + 1;
    }

    for (const item of this.itemsToGive) {
      diff[item.assetid] = (diff[item.assetid] || 0) - 1;
    }

    return diff;
  }
}

export class SteamTradeOfferManager extends EventEmitter {
  public client: GManClient;
  public steamID: SteamID | null = null;
  public pollData: PollData = { sent: {}, received: {}, timestamps: {}, offersSince: 0, offerData: {} };
  public apiKey: string | null = null;
  public accessToken: string | null = null;
  public pollInterval: number = 30000;

  private _pollTimer: NodeJS.Timeout | null = null;
  private _offersCache: Map<string, TradeOffer> = new Map();

  static EOfferFilter = new Map([
    ['ActiveOnly', 1],
    ['HistoricalOnly', 2],
    ['All', 3],
  ]);

  static EResult = new Map([
    ['OK', 1],
    ['Fail', 2],
  ]);

  static ETradeOfferState = new Map([
    ['Invalid', 1],
    ['Active', 2],
    ['Accepted', 3],
    ['Countered', 4],
    ['Expired', 5],
    ['Cancelled', 6],
    ['Declined', 7],
    ['InvalidItems', 8],
    ['CreatedNeedsConfirmation', 9],
    ['InEscrow', 10],
  ]);

  constructor(client: GManClient, _options?: any) {
    super();
    this.client = client;
  }

  getUserInventoryContents(
    _steamID: SteamID | string,
    _appid: number,
    _contextid: string,
    _tradeableOnly: boolean,
    callback: (err?: Error | null, inventory?: EconItem[], currency?: EconItem[]) => void
  ): void {
    callback(null, [], []);
  }

  createOffer(partner: SteamID | string, _token?: string): TradeOffer {
    return new TradeOffer(this, partner, true);
  }

  getOffer(id: string | number, callback: (err?: Error | null, offer?: TradeOffer) => void): void {
    const offer = this._offersCache.get(String(id));
    if (offer) {
      callback(null, offer);
    } else {
      callback(new Error('NoMatch'));
    }
  }

  getOffers(filter: number, callback: (err?: Error | null, sent?: TradeOffer[], received?: TradeOffer[]) => void): void;
  getOffers(filter: number, historicalCutoff: Date, callback: (err?: Error | null, sent?: TradeOffer[], received?: TradeOffer[]) => void): void;
  getOffers(filter: number, historicalCutoffOrCallback?: Date | ((err?: Error | null, sent?: TradeOffer[], received?: TradeOffer[]) => void), callback?: (err?: Error | null, sent?: TradeOffer[], received?: TradeOffer[]) => void): void {
    const cb = typeof historicalCutoffOrCallback === 'function' ? historicalCutoffOrCallback : callback;
    const sent: TradeOffer[] = [];
    const received: TradeOffer[] = [];

    if (filter === 1 || filter === 3) {
      for (const [id, state] of Object.entries(this.pollData.received)) {
        if (state === 2 || state === 9) {
          const offer = this._offersCache.get(id);
          if (offer) received.push(offer);
        }
      }

      for (const [id, state] of Object.entries(this.pollData.sent)) {
        if (state === 2 || state === 9) {
          const offer = this._offersCache.get(id);
          if (offer) sent.push(offer);
        }
      }
    }

    if (cb) cb(null, sent, received);
  }

  doPoll(): void {
    this.client
      .execAction(440, 'active-offers', {})
      .then((result) => {
        const offers = JSON.parse(result.details || '[]') as GManTradeOffer[];

        for (const gmanOffer of offers) {
          const offer = TradeOffer.fromGManOffer(this, gmanOffer);
          this._offersCache.set(offer.id!, offer);

          const prevState = this.pollData.received[offer.id!];
          if (prevState === undefined) {
            this.pollData.received[offer.id!] = offer.state;
            this.emit('newOffer', offer);
          } else if (prevState !== offer.state) {
            this.pollData.received[offer.id!] = offer.state;
            this.emit('receivedOfferChanged', offer, prevState);
          }
        }

        this.emit('pollData', this.pollData);
      })
      .catch((err) => {
        this.emit('debug', `Poll error: ${err.message}`);
      });
  }

  startPolling(): void {
    if (this._pollTimer) return;
    this._pollTimer = setInterval(() => this.doPoll(), this.pollInterval);
    this.doPoll();
  }

  stopPolling(): void {
    if (this._pollTimer) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  setCookies(_cookies: string[], _callback?: (err?: Error) => void): void {
    if (_callback) _callback();
  }

  shutdown(): void {
    this.stopPolling();
  }
}

export default SteamTradeOfferManager;
