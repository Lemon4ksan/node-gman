// Original file: proto/daemon.proto

import type { Item as _daemon_Item, Item__Output as _daemon_Item__Output } from '../daemon/Item';

export interface ExecActionResponse {
  'message'?: (string);
  'items'?: (_daemon_Item)[];
  'details'?: (string);
}

export interface ExecActionResponse__Output {
  'message': (string);
  'items': (_daemon_Item__Output)[];
  'details': (string);
}
