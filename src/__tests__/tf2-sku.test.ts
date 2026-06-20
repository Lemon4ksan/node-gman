import { SKU } from '../sku';

describe('TF2 SKU Parser', () => {
  it('should parse basic SKU (defindex and quality)', () => {
    const skuStr = '5021;6';
    const parsed = SKU.fromString(skuStr);
    expect(parsed.defindex).toBe(5021);
    expect(parsed.quality).toBe(6);
    expect(parsed.craftable).toBe(true);
    expect(parsed.tradable).toBe(true);
    expect(parsed.killstreak).toBe(0);
    expect(parsed.australium).toBe(false);
    expect(parsed.effect).toBeNull();
    expect(parsed.festive).toBe(false);

    expect(SKU.fromObject(parsed)).toBe(skuStr);
  });

  it('should handle uncraftable and untradeable flags', () => {
    const skuStr = '5021;6;uncraftable;untradable';
    const parsed = SKU.fromString(skuStr);
    expect(parsed.craftable).toBe(false);
    expect(parsed.tradable).toBe(false);

    // fromObject order: uncraftable is before untradable
    expect(SKU.fromObject(parsed)).toBe('5021;6;uncraftable;untradable');
  });

  it('should handle strange quality2', () => {
    const skuStr = '5021;6;strange';
    const parsed = SKU.fromString(skuStr);
    expect(parsed.quality2).toBe(11);
    expect(SKU.fromObject(parsed)).toBe(skuStr);
  });

  it('should handle effect (unusual effect)', () => {
    const skuStr = '315;5;u14';
    const parsed = SKU.fromString(skuStr);
    expect(parsed.effect).toBe(14);
    expect(SKU.fromObject(parsed)).toBe(skuStr);
  });

  it('should handle killstreak levels', () => {
    const skuStr = '200;6;kt-3';
    const parsed = SKU.fromString(skuStr);
    expect(parsed.killstreak).toBe(3);
    expect(SKU.fromObject(parsed)).toBe(skuStr);
  });

  it('should handle wear and paintkits', () => {
    const skuStr = '200;15;w2;pk233';
    const parsed = SKU.fromString(skuStr);
    expect(parsed.wear).toBe(2);
    expect(parsed.paintkit).toBe(233);
    expect(SKU.fromObject(parsed)).toBe(skuStr);
  });

  it('should handle target, craft number, festive, paint, crateseries, output/outputQuality', () => {
    const parsed = SKU.fromString('6526;6;festive;n100;c30;td-200;od-300;oq-5;p12345;australium');
    expect(parsed.festive).toBe(true);
    expect(parsed.craftnumber).toBe(100);
    expect(parsed.crateseries).toBe(30);
    expect(parsed.target).toBe(200);
    expect(parsed.output).toBe(300);
    expect(parsed.outputQuality).toBe(5);
    expect(parsed.paint).toBe(12345);
    expect(parsed.australium).toBe(true);

    const serialized = SKU.fromObject(parsed);
    // Note that serialization orders properties based on fromObject logic
    expect(serialized).toContain('australium');
    expect(serialized).toContain('festive');
    expect(serialized).toContain('n100');
    expect(serialized).toContain('c30');
    expect(serialized).toContain('td-200');
    expect(serialized).toContain('od-300');
    expect(serialized).toContain('oq-5');
    expect(serialized).toContain('p12345');
  });

  it('should handle roundtrip consistency', () => {
    const rawSKUs = [
      '5021;6',
      '305;5;u14;strange',
      '200;6;uncraftable;kt-2',
      '15000;15;w3;pk20;kt-1',
      '6526;6;australium;festive;n55',
    ];

    for (const sku of rawSKUs) {
      const parsed = SKU.fromString(sku);
      expect(SKU.fromObject(parsed)).toBe(sku);
    }
  });
});

