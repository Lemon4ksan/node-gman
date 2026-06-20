import { EventEmitter } from 'events';
import { GManClient } from '../client';
import {
  TradeOffer,
  TradeOfferItem,
  PollData,
  SendOfferParams,
  StreamEventsResponse,
} from '../types';

export interface TradeOfferManagerOptions {
  pollInterval?: number;
}

type OfferFilter = number;

export const EOfferFilter = {
  ActiveOnly: 1,
  HistoricalOnly: 2,
  All: 3,
} as const;

export const ETradeOfferState = {
  Invalid: 1,
  Active: 2,
  Accepted: 3,
  Countered: 4,
  Expired: 5,
  Cancelled: 6,
  Declined: 7,
  InvalidItems: 8,
  CreatedNeedsConfirmation: 9,
  InEscrow: 10,
} as const;

export interface OfferAction {
  action: 'accept' | 'decline' | 'skip' | 'counter';
  reason: string;
  meta?: Record<string, unknown>;
}

export class TradeOfferManagerAdapter extends EventEmitter {
  public client: GManClient;
  private _pollData: PollData = { sent: {}, received: {}, offerData: {} };
  private _pollInterval: NodeJS.Timeout | null = null;
  private _pollIntervalMs: number;
  private offersCache: Map<string, TradeOffer> = new Map();

  constructor(client: GManClient, options: TradeOfferManagerOptions = {}) {
    super();
    this.client = client;
    this._pollIntervalMs = options.pollInterval || 30000;
  }

  get pollData(): PollData {
    return this._pollData;
  }

  set pollData(data: PollData) {
    this._pollData = data;
  }

  get pollInterval(): number {
    return this._pollIntervalMs;
  }

  set pollInterval(ms: number) {
    this._pollIntervalMs = ms;
    if (this._pollInterval) {
      this.stopPolling();
      this.startPolling();
    }
  }

  startPolling(): void {
    if (this._pollInterval) return;
    this._pollInterval = setInterval(() => this._poll(), this._pollIntervalMs);
    this._poll();
  }

  stopPolling(): void {
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  }

  private async _poll(): Promise<void> {
    try {
      const [receivedResult, sentResult] = await Promise.all([
        this.client.execAction(440, 'active-offers', {}),
        this.client.execAction(440, 'active-sent-offers', {}),
      ]);

      const receivedOffers = this.parseOffersFromResponse(receivedResult.details);
      const sentOffers = this.parseOffersFromResponse(sentResult.details);

      const newReceivedIds = new Set<string>();
      const newSentIds = new Set<string>();

      for (const offer of receivedOffers) {
        const id = offer.tradeofferid;
        newReceivedIds.add(id);
        this.offersCache.set(id, offer);

        const prevState = this._pollData.received[id];
        const newState = offer.trade_offer_state;

        if (prevState === undefined) {
          this._pollData.received[id] = newState;
          this.emit('newOffer', offer);
        } else if (prevState !== newState) {
          this._pollData.received[id] = newState;
          this.emit('offerChanged', { offer, oldState: prevState });
        }

        this._pollData.offerData[id] = offer.data || {};
      }

      for (const offer of sentOffers) {
        const id = offer.tradeofferid;
        newSentIds.add(id);
        this.offersCache.set(id, offer);

        const prevState = this._pollData.sent[id];
        const newState = offer.trade_offer_state;

        if (prevState === undefined) {
          this._pollData.sent[id] = newState;
        } else if (prevState !== newState) {
          this._pollData.sent[id] = newState;
          this.emit('offerChanged', { offer, oldState: prevState });
        }

        this._pollData.offerData[id] = offer.data || {};
      }

      for (const id of Object.keys(this._pollData.received)) {
        if (!newReceivedIds.has(id) && this._pollData.received[id] === ETradeOfferState.Active) {
          delete this._pollData.received[id];
        }
      }

      for (const id of Object.keys(this._pollData.sent)) {
        if (!newSentIds.has(id) && this._pollData.sent[id] === ETradeOfferState.Active) {
          delete this._pollData.sent[id];
        }
      }

      this.emit('poll', this._pollData);
    } catch (err) {
      this.emit('error', err);
    }
  }

