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
    rates?: {
        buy?: number;
        sell?: number;
    };
}
export interface Values {
    total?: number;
    keys: number;
    metal: number;
}
export interface Prices {
    [priceKey: string]: {
        buy?: any;
        sell?: any;
    };
}
export interface Action {
    action: 'accept' | 'decline' | 'skip' | 'counter';
    reason: string;
}
export declare class EconItem {
    [key: string]: any;
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
    getSKU(schema: any, ...args: any[]): {
        sku: string;
        isPainted: boolean;
    } | null;
}
export declare class TradeOffer {
    partner: SteamID;
    id: string | null;
    message: string | null;
    state: number;
    itemsToGive: EconItem[];
    itemsToReceive: EconItem[];
    isOurOffer: boolean;
    created: Date;
    updated: Date;
    expires: Date;
    confirmationMethod: number;
    _tempData: Record<string, any>;
    manager: SteamTradeOfferManager;
    private _data;
    constructor(manager: SteamTradeOfferManager, partner: SteamID | string, isOurOffer?: boolean);
    static fromGManOffer(manager: SteamTradeOfferManager, offer: GManTradeOffer): TradeOffer;
    isGlitched(): boolean;
    data(): Record<string, any>;
    data(key: string): any;
    data(key: string, value: any): void;
    addMyItem(item: {
        assetid: string;
        appid?: number;
        contextid?: string;
        amount?: number;
    }): boolean;
    addMyItems(items: {
        assetid: string;
        appid?: number;
        contextid?: string;
        amount?: number;
    }[]): number;
    addTheirItem(item: {
        assetid: string;
        appid?: number;
        contextid?: string;
        amount?: number;
    }): boolean;
    addTheirItems(items: {
        assetid: string;
        appid?: number;
        contextid?: string;
        amount?: number;
    }[]): number;
    removeMyItem(_item: any): boolean;
    removeMyItems(_items: any[]): number;
    removeTheirItem(_item: any): boolean;
    removeTheirItems(_items: any[]): number;
    setToken(_token: string): void;
    setMessage(message: string): void;
    getUserDetails(callback: (err: Error | null, me?: any, them?: any) => void): void;
    accept(callback?: (err: Error | null, status?: string) => void): void;
    accept(skipStateUpdate: boolean, callback?: (err: Error | null, status?: string) => void): void;
    send(callback?: (err: Error | null, state?: string) => void): void;
    decline(callback?: (err: Error | null) => void): void;
    counter(): TradeOffer;
    cancel(callback?: (err: Error | null) => void): void;
    getExchangeDetails(_getDetailsIfFailed: boolean, callback: (err?: Error | null, status?: number, tradeInitTime?: Date, receivedItems?: any[], sentItems?: any[]) => void): void;
    log(level: string, message: string, ...meta: any[]): void;
    getDiff(): Record<string, any> | null;
}
export declare class SteamTradeOfferManager extends EventEmitter {
    client: GManClient;
    steamID: SteamID | null;
    pollData: PollData;
    apiKey: string | null;
    accessToken: string | null;
    pollInterval: number;
    private _pollTimer;
    private _offersCache;
    static EOfferFilter: Map<string, number>;
    static EResult: Map<string, number>;
    static ETradeOfferState: Map<string, number>;
    constructor(client: GManClient, _options?: any);
    getUserInventoryContents(_steamID: SteamID | string, _appid: number, _contextid: string, _tradeableOnly: boolean, callback: (err?: Error | null, inventory?: EconItem[], currency?: EconItem[]) => void): void;
    createOffer(partner: SteamID | string, _token?: string): TradeOffer;
    getOffer(id: string | number, callback: (err?: Error | null, offer?: TradeOffer) => void): void;
    getOffers(filter: number, callback: (err?: Error | null, sent?: TradeOffer[], received?: TradeOffer[]) => void): void;
    getOffers(filter: number, historicalCutoff: Date, callback: (err?: Error | null, sent?: TradeOffer[], received?: TradeOffer[]) => void): void;
    doPoll(): void;
    startPolling(): void;
    stopPolling(): void;
    setCookies(_cookies: string[], _callback?: (err?: Error) => void): void;
    shutdown(): void;
}
export default SteamTradeOfferManager;
