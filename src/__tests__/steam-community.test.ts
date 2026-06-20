import { SteamCommunityAdapter } from '../adapters/steam-community';
import { GManClient } from '../client';

jest.mock('../client');

describe('SteamCommunityAdapter', () => {
  let mockClient: jest.Mocked<GManClient>;
  let adapter: SteamCommunityAdapter;

  beforeEach(() => {
    mockClient = new GManClient() as any;
    mockClient.execAction = jest.fn();
    adapter = new SteamCommunityAdapter(mockClient, { steamID: '76561198000000001' });
  });

  test('should initialize with realistic session ID and cookies', () => {
    expect(adapter.steamID).toBe('76561198000000001');
    const session = adapter.getWebSessionSync() as { sessionID: string; cookies: string[] };
    expect(session.sessionID).toHaveLength(32);
    expect(session.cookies).toHaveLength(2);
    expect(session.cookies[0]).toContain(`sessionid=${session.sessionID}`);
    expect(session.cookies[1]).toContain('steamLoginSecure=76561198000000001');
  });

  test('should update cookies when steamID is changed', () => {
    adapter.steamID = '76561198000000002';
    expect(adapter.steamID).toBe('76561198000000002');
    const session = adapter.getWebSessionSync() as { sessionID: string; cookies: string[] };
    expect(session.cookies[1]).toContain('steamLoginSecure=76561198000000002');
  });

  test('should support getWebSession with callback', async () => {
    await new Promise<void>((resolve) => {
      adapter.getWebSession((err, session: any) => {
        expect(err).toBeNull();
        expect(session.sessionID).toBeDefined();
        expect(session.cookies).toHaveLength(2);
        resolve();
      });
    });
  });

  test('should set single cookie and update sessionID if needed', () => {
    adapter.setCookie('sessionid=newsessionid123456');
    const session = adapter.getWebSessionSync() as { sessionID: string; cookies: string[] };
    expect(session.sessionID).toBe('newsessionid123456');
    expect(session.cookies).toContain('sessionid=newsessionid123456');
  });

  test('should set cookies array', () => {
    adapter.setCookies(['sessionid=customid', 'custom_cookie=val']);
    const session = adapter.getWebSessionSync() as { sessionID: string; cookies: string[] };
    expect(session.sessionID).toBe('customid');
    expect(session.cookies).toEqual(['sessionid=customid', 'custom_cookie=val']);
  });

  test('should resolve vanity url via GManClient', async () => {
    (mockClient.execAction as jest.Mock).mockResolvedValueOnce({
      details: '76561198000000003',
    });

    const steamId = await adapter.resolveVanityUrl('testvanity');
    expect(steamId).toBe('76561198000000003');
    expect(mockClient.execAction).toHaveBeenCalledWith(440, 'resolve-vanity-url', {
      url: 'testvanity',
    });
  });

  test('should check escrow via GManClient', async () => {
    (mockClient.execAction as jest.Mock).mockResolvedValueOnce({
      details: 'true',
    });

    const isEscrow = await adapter.checkEscrow('12345');
    expect(isEscrow).toBe(true);
    expect(mockClient.execAction).toHaveBeenCalledWith(440, 'check-escrow', {
      offer: JSON.stringify({ tradeofferid: '12345' }),
    });
  });
});
