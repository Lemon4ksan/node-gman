// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface GuardConfirmation {
  'id'?: (number | string | Long);
  'nonce'?: (number | string | Long);
  'title'?: (string);
  'type_name'?: (string);
  'description'?: (string);
}

export interface GuardConfirmation__Output {
  'id': (string);
  'nonce': (string);
  'title': (string);
  'type_name': (string);
  'description': (string);
}
