// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface SetFriendNicknameRequest {
  'steam_id'?: (number | string | Long);
  'nickname'?: (string);
}

export interface SetFriendNicknameRequest__Output {
  'steam_id': (string);
  'nickname': (string);
}
