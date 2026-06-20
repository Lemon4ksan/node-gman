import { Currencies } from '../currencies';

describe('TF2 Currencies Math and Formatting', () => {
  it('should parse constructor properties correctly and truncate metal', () => {
    const cur = new Currencies({ keys: 5, metal: 10.33333 });
    expect(cur.keys).toBe(5);
    expect(cur.metal).toBe(10.33); // 10.33333 truncated to 2 decimals

    const zero = new Currencies({ keys: 0, metal: 0 });
    expect(zero.keys).toBe(0);
    expect(zero.metal).toBe(0);
  });

  it('should throw on invalid arguments', () => {
    expect(() => new Currencies(null as any)).toThrow('Missing currencies object');
    expect(() => new Currencies({ keys: 'abc' as any, metal: 5 })).toThrow();
  });

  it('should convert to scrap value with toValue', () => {
    // 1 ref = 9 scrap
    const curMetalOnly = new Currencies({ keys: 0, metal: 2.33 });
    expect(curMetalOnly.toValue()).toBe(21); // 2.33 ref * 9 = 20.97 -> rounded to nearest 0.5 is 21 scrap

    const curWithKeys = new Currencies({ keys: 2, metal: 1.5 });
    // conversion rate = 50 ref per key
    // metal scrap = 1.5 * 9 = 13.5 scrap
    // keys scrap = 2 * (50 * 9) = 900 scrap
    // total = 913.5 scrap
    expect(curWithKeys.toValue(50)).toBe(913.5);
  });

  it('should throw on toValue with keys but no conversion rate', () => {
    const cur = new Currencies({ keys: 1, metal: 0 });
    expect(() => cur.toValue()).toThrow('Missing conversion rate for keys in refined');
  });

  it('should format to string correctly', () => {
    expect(new Currencies({ keys: 0, metal: 0 }).toString()).toBe('0 keys, 0 ref');
    expect(new Currencies({ keys: 1, metal: 0 }).toString()).toBe('1 key');
    expect(new Currencies({ keys: 3, metal: 0 }).toString()).toBe('3 keys');
    expect(new Currencies({ keys: 0, metal: 4.66 }).toString()).toBe('4.66 ref');
    expect(new Currencies({ keys: 2, metal: 12.33 }).toString()).toBe('2 keys, 12.33 ref');
  });

  it('should serialize to JSON correctly', () => {
    const cur = new Currencies({ keys: 2, metal: 5.5 });
    expect(cur.toJSON()).toEqual({ keys: 2, metal: 5.5 });
  });

  it('should convert value back to currencies with toCurrencies', () => {
    // value in scrap = 18 scrap (2 ref)
    const cur1 = Currencies.toCurrencies(18);
    expect(cur1.keys).toBe(0);
    expect(cur1.metal).toBe(2);

    // value in scrap = 913.5 scrap, key rate = 50 ref (450 scrap)
    // keys = floor(913.5 / 450) = 2
    // left = 913.5 - 900 = 13.5 scrap
    // metal = 13.5 / 9 = 1.5 ref
    const cur2 = Currencies.toCurrencies(913.5, 50);
    expect(cur2.keys).toBe(2);
    expect(cur2.metal).toBe(1.5);
  });

  it('should support static helper methods', () => {
    expect(Currencies.toScrap(2.33)).toBe(21);
    expect(Currencies.toRefined(21)).toBe(2.33);

    // addRefined adds refined values by converting to scrap, summing, and converting back
    // 10.11 -> 91 scrap, 20.05 -> 180.5 scrap, 0.11 -> 1 scrap
    // sum = 272.5 scrap
    // 272.5 / 9 = 30.2777... -> truncated to 30.27 ref
    expect(Currencies.addRefined(10.11, 20.05, 0.11)).toBe(30.27);
  });
});
