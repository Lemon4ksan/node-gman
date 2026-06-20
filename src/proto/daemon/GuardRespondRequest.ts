// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface GuardRespondRequest {
  'confirmation_id'?: (number | string | Long);
  'accept'?: (boolean);
  'all'?: (boolean);
}

export interface GuardRespondRequest__Output {
  'confirmation_id': (string);
  'accept': (boolean);
  'all': (boolean);
}
