// Original file: proto/daemon.proto


export interface GuardImportRequest {
  'shared_secret'?: (string);
  'identity_secret'?: (string);
  'device_id'?: (string);
  'account_name'?: (string);
  'refresh_token'?: (string);
}

export interface GuardImportRequest__Output {
  'shared_secret': (string);
  'identity_secret': (string);
  'device_id': (string);
  'account_name': (string);
  'refresh_token': (string);
}
