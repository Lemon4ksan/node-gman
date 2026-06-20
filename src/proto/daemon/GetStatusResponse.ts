// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface GetStatusResponse {
  'connected'?: (boolean);
  'steam_id'?: (string);
  'current_appid'?: (number);
  'uptime'?: (string);
  'memory_bytes'?: (number | string | Long);
  'current_app_name'?: (string);
  'persona_name'?: (string);
}

export interface GetStatusResponse__Output {
  'connected': (boolean);
  'steam_id': (string);
  'current_appid': (number);
  'uptime': (string);
  'memory_bytes': (string);
  'current_app_name': (string);
  'persona_name': (string);
}
