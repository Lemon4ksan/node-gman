import { RequestType } from "./proto/daemon/RequestType";

export { RequestType };

export interface FreeMemoryResponse {
  message: string;
  memory_bytes: string;
}

export interface GetStatusResponse {
  connected: boolean;
  steam_id: string;
  current_appid: number;
  uptime: string;
  memory_bytes: string;
  current_app_name: string;
  persona_name: string;
}

export interface StopDaemonResponse {
  message: string;
}

export interface PlayGameRequest {
  appid: number;
}

export interface PlayGameResponse {
  message: string;
}

export interface ExitGameResponse {
  message: string;
}

export interface Item {
  asset_id: string;
  def_index: number;
  quality: number;
  quantity: number;
  is_tradable: boolean;
  is_craftable: boolean;
  attributes: Record<string, string>;
  original_id: string;
}

export interface ExecActionRequest {
  appid: number;
  action: string;
  params: Record<string, string>;
}

export interface ExecActionResponse {
  message: string;
  items: Item[];
  details: string;
}

export interface StreamEventsResponse {
  event_id: string;
  event_type: string;
  payload_json: string;
  timestamp: string;
}

export interface ManualPriceEntry {
  buy_keys: number;
  buy_metal: number;
  sell_keys: number;
  sell_metal: number;
}

export interface UpdateManualPricesRequest {
  prices: Record<string, ManualPriceEntry>;
}

export interface UpdateManualPricesResponse {
  message: string;
  success: boolean;
}

export interface GuardCodeResponse {
  code: string;
}

export interface GuardConfirmation {
  id: string;
  nonce: string;
  title: string;
  type_name: string;
  description: string;
}

export interface GuardListResponse {
  confirmations: GuardConfirmation[];
}

export interface GuardRespondRequest {
  confirmation_id: string;
  accept: boolean;
  all: boolean;
}

export interface GuardRespondResponse {
  success: boolean;
  message: string;
}

export interface GuardStatusResponse {
  configured: boolean;
  device_id: string;
  steam_id: string;
  state: number;
  shared_secret: string;
  uri: string;
  account_name: string;
}

export interface GuardImportRequest {
  shared_secret: string;
  identity_secret: string;
  device_id: string;
  account_name: string;
  refresh_token: string;
}

export interface GuardImportResponse {
  success: boolean;
  message: string;
}

export interface TradeOfferItem {
  appid: number;
  contextid: string;
  assetid: string;
  amount: number;
}

export interface TradeOffer {
  tradeofferid: string;
  partner: string;
  trade_offer_state: number;
  items_to_give?: TradeOfferItem[];
  items_to_receive?: TradeOfferItem[];
  message?: string;
  created?: number;
  updated?: number;
  expires?: number;
  trade_hold_reason?: number;
  confirmation_method?: number;
  is_our_offer?: boolean;
  data?: Record<string, unknown>;
}

export interface PollData {
  sent: Record<string, number>;
  received: Record<string, number>;
  offerData: Record<string, Record<string, unknown>>;
}

export interface SendOfferParams {
  partner_id: string;
  items_to_give?: TradeOfferItem[];
  items_to_receive?: TradeOfferItem[];
  message?: string;
  token?: string;
  trade_offer_context?: Record<string, unknown>;
}

export interface SendOfferResponse {
  tradeofferid: string;
  needs_mobile_confirmation?: boolean;
}

export interface ActiveOffersResponse {
  offers: TradeOffer[];
}

export interface ExecRequestRequest {
  type: RequestType;
  method?: string;
  path?: string;
  params?: Record<string, string>;
  body?: string | Buffer | Uint8Array;
  is_post_form?: boolean;
  version?: number;
  interface?: string;
  action?: string;
}

export interface ExecRequestResponse {
  success: boolean;
  message: string;
  body: string | Buffer | Uint8Array;
  status_code: number;
  eresult: number;
  headers: Record<string, string>;
}

export interface SetFriendNicknameRequest {
  steam_id: string;
  nickname: string;
}

export interface SetFriendNicknameResponse {
  success: boolean;
  message: string;
}

export interface GuardUnlockRequest {
  passphrase: string;
}

export interface GuardUnlockResponse {
  success: boolean;
  message: string;
}

export interface GuardTransferStartResponse {
  success: boolean;
  message: string;
}

export interface GuardTransferFinishRequest {
  sms_code: string;
}

export interface GuardTransferFinishResponse {
  success: boolean;
  shared_secret: string;
  identity_secret: string;
  revocation_code: string;
  device_id: string;
  uri: string;
}

export interface GuardLinkStartRequest {
  device_id: string;
}

export interface GuardLinkStartResponse {
  success: boolean;
  shared_secret: string;
  identity_secret: string;
  revocation_code: string;
  device_id: string;
  uri: string;
  phone_number_hint: string;
  server_time: string;
}

export interface GuardLinkFinalizeRequest {
  shared_secret: string;
  server_time: string;
  sms_code: string;
  identity_secret: string;
  device_id: string;
}

export interface GuardLinkFinalizeResponse {
  success: boolean;
  message: string;
}

export interface GuardSubmitAuthCodeRequest {
  code: string;
}

export interface GuardSubmitAuthCodeResponse {
  success: boolean;
  message: string;
}