  private parseOffersFromResponse(details: string): TradeOffer[] {
    if (!details || details.trim() === '' || details.trim() === '[]') {
      return [];
    }
    try {
      const parsed = JSON.parse(details);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  }

  getOffers(
    filter: OfferFilter,
    callback: (err: Error | null, sent?: TradeOffer[], received?: TradeOffer[]) => void
  ): void {
    this._getOffers(filter)
      .then(({ sent, received }) => callback(null, sent, received))
      .catch(err => callback(err));
  }

  private async _getOffers(filter: OfferFilter): Promise<{ sent: TradeOffer[]; received: TradeOffer[] }> {
    const sent: TradeOffer[] = [];
    const received: TradeOffer[] = [];

    if (filter === EOfferFilter.ActiveOnly || filter === EOfferFilter.All) {
      for (const [id, state] of Object.entries(this._pollData.received)) {
        if (
          state === ETradeOfferState.Active ||
          state === ETradeOfferState.CreatedNeedsConfirmation
        ) {
          const offer = this.offersCache.get(id);
          if (offer) received.push(offer);
        }
      }

      for (const [id, state] of Object.entries(this._pollData.sent)) {
        if (
          state === ETradeOfferState.Active ||
          state === ETradeOfferState.CreatedNeedsConfirmation
        ) {
          const offer = this.offersCache.get(id);
          if (offer) sent.push(offer);
        }
      }
    }

    return { sent, received };
  }

  getOffer(
    offerId: string,
    callback: (err: Error | null, offer?: TradeOffer | null) => void
  ): void {
    const offer = this.offersCache.get(offerId) || null;
    if (offer) {
      callback(null, offer);
    } else {
      callback(new Error('NoMatch'));
    }
  }

  acceptOffer(
    offer: TradeOffer,
    callback: (err: Error | null, status?: string) => void
  ): void {
    const offerId = offer.tradeofferid;
    this.client
      .execAction(440, 'accept-offer', { offer_id: offerId })
      .then(result => {
        this._pollData.received[offerId] = ETradeOfferState.Accepted;
        callback(null, 'accepted');
      })
      .catch(err => callback(err));
  }

  declineOffer(
    offer: TradeOffer,
    callback: (err: Error | null) => void
  ): void {
    const offerId = offer.tradeofferid;
    this.client
      .execAction(440, 'decline-offer', { offer_id: offerId })
      .then(() => {
        this._pollData.received[offerId] = ETradeOfferState.Declined;
        callback(null);
      })
      .catch(err => callback(err));
  }

  cancelOffer(
    offer: TradeOffer,
    callback: (err: Error | null) => void
  ): void {
    const offerId = offer.tradeofferid;
    this.client
      .execAction(440, 'cancel-offer', { offer_id: offerId })
      .then(() => {
        this._pollData.sent[offerId] = ETradeOfferState.Cancelled;
        callback(null);
      })
      .catch(err => callback(err));
  }

  sendOffer(
    offer: TradeOffer,
    callback: (err: Error | null, status?: string) => void
  ): void {
    const params: SendOfferParams = {
      partner_id: offer.partner,
      items_to_give: offer.items_to_give,
      items_to_receive: offer.items_to_receive,
      message: offer.message,
    };

    this.client
      .execAction(440, 'send-offer', {
        offer_params: JSON.stringify(params),
      })
      .then(result => {
        const response = JSON.parse(result.details) as { tradeofferid: string };
        const newOffer: TradeOffer = {
          ...offer,
          tradeofferid: response.tradeofferid,
          trade_offer_state: ETradeOfferState.CreatedNeedsConfirmation,
        };
        this.offersCache.set(response.tradeofferid, newOffer);
        this._pollData.sent[response.tradeofferid] =
          ETradeOfferState.CreatedNeedsConfirmation;
        callback(null, 'sent');
      })
      .catch(err => callback(err));
  }

  counterOffer(
    offer: TradeOffer,
    callback: (err: Error | null, status?: string) => void
  ): void {
    this.sendOffer(offer, callback);
  }

  async checkEscrow(offer: TradeOffer): Promise<boolean> {
    const result = await this.client.execAction(440, 'check-escrow', {
      offer: JSON.stringify({ tradeofferid: offer.tradeofferid }),
    });
    return result.details === 'true';
  }

  getPartnerInventory(
    partnerId: string,
    callback: (err: Error | null, items?: TradeOfferItem[]) => void
  ): void {
    this.client
      .execAction(440, 'get-partner-inventory', { partner_id: partnerId })
      .then(result => {
        try {
          const items = JSON.parse(result.details) as TradeOfferItem[];
          callback(null, items);
        } catch {
          callback(null, []);
        }
      })
      .catch(err => callback(err));
  }

  setItemInTrade(assetid: string): void {
    // Track items currently in trade
  }

  unsetItemInTrade(assetid: string): void {
    // Untrack items no longer in trade
  }

  isInTrade(assetid: string): boolean {
    return false;
  }
}
