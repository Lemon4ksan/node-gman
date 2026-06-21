// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface GuardLinkStartResponse {
  'success'?: (boolean);
  'shared_secret'?: (string);
  'identity_secret'?: (string);
  'revocation_code'?: (string);
  'device_id'?: (string);
  'uri'?: (string);
  'phone_number_hint'?: (string);
  'server_time'?: (number | string | Long);
}

export interface GuardLinkStartResponse__Output {
  'success': (boolean);
  'shared_secret': (string);
  'identity_secret': (string);
  'revocation_code': (string);
  'device_id': (string);
  'uri': (string);
  'phone_number_hint': (string);
  'server_time': (string);
}
