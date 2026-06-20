import * as crypto from 'crypto';
import { GManClient } from './client';

function bufferFromBase32(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = base32.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const buffer = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) {
      throw new Error('Invalid base32 character');
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      buffer.push((value >> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(buffer);
}

export function getAuthCode(secret: string, timeOffset: number = 0): string {
  if (!secret) {
    throw new Error('Secret is required');
  }

  const key = bufferFromBase32(secret);
  const timeVal = Math.floor(Date.now() / 1000 + timeOffset);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(Math.floor(timeVal / 30), 4);

  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buffer);
  const hmacResult = hmac.digest();

  const start = hmacResult[hmacResult.length - 1] & 0x0f;
  const rawCode = hmacResult.readUInt32BE(start) & 0x7fffffff;

  const steamChars = '23456789BCDFGHJKMNPQRTVWXY';
  let code = '';
  let temp = rawCode;
  for (let i = 0; i < 5; i++) {
    code += steamChars[temp % steamChars.length];
    temp = Math.floor(temp / steamChars.length);
  }

  return code;
}

export function generateAuthCode(secret: string, timeOffset: number = 0): string {
  return getAuthCode(secret, timeOffset);
}

export async function getAuthCodeAsync(client: GManClient): Promise<string> {
  const resp = await client.guardCode();
  return resp.code;
}

export function getConfirmationKey(secret: string, timeVal: number, tag: string): string {
  if (!secret) {
    throw new Error('Secret is required');
  }
  const key = Buffer.from(secret, 'base64');

  let bufferSize = 8;
  if (tag) {
    bufferSize += tag.length;
  }

  const buffer = Buffer.alloc(bufferSize);
  buffer.writeUInt32BE(timeVal, 4);
  if (tag) {
    buffer.write(tag, 8);
  }

  const hmac = crypto.createHmac('sha1', key);
  hmac.update(buffer);
  return hmac.digest('base64');
}

export function time(timeOffset: number = 0): number {
  return Math.floor(Date.now() / 1000 + timeOffset);
}

export function getTimeOffset(callback: (err: Error | null, offset: number) => void): void {
  callback(null, 0);
}
