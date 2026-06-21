// Original file: proto/daemon.proto

import type { Long } from '@grpc/proto-loader';

export interface GetStatusResponse {
  'connected'?: (boolean);
  'steam_id'?: (string);
  'current_appid'?: (number);
  'uptime'?: (string);
  'memory_bytes'?: (number | string | Long);
  'current_app_name'?: (string);
  'locked'?: (boolean);
  'persona_name'?: (string);
  'ip_country'?: (string);
  'wallet_balance'?: (number | string | Long);
  'wallet_currency'?: (string);
  'is_limited'?: (boolean);
  'is_community_banned'?: (boolean);
  'vac_bans_count'?: (number);
  'email_address'?: (string);
}

export interface GetStatusResponse__Output {
  'connected': (boolean);
  'steam_id': (string);
  'current_appid': (number);
  'uptime': (string);
  'memory_bytes': (string);
  'current_app_name': (string);
  'locked': (boolean);
  'persona_name': (string);
  'ip_country': (string);
  'wallet_balance': (string);
  'wallet_currency': (string);
  'is_limited': (boolean);
  'is_community_banned': (boolean);
  'vac_bans_count': (number);
  'email_address': (string);
}
