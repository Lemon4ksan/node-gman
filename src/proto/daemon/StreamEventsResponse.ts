// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface StreamEventsResponse {
  'event_id'?: (string);
  'event_type'?: (string);
  'payload_json'?: (string);
  'timestamp'?: (number | string | Long);
}

export interface StreamEventsResponse__Output {
  'event_id': (string);
  'event_type': (string);
  'payload_json': (string);
  'timestamp': (string);
}
