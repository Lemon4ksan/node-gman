import { TradeOfferManagerAdapter } from '../adapters/trade-offer';
import { GManClient } from '../client';
import { EventEmitter } from 'events';

jest.mock('../client');

describe('TradeOfferManagerAdapter', () => {
  let mockClient: jest.Mocked<GManClient>;
  let mockStream: EventEmitter;
  let adapter: TradeOfferManagerAdapter;

  beforeEach(() => {
    mockClient = new GManClient() as any;
    mockStream = new EventEmitter() as any;
    mockClient.streamEvents = jest.fn().mockReturnValue(mockStream);
    mockClient.execAction = jest.fn().mockResolvedValue({ details: '[]' });
    adapter = new TradeOfferManagerAdapter(mockClient, { pollInterval: 60000 });
  });

  afterEach(() => {
    adapter.stopPolling();
  });

  test('should normalize raw Go offer parameters into JS tradeoffer manager fields', () => {
    const rawGoOffer = {
      ID: 987654321,
      OtherSteamID: '76561198000000005',
      State: 2,
      ItemsToGive: [
        { AssetID: '11111', AppID: 440, ContextID: '2' }
      ],
      ItemsToReceive: [
        { AssetID: '22222', AppID: 440, ContextID: '2' }
      ]
    };

    const normalized = (adapter as any).normalizeOffer(rawGoOffer);
    expect(normalized.tradeofferid).toBe('987654321');
    expect(normalized.partner).toBe('76561198000000005');
    expect(normalized.trade_offer_state).toBe(2);
    expect(normalized.items_to_give).toHaveLength(1);
    expect(normalized.items_to_give[0].assetid).toBe('11111');
    expect(normalized.items_to_give[0].appid).toBe(440);
    expect(normalized.items_to_give[0].contextid).toBe('2');
  });

  test('should listen to NewOfferEvent on eventStream and emit newOffer event', (done) => {
    adapter.startPolling();

    adapter.on('newOffer', (offer) => {
      try {
        expect(offer.tradeofferid).toBe('12345');
        expect(offer.partner).toBe('76561198000000009');
        expect(offer.trade_offer_state).toBe(2);
        done();
      } catch (err) {
        done(err);
      }
    });

    mockStream.emit('data', {
      event_type: 'web.NewOfferEvent',
      payload_json: JSON.stringify({
        Offer: {
          ID: 12345,
          OtherSteamID: '76561198000000009',
          State: 2
        }
      })
    });
  });

  test('should listen to OfferChangedEvent and emit offerChanged event', (done) => {
    adapter.startPolling();

    // Cache the initial offer state
    (adapter as any)._pollData.received['54321'] = 2;

    adapter.on('offerChanged', ({ offer, oldState }) => {
      try {
        expect(offer.tradeofferid).toBe('54321');
        expect(offer.trade_offer_state).toBe(3);
        expect(oldState).toBe(2);
        done();
      } catch (err) {
        done(err);
      }
    });

    mockStream.emit('data', {
      event_type: 'web.OfferChangedEvent',
      payload_json: JSON.stringify({
        Offer: {
          ID: 54321,
          OtherSteamID: '76561198000000009',
          State: 3,
          is_our_offer: false
        }
      })
    });
  });
});
