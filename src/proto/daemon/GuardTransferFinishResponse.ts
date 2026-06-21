// Original file: proto/daemon.proto


export interface GuardTransferFinishResponse {
  'success'?: (boolean);
  'shared_secret'?: (string);
  'identity_secret'?: (string);
  'revocation_code'?: (string);
  'device_id'?: (string);
  'uri'?: (string);
}

export interface GuardTransferFinishResponse__Output {
  'success': (boolean);
  'shared_secret': (string);
  'identity_secret': (string);
  'revocation_code': (string);
  'device_id': (string);
  'uri': (string);
}
