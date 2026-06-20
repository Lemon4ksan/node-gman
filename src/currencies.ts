function rounding(number: number): number {
  const isPositive = number >= 0;
  const roundingFn = number + 0.001 > Math.ceil(number) ? Math.round : Math.floor;
  const rounded = roundingFn(Math.abs(number));
  return isPositive ? rounded : -rounded;
}

function truncate(number: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return rounding(number * factor) / factor;
}

function toScrap(refined: number): number {
  let scrap = refined * 9;
  scrap = Math.round(scrap * 2) / 2;
  return scrap;
}

function toRefined(scrap: number): number {
  let refined = scrap / 9;
  refined = truncate(refined, 2);
  return refined;
}

export class Currencies {
  keys: number;
  metal: number;

  constructor(currencies: { keys?: number; metal?: number }) {
    if (!currencies) {
      throw new Error('Missing currencies object');
    }

    this.keys = parseFloat(String(currencies.keys || 0));
    this.metal = parseFloat(String(currencies.metal || 0));

    if (isNaN(this.keys) || isNaN(this.metal)) {
      throw new Error('Not a valid currencies object');
    }

    this.metal = toRefined(toScrap(this.metal));
  }

  static toCurrencies(value: number, conversion?: number): Currencies {
    if (conversion === undefined) {
      const metal = this.toRefined(value);
      return new this({ metal });
    }

    const conversionScrap = this.toScrap(conversion);
    const keys = rounding(value / conversionScrap);
    const left = value - keys * conversionScrap;
    const metal = this.toRefined(left);

    return new this({ keys, metal });
  }

  static toRefined(scrap: number): number {
    return toRefined(scrap);
  }

  static toScrap(refined: number): number {
    return toScrap(refined);
  }

  static addRefined(...args: number[]): number {
    let value = 0;
    for (let i = 0; i < args.length; i++) {
      value += toScrap(args[i]);
    }
    return toRefined(value);
  }

  toValue(conversion?: number): number {
    if (conversion === undefined && this.keys !== 0) {
      throw new Error('Missing conversion rate for keys in refined');
    }

    let value = toScrap(this.metal);
    if (this.keys !== 0) {
      value += this.keys * toScrap(conversion!);
    }
    return value;
  }

  toString(): string {
    let str = '';

    if (this.keys !== 0 || this.keys === this.metal) {
      str = `${this.keys} ${this.keys === 1 ? 'key' : 'keys'}`;
    }

    if (this.metal !== 0 || this.keys === this.metal) {
      if (str !== '') {
        str += ', ';
      }
      str += truncate(this.metal) + ' ref';
    }

    return str;
  }

  toJSON() {
    return {
      keys: this.keys,
      metal: this.metal,
    };
  }
}
