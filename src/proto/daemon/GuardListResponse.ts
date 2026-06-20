// Original file: proto/daemon.proto

import type { GuardConfirmation as _daemon_GuardConfirmation, GuardConfirmation__Output as _daemon_GuardConfirmation__Output } from '../daemon/GuardConfirmation';

export interface GuardListResponse {
  'confirmations'?: (_daemon_GuardConfirmation)[];
}

export interface GuardListResponse__Output {
  'confirmations': (_daemon_GuardConfirmation__Output)[];
}
