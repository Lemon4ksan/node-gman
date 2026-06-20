// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface FreeMemoryResponse {
  'message'?: (string);
  'memory_bytes'?: (number | string | Long);
}

export interface FreeMemoryResponse__Output {
  'message': (string);
  'memory_bytes': (string);
}
