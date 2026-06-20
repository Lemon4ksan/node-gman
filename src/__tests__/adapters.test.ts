import { SteamUserAdapter, TeamFortress2Adapter } from '../adapters';
import { GManClient } from '../client';
import { EventEmitter } from 'events';

jest.mock('../client');

describe('SteamUserAdapter', () => {
  let mockClient: jest.Mocked<GManClient>;

  beforeEach(() => {
    mockClient = new GManClient() as any;
    mockClient.getStatus = jest.fn().mockResolvedValue({
      connected: true,
      steam_id: '76561198000000001',
      current_appid: 440,
    });
    mockClient.playGame = jest.fn().mockResolvedValue({});
    mockClient.exitGame = jest.fn().mockResolvedValue({});
    mockClient.streamEvents = jest.fn().mockReturnValue(new EventEmitter());
  });

  test('should fetch status on init and emit loggedOn & webSession', (done) => {
    const adapter = new SteamUserAdapter(mockClient);

    let loggedOnCalled = false;
    let webSessionCalled = false;

    adapter.on('loggedOn', (steamID) => {
      expect(steamID.getSteamID64()).toBe('76561198000000001');
      loggedOnCalled = true;
      if (loggedOnCalled && webSessionCalled) done();
    });

    adapter.on('webSession', (sessionID, cookies) => {
      expect(sessionID).toHaveLength(32);
      expect(cookies).toHaveLength(2);
      webSessionCalled = true;
      if (loggedOnCalled && webSessionCalled) done();
    });
  });

  test('should handle gamesPlayed app launch', (done) => {
    const adapter = new SteamUserAdapter(mockClient);
    
    // Allow init promise to run
    process.nextTick(() => {
      adapter.gamesPlayed(440);
      expect(mockClient.playGame).toHaveBeenCalledWith(440);
      done();
    });
  });

  test('should handle gamesPlayed app exit', (done) => {
    const adapter = new SteamUserAdapter(mockClient);
    
    process.nextTick(() => {
      adapter.gamesPlayed([]);
      expect(mockClient.exitGame).toHaveBeenCalled();
      done();
    });
  });
});

describe('TeamFortress2Adapter', () => {
  let mockClient: jest.Mocked<GManClient>;
  let mockStream: EventEmitter;

  beforeEach(() => {
    mockClient = new GManClient() as any;
    mockClient.getStatus = jest.fn().mockResolvedValue({
      connected: true,
      steam_id: '76561198000000001',
      current_appid: 440,
    });
    mockStream = new EventEmitter() as any;
    mockClient.streamEvents = jest.fn().mockReturnValue(mockStream);
    mockClient.execAction = jest.fn().mockResolvedValue({});
  });

  test('should establish event listener on daemon event stream', (done) => {
    const adapter = new TeamFortress2Adapter(mockClient);
    
    let connectedEmitted = false;
    adapter.on('connectedToGC', () => {
      connectedEmitted = true;
    });

    // Initial check triggers connectedToGC because appid is 440
    process.nextTick(() => {
      expect(adapter.haveGCSession).toBe(true);
      expect(connectedEmitted).toBe(true);
      done();
    });
  });

  test('should parse and emit ItemAcquiredEvent from stream', (done) => {
    const adapter = new TeamFortress2Adapter(mockClient);

    adapter.on('itemAcquired', (item) => {
      expect(item.id).toBe('123456');
      expect(item.def_index).toBe(5021);
      expect(item.quantity).toBe(1);
      done();
    });

    mockStream.emit('data', {
      event_type: 'daemon.ItemAcquiredEvent',
      payload_json: JSON.stringify({
        item: {
          asset_id: '123456',
          def_index: 5021,
          quality: 6,
          quantity: 1,
          is_tradable: true,
          is_craftable: true,
        },
      }),
    });
  });

  test('should execute craft action on daemon', () => {
    const adapter = new TeamFortress2Adapter(mockClient);
    adapter.craft(['123', '456'], 4);
    
    expect(mockClient.execAction).toHaveBeenCalledWith(440, 'craft', {
      recipe: '4',
      items: '[123,456]',
    });
  });
});
