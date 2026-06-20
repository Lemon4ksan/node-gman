// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface Item {
  'asset_id'?: (number | string | Long);
  'def_index'?: (number);
  'quality'?: (number);
  'quantity'?: (number);
  'is_tradable'?: (boolean);
  'is_craftable'?: (boolean);
  'attributes'?: ({[key: string]: string});
  'original_id'?: (number | string | Long);
}

export interface Item__Output {
  'asset_id': (string);
  'def_index': (number);
  'quality': (number);
  'quantity': (number);
  'is_tradable': (boolean);
  'is_craftable': (boolean);
  'attributes': ({[key: string]: string});
  'original_id': (string);
}
