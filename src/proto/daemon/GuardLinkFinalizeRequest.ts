// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface GuardLinkFinalizeRequest {
  'shared_secret'?: (string);
  'server_time'?: (number | string | Long);
  'sms_code'?: (string);
  'identity_secret'?: (string);
  'device_id'?: (string);
}

export interface GuardLinkFinalizeRequest__Output {
  'shared_secret': (string);
  'server_time': (string);
  'sms_code': (string);
  'identity_secret': (string);
  'device_id': (string);
}
