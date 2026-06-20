// Original file: proto/daemon.proto

import type { ManualPriceEntry as _daemon_ManualPriceEntry, ManualPriceEntry__Output as _daemon_ManualPriceEntry__Output } from '../daemon/ManualPriceEntry';

export interface UpdateManualPricesRequest {
  'prices'?: ({[key: string]: _daemon_ManualPriceEntry});
}

export interface UpdateManualPricesRequest__Output {
  'prices': ({[key: string]: _daemon_ManualPriceEntry__Output});
}
