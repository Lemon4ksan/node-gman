// Original file: proto/daemon.proto


export interface ManualPriceEntry {
  'buy_keys'?: (number);
  'buy_metal'?: (number | string);
  'sell_keys'?: (number);
  'sell_metal'?: (number | string);
}

export interface ManualPriceEntry__Output {
  'buy_keys': (number);
  'buy_metal': (number);
  'sell_keys': (number);
  'sell_metal': (number);
}
