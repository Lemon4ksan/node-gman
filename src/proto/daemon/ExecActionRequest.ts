// Original file: proto/daemon.proto


export interface ExecActionRequest {
  'appid'?: (number);
  'action'?: (string);
  'params'?: ({[key: string]: string});
}

export interface ExecActionRequest__Output {
  'appid': (number);
  'action': (string);
  'params': ({[key: string]: string});
}
