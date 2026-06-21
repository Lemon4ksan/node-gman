// Original file: proto/daemon.proto


export interface ExecRequestResponse {
  'success'?: (boolean);
  'message'?: (string);
  'body'?: (Buffer | Uint8Array | string);
  'status_code'?: (number);
  'eresult'?: (number);
  'headers'?: ({[key: string]: string});
}

export interface ExecRequestResponse__Output {
  'success': (boolean);
  'message': (string);
  'body': (Buffer);
  'status_code': (number);
  'eresult': (number);
  'headers': ({[key: string]: string});
}
