import { getAuthCode, getConfirmationKey, getAuthCodeAsync, time } from '../totp';
import { GManClient } from '../client';

jest.mock('../client');

describe('steam-totp mock implementation', () => {
  const testBase32Secret = 'ORXW433XPE======'; // "testsecret" in base32
  const testIdentitySecret = 'dGVzdGlkZW50aXR5c2VjcmV0'; // "testidentitysecret" in base64

  test('should generate a 5-character Steam TOTP code', () => {
    const code = getAuthCode(testBase32Secret);
    expect(code).toHaveLength(5);
    expect(code).toMatch(/^[23456789BCDFGHJKMNPQRTVWXY]+$/);
  });

  test('should generate a valid confirmation key', () => {
    const currentTime = time();
    const key = getConfirmationKey(testIdentitySecret, currentTime, 'accept');
    expect(key).toBeDefined();
    expect(typeof key).toBe('string');
    // Base64 regex check
    expect(key).toMatch(/^[a-zA-Z0-9+/=]+$/);
  });

  test('should retrieve auth code asynchronously from GManClient', async () => {
    const mockClient = new GManClient() as any;
    mockClient.guardCode = jest.fn().mockResolvedValue({ code: 'ABC12' });

    const code = await getAuthCodeAsync(mockClient);
    expect(code).toBe('ABC12');
    expect(mockClient.guardCode).toHaveBeenCalled();
  });
});
