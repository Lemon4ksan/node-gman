// Original file: proto/daemon.proto

import type { RequestType as _daemon_RequestType, RequestType__Output as _daemon_RequestType__Output } from '../daemon/RequestType';

export interface ExecRequestRequest {
  'type'?: (_daemon_RequestType);
  'method'?: (string);
  'path'?: (string);
  'params'?: ({[key: string]: string});
  'body'?: (Buffer | Uint8Array | string);
  'is_post_form'?: (boolean);
  'version'?: (number);
  'interface'?: (string);
  'action'?: (string);
}

export interface ExecRequestRequest__Output {
  'type': (_daemon_RequestType__Output);
  'method': (string);
  'path': (string);
  'params': ({[key: string]: string});
  'body': (Buffer);
  'is_post_form': (boolean);
  'version': (number);
  'interface': (string);
  'action': (string);
}
