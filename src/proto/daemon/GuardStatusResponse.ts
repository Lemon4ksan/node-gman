// Original file: proto/daemon.proto


export interface GuardStatusResponse {
  'configured'?: (boolean);
  'device_id'?: (string);
  'steam_id'?: (string);
  'state'?: (number);
  'shared_secret'?: (string);
  'uri'?: (string);
  'account_name'?: (string);
}

export interface GuardStatusResponse__Output {
  'configured': (boolean);
  'device_id': (string);
  'steam_id': (string);
  'state': (number);
  'shared_secret': (string);
  'uri': (string);
  'account_name': (string);
}
