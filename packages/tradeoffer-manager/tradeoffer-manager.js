"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamTradeOfferManager = exports.TradeOffer = exports.EconItem = void 0;
const events_1 = require("events");
const steamid_1 = __importDefault(require("steamid"));
class EconItem {
    appid;
    contextid;
    assetid;
    classid;
    instanceid;
    amount;
    pos;
    id;
    background_color;
    icon_url;
    icon_url_large;
    tradable;
    actions;
    name;
    name_color;
    type;
    market_name;
    market_hash_name;
    commodity;
    market_tradable_restriction;
    market_marketable_restriction;
    marketable;
    tags;
    is_currency;
    fraudwarnings;
    descriptions;
    app_data;
    getAction(action) {
        return null;
    }
    getItemTag(category) {
        return null;
    }
    getSKU(schema, ...args) {
        return null;
    }
}
exports.EconItem = EconItem;
function assignEconItem(item) {
    return Object.setPrototypeOf(item, EconItem.prototype);
}
class TradeOffer {
    partner;
    id;
    message;
    state;
    itemsToGive = [];
    itemsToReceive = [];
    isOurOffer;
    created;
    updated;
    expires;
    confirmationMethod;
    _tempData = {};
    manager;
    _data = {};
    constructor(manager, partner, isOurOffer = false) {
        this.manager = manager;
        this.partner = typeof partner === 'string' ? new steamid_1.default(partner) : partner;
        this.id = null;
        this.message = null;
        this.state = 0;
        this.isOurOffer = isOurOffer;
        this.created = new Date();
        this.updated = new Date();
        this.expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        this.confirmationMethod = 0;
    }
    static fromGManOffer(manager, offer) {
        const tradeOffer = new TradeOffer(manager, offer.partner, false);
        tradeOffer.id = offer.tradeofferid;
        tradeOffer.message = offer.message || null;
        tradeOffer.state = offer.trade_offer_state;
        tradeOffer.isOurOffer = false;
        if (offer.items_to_give) {
            tradeOffer.itemsToGive = offer.items_to_give.map((item) => assignEconItem({
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
            tradeOffer.itemsToReceive = offer.items_to_receive.map((item) => assignEconItem({
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
    isGlitched() {
        return false;
    }
    data(key, value) {
        if (key === undefined) {
            return this._data;
        }
        if (value === undefined) {
            return this._data[key];
        }
        this._data[key] = value;
    }
    addMyItem(item) {
        this.itemsToGive.push(assignEconItem({
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
        return true;
    }
    addMyItems(items) {
        let added = 0;
        for (const item of items) {
            if (this.addMyItem(item))
                added++;
        }
        return added;
    }
    addTheirItem(item) {
        this.itemsToReceive.push(assignEconItem({
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
        return true;
    }
    addTheirItems(items) {
        let added = 0;
        for (const item of items) {
            if (this.addTheirItem(item))
                added++;
        }
        return added;
    }
    removeMyItem(_item) {
        return true;
    }
    removeMyItems(_items) {
        return _items.length;
    }
    removeTheirItem(_item) {
        return true;
    }
    removeTheirItems(_items) {
        return _items.length;
    }
    setToken(_token) { }
    setMessage(message) {
        this.message = message;
    }
    getUserDetails(callback) {
        callback(null, { personaName: 'Bot', contexts: {}, escrowDays: 0, avatarIcon: '', avatarMedium: '', avatarFull: '' }, { personaName: 'Partner', contexts: {}, escrowDays: 0, avatarIcon: '', avatarMedium: '', avatarFull: '' });
    }
    accept(skipStateUpdateOrCallback, callback) {
        const cb = typeof skipStateUpdateOrCallback === 'function' ? skipStateUpdateOrCallback : callback;
        if (this.id) {
            this.manager.client
                .execAction(440, 'accept-offer', { offer_id: this.id })
                .then(() => {
                this.state = 3; // Accepted
                if (cb)
                    cb(null, 'accepted');
            })
                .catch((err) => {
                if (cb)
                    cb(err);
            });
        }
        else {
            if (cb)
                cb(new Error('Offer has no ID'));
        }
    }
    send(callback) {
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
            if (callback)
                callback(null, 'sent');
        })
            .catch((err) => {
            if (callback)
                callback(err);
        });
    }
    decline(callback) {
        if (this.id) {
            this.manager.client
                .execAction(440, 'decline-offer', { offer_id: this.id })
                .then(() => {
                this.state = 7; // Declined
                if (callback)
                    callback(null);
            })
                .catch((err) => {
                if (callback)
                    callback(err);
            });
        }
        else {
            if (callback)
                callback(new Error('Offer has no ID'));
        }
    }
    counter() {
        return new TradeOffer(this.manager, this.partner, true);
    }
    cancel(callback) {
        this.decline(callback);
    }
    getExchangeDetails(_getDetailsIfFailed, callback) {
        callback(null, 0, new Date(), [], []);
    }
    log(level, message, ...meta) {
        console.log(`[${level}] ${message}`, ...meta);
    }
    getDiff() {
        const diff = {};
        for (const item of this.itemsToReceive) {
            diff[item.assetid] = (diff[item.assetid] || 0) + 1;
        }
        for (const item of this.itemsToGive) {
            diff[item.assetid] = (diff[item.assetid] || 0) - 1;
        }
        return diff;
    }
}
exports.TradeOffer = TradeOffer;
class SteamTradeOfferManager extends events_1.EventEmitter {
    client;
    steamID = null;
    pollData = { sent: {}, received: {}, timestamps: {}, offersSince: 0, offerData: {} };
    apiKey = null;
    accessToken = null;
    pollInterval = 30000;
    _pollTimer = null;
    _offersCache = new Map();
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
    constructor(client, _options) {
        super();
        this.client = client;
    }
    getUserInventoryContents(_steamID, _appid, _contextid, _tradeableOnly, callback) {
        callback(null, [], []);
    }
    createOffer(partner, _token) {
        return new TradeOffer(this, partner, true);
    }
    getOffer(id, callback) {
        const offer = this._offersCache.get(String(id));
        if (offer) {
            callback(null, offer);
        }
        else {
            callback(new Error('NoMatch'));
        }
    }
    getOffers(filter, historicalCutoffOrCallback, callback) {
        const cb = typeof historicalCutoffOrCallback === 'function' ? historicalCutoffOrCallback : callback;
        const sent = [];
        const received = [];
        if (filter === 1 || filter === 3) {
            for (const [id, state] of Object.entries(this.pollData.received)) {
                if (state === 2 || state === 9) {
                    const offer = this._offersCache.get(id);
                    if (offer)
                        received.push(offer);
                }
            }
            for (const [id, state] of Object.entries(this.pollData.sent)) {
                if (state === 2 || state === 9) {
                    const offer = this._offersCache.get(id);
                    if (offer)
                        sent.push(offer);
                }
            }
        }
        if (cb)
            cb(null, sent, received);
    }
    doPoll() {
        this.client
            .execAction(440, 'active-offers', {})
            .then((result) => {
            const offers = JSON.parse(result.details || '[]');
            for (const gmanOffer of offers) {
                const offer = TradeOffer.fromGManOffer(this, gmanOffer);
                this._offersCache.set(offer.id, offer);
                const prevState = this.pollData.received[offer.id];
                if (prevState === undefined) {
                    this.pollData.received[offer.id] = offer.state;
                    this.emit('newOffer', offer);
                }
                else if (prevState !== offer.state) {
                    this.pollData.received[offer.id] = offer.state;
                    this.emit('receivedOfferChanged', offer, prevState);
                }
            }
            this.emit('pollData', this.pollData);
        })
            .catch((err) => {
            this.emit('debug', `Poll error: ${err.message}`);
        });
    }
    startPolling() {
        if (this._pollTimer)
            return;
        this._pollTimer = setInterval(() => this.doPoll(), this.pollInterval);
        this.doPoll();
    }
    stopPolling() {
        if (this._pollTimer) {
            clearInterval(this._pollTimer);
            this._pollTimer = null;
        }
    }
    setCookies(_cookies, _callback) {
        if (_callback)
            _callback();
    }
    shutdown() {
        this.stopPolling();
    }
}
exports.SteamTradeOfferManager = SteamTradeOfferManager;
exports.default = SteamTradeOfferManager;
//# sourceMappingURL=tradeoffer-manager.js.map