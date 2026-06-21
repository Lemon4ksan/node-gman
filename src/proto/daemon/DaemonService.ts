// Original file: proto/daemon.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ExecActionRequest as _daemon_ExecActionRequest, ExecActionRequest__Output as _daemon_ExecActionRequest__Output } from '../daemon/ExecActionRequest';
import type { ExecActionResponse as _daemon_ExecActionResponse, ExecActionResponse__Output as _daemon_ExecActionResponse__Output } from '../daemon/ExecActionResponse';
import type { ExecRequestRequest as _daemon_ExecRequestRequest, ExecRequestRequest__Output as _daemon_ExecRequestRequest__Output } from '../daemon/ExecRequestRequest';
import type { ExecRequestResponse as _daemon_ExecRequestResponse, ExecRequestResponse__Output as _daemon_ExecRequestResponse__Output } from '../daemon/ExecRequestResponse';
import type { ExitGameRequest as _daemon_ExitGameRequest, ExitGameRequest__Output as _daemon_ExitGameRequest__Output } from '../daemon/ExitGameRequest';
import type { ExitGameResponse as _daemon_ExitGameResponse, ExitGameResponse__Output as _daemon_ExitGameResponse__Output } from '../daemon/ExitGameResponse';
import type { FreeMemoryRequest as _daemon_FreeMemoryRequest, FreeMemoryRequest__Output as _daemon_FreeMemoryRequest__Output } from '../daemon/FreeMemoryRequest';
import type { FreeMemoryResponse as _daemon_FreeMemoryResponse, FreeMemoryResponse__Output as _daemon_FreeMemoryResponse__Output } from '../daemon/FreeMemoryResponse';
import type { GetStatusRequest as _daemon_GetStatusRequest, GetStatusRequest__Output as _daemon_GetStatusRequest__Output } from '../daemon/GetStatusRequest';
import type { GetStatusResponse as _daemon_GetStatusResponse, GetStatusResponse__Output as _daemon_GetStatusResponse__Output } from '../daemon/GetStatusResponse';
import type { GuardCodeRequest as _daemon_GuardCodeRequest, GuardCodeRequest__Output as _daemon_GuardCodeRequest__Output } from '../daemon/GuardCodeRequest';
import type { GuardCodeResponse as _daemon_GuardCodeResponse, GuardCodeResponse__Output as _daemon_GuardCodeResponse__Output } from '../daemon/GuardCodeResponse';
import type { GuardImportRequest as _daemon_GuardImportRequest, GuardImportRequest__Output as _daemon_GuardImportRequest__Output } from '../daemon/GuardImportRequest';
import type { GuardImportResponse as _daemon_GuardImportResponse, GuardImportResponse__Output as _daemon_GuardImportResponse__Output } from '../daemon/GuardImportResponse';
import type { GuardLinkFinalizeRequest as _daemon_GuardLinkFinalizeRequest, GuardLinkFinalizeRequest__Output as _daemon_GuardLinkFinalizeRequest__Output } from '../daemon/GuardLinkFinalizeRequest';
import type { GuardLinkFinalizeResponse as _daemon_GuardLinkFinalizeResponse, GuardLinkFinalizeResponse__Output as _daemon_GuardLinkFinalizeResponse__Output } from '../daemon/GuardLinkFinalizeResponse';
import type { GuardLinkStartRequest as _daemon_GuardLinkStartRequest, GuardLinkStartRequest__Output as _daemon_GuardLinkStartRequest__Output } from '../daemon/GuardLinkStartRequest';
import type { GuardLinkStartResponse as _daemon_GuardLinkStartResponse, GuardLinkStartResponse__Output as _daemon_GuardLinkStartResponse__Output } from '../daemon/GuardLinkStartResponse';
import type { GuardListRequest as _daemon_GuardListRequest, GuardListRequest__Output as _daemon_GuardListRequest__Output } from '../daemon/GuardListRequest';
import type { GuardListResponse as _daemon_GuardListResponse, GuardListResponse__Output as _daemon_GuardListResponse__Output } from '../daemon/GuardListResponse';
import type { GuardRespondRequest as _daemon_GuardRespondRequest, GuardRespondRequest__Output as _daemon_GuardRespondRequest__Output } from '../daemon/GuardRespondRequest';
import type { GuardRespondResponse as _daemon_GuardRespondResponse, GuardRespondResponse__Output as _daemon_GuardRespondResponse__Output } from '../daemon/GuardRespondResponse';
import type { GuardStatusRequest as _daemon_GuardStatusRequest, GuardStatusRequest__Output as _daemon_GuardStatusRequest__Output } from '../daemon/GuardStatusRequest';
import type { GuardStatusResponse as _daemon_GuardStatusResponse, GuardStatusResponse__Output as _daemon_GuardStatusResponse__Output } from '../daemon/GuardStatusResponse';
import type { GuardSubmitAuthCodeRequest as _daemon_GuardSubmitAuthCodeRequest, GuardSubmitAuthCodeRequest__Output as _daemon_GuardSubmitAuthCodeRequest__Output } from '../daemon/GuardSubmitAuthCodeRequest';
import type { GuardSubmitAuthCodeResponse as _daemon_GuardSubmitAuthCodeResponse, GuardSubmitAuthCodeResponse__Output as _daemon_GuardSubmitAuthCodeResponse__Output } from '../daemon/GuardSubmitAuthCodeResponse';
import type { GuardTransferFinishRequest as _daemon_GuardTransferFinishRequest, GuardTransferFinishRequest__Output as _daemon_GuardTransferFinishRequest__Output } from '../daemon/GuardTransferFinishRequest';
import type { GuardTransferFinishResponse as _daemon_GuardTransferFinishResponse, GuardTransferFinishResponse__Output as _daemon_GuardTransferFinishResponse__Output } from '../daemon/GuardTransferFinishResponse';
import type { GuardTransferStartRequest as _daemon_GuardTransferStartRequest, GuardTransferStartRequest__Output as _daemon_GuardTransferStartRequest__Output } from '../daemon/GuardTransferStartRequest';
import type { GuardTransferStartResponse as _daemon_GuardTransferStartResponse, GuardTransferStartResponse__Output as _daemon_GuardTransferStartResponse__Output } from '../daemon/GuardTransferStartResponse';
import type { GuardUnlockRequest as _daemon_GuardUnlockRequest, GuardUnlockRequest__Output as _daemon_GuardUnlockRequest__Output } from '../daemon/GuardUnlockRequest';
import type { GuardUnlockResponse as _daemon_GuardUnlockResponse, GuardUnlockResponse__Output as _daemon_GuardUnlockResponse__Output } from '../daemon/GuardUnlockResponse';
import type { PlayGameRequest as _daemon_PlayGameRequest, PlayGameRequest__Output as _daemon_PlayGameRequest__Output } from '../daemon/PlayGameRequest';
import type { PlayGameResponse as _daemon_PlayGameResponse, PlayGameResponse__Output as _daemon_PlayGameResponse__Output } from '../daemon/PlayGameResponse';
import type { SetFriendNicknameRequest as _daemon_SetFriendNicknameRequest, SetFriendNicknameRequest__Output as _daemon_SetFriendNicknameRequest__Output } from '../daemon/SetFriendNicknameRequest';
import type { SetFriendNicknameResponse as _daemon_SetFriendNicknameResponse, SetFriendNicknameResponse__Output as _daemon_SetFriendNicknameResponse__Output } from '../daemon/SetFriendNicknameResponse';
import type { StopDaemonRequest as _daemon_StopDaemonRequest, StopDaemonRequest__Output as _daemon_StopDaemonRequest__Output } from '../daemon/StopDaemonRequest';
import type { StopDaemonResponse as _daemon_StopDaemonResponse, StopDaemonResponse__Output as _daemon_StopDaemonResponse__Output } from '../daemon/StopDaemonResponse';
import type { StreamEventsRequest as _daemon_StreamEventsRequest, StreamEventsRequest__Output as _daemon_StreamEventsRequest__Output } from '../daemon/StreamEventsRequest';
import type { StreamEventsResponse as _daemon_StreamEventsResponse, StreamEventsResponse__Output as _daemon_StreamEventsResponse__Output } from '../daemon/StreamEventsResponse';
import type { UpdateManualPricesRequest as _daemon_UpdateManualPricesRequest, UpdateManualPricesRequest__Output as _daemon_UpdateManualPricesRequest__Output } from '../daemon/UpdateManualPricesRequest';
import type { UpdateManualPricesResponse as _daemon_UpdateManualPricesResponse, UpdateManualPricesResponse__Output as _daemon_UpdateManualPricesResponse__Output } from '../daemon/UpdateManualPricesResponse';

export interface DaemonServiceClient extends grpc.Client {
  ExecAction(argument: _daemon_ExecActionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  ExecAction(argument: _daemon_ExecActionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  ExecAction(argument: _daemon_ExecActionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  ExecAction(argument: _daemon_ExecActionRequest, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  execAction(argument: _daemon_ExecActionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  execAction(argument: _daemon_ExecActionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  execAction(argument: _daemon_ExecActionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  execAction(argument: _daemon_ExecActionRequest, callback: grpc.requestCallback<_daemon_ExecActionResponse__Output>): grpc.ClientUnaryCall;
  
  ExecRequest(argument: _daemon_ExecRequestRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  ExecRequest(argument: _daemon_ExecRequestRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  ExecRequest(argument: _daemon_ExecRequestRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  ExecRequest(argument: _daemon_ExecRequestRequest, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  execRequest(argument: _daemon_ExecRequestRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  execRequest(argument: _daemon_ExecRequestRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  execRequest(argument: _daemon_ExecRequestRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  execRequest(argument: _daemon_ExecRequestRequest, callback: grpc.requestCallback<_daemon_ExecRequestResponse__Output>): grpc.ClientUnaryCall;
  
  ExitGame(argument: _daemon_ExitGameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  ExitGame(argument: _daemon_ExitGameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  ExitGame(argument: _daemon_ExitGameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  ExitGame(argument: _daemon_ExitGameRequest, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  exitGame(argument: _daemon_ExitGameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  exitGame(argument: _daemon_ExitGameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  exitGame(argument: _daemon_ExitGameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  exitGame(argument: _daemon_ExitGameRequest, callback: grpc.requestCallback<_daemon_ExitGameResponse__Output>): grpc.ClientUnaryCall;
  
  FreeMemory(argument: _daemon_FreeMemoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  FreeMemory(argument: _daemon_FreeMemoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  FreeMemory(argument: _daemon_FreeMemoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  FreeMemory(argument: _daemon_FreeMemoryRequest, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  freeMemory(argument: _daemon_FreeMemoryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  freeMemory(argument: _daemon_FreeMemoryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  freeMemory(argument: _daemon_FreeMemoryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  freeMemory(argument: _daemon_FreeMemoryRequest, callback: grpc.requestCallback<_daemon_FreeMemoryResponse__Output>): grpc.ClientUnaryCall;
  
  GetStatus(argument: _daemon_GetStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  GetStatus(argument: _daemon_GetStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  GetStatus(argument: _daemon_GetStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  GetStatus(argument: _daemon_GetStatusRequest, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _daemon_GetStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _daemon_GetStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _daemon_GetStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _daemon_GetStatusRequest, callback: grpc.requestCallback<_daemon_GetStatusResponse__Output>): grpc.ClientUnaryCall;
  
  GuardCode(argument: _daemon_GuardCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  GuardCode(argument: _daemon_GuardCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  GuardCode(argument: _daemon_GuardCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  GuardCode(argument: _daemon_GuardCodeRequest, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  guardCode(argument: _daemon_GuardCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  guardCode(argument: _daemon_GuardCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  guardCode(argument: _daemon_GuardCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  guardCode(argument: _daemon_GuardCodeRequest, callback: grpc.requestCallback<_daemon_GuardCodeResponse__Output>): grpc.ClientUnaryCall;
  
  GuardImport(argument: _daemon_GuardImportRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  GuardImport(argument: _daemon_GuardImportRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  GuardImport(argument: _daemon_GuardImportRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  GuardImport(argument: _daemon_GuardImportRequest, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  guardImport(argument: _daemon_GuardImportRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  guardImport(argument: _daemon_GuardImportRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  guardImport(argument: _daemon_GuardImportRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  guardImport(argument: _daemon_GuardImportRequest, callback: grpc.requestCallback<_daemon_GuardImportResponse__Output>): grpc.ClientUnaryCall;
  
  GuardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  GuardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  GuardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  GuardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  guardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  guardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  guardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  guardLinkFinalize(argument: _daemon_GuardLinkFinalizeRequest, callback: grpc.requestCallback<_daemon_GuardLinkFinalizeResponse__Output>): grpc.ClientUnaryCall;
  
  GuardLinkStart(argument: _daemon_GuardLinkStartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  GuardLinkStart(argument: _daemon_GuardLinkStartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  GuardLinkStart(argument: _daemon_GuardLinkStartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  GuardLinkStart(argument: _daemon_GuardLinkStartRequest, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  guardLinkStart(argument: _daemon_GuardLinkStartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  guardLinkStart(argument: _daemon_GuardLinkStartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  guardLinkStart(argument: _daemon_GuardLinkStartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  guardLinkStart(argument: _daemon_GuardLinkStartRequest, callback: grpc.requestCallback<_daemon_GuardLinkStartResponse__Output>): grpc.ClientUnaryCall;
  
  GuardList(argument: _daemon_GuardListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  GuardList(argument: _daemon_GuardListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  GuardList(argument: _daemon_GuardListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  GuardList(argument: _daemon_GuardListRequest, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  guardList(argument: _daemon_GuardListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  guardList(argument: _daemon_GuardListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  guardList(argument: _daemon_GuardListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  guardList(argument: _daemon_GuardListRequest, callback: grpc.requestCallback<_daemon_GuardListResponse__Output>): grpc.ClientUnaryCall;
  
  GuardRespond(argument: _daemon_GuardRespondRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  GuardRespond(argument: _daemon_GuardRespondRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  GuardRespond(argument: _daemon_GuardRespondRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  GuardRespond(argument: _daemon_GuardRespondRequest, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  guardRespond(argument: _daemon_GuardRespondRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  guardRespond(argument: _daemon_GuardRespondRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  guardRespond(argument: _daemon_GuardRespondRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  guardRespond(argument: _daemon_GuardRespondRequest, callback: grpc.requestCallback<_daemon_GuardRespondResponse__Output>): grpc.ClientUnaryCall;
  
  GuardStatus(argument: _daemon_GuardStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  GuardStatus(argument: _daemon_GuardStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  GuardStatus(argument: _daemon_GuardStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  GuardStatus(argument: _daemon_GuardStatusRequest, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  guardStatus(argument: _daemon_GuardStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  guardStatus(argument: _daemon_GuardStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  guardStatus(argument: _daemon_GuardStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  guardStatus(argument: _daemon_GuardStatusRequest, callback: grpc.requestCallback<_daemon_GuardStatusResponse__Output>): grpc.ClientUnaryCall;
  
  GuardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  GuardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  GuardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  GuardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  guardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  guardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  guardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  guardSubmitAuthCode(argument: _daemon_GuardSubmitAuthCodeRequest, callback: grpc.requestCallback<_daemon_GuardSubmitAuthCodeResponse__Output>): grpc.ClientUnaryCall;
  
  GuardTransferFinish(argument: _daemon_GuardTransferFinishRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  GuardTransferFinish(argument: _daemon_GuardTransferFinishRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  GuardTransferFinish(argument: _daemon_GuardTransferFinishRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  GuardTransferFinish(argument: _daemon_GuardTransferFinishRequest, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  guardTransferFinish(argument: _daemon_GuardTransferFinishRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  guardTransferFinish(argument: _daemon_GuardTransferFinishRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  guardTransferFinish(argument: _daemon_GuardTransferFinishRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  guardTransferFinish(argument: _daemon_GuardTransferFinishRequest, callback: grpc.requestCallback<_daemon_GuardTransferFinishResponse__Output>): grpc.ClientUnaryCall;
  
  GuardTransferStart(argument: _daemon_GuardTransferStartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  GuardTransferStart(argument: _daemon_GuardTransferStartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  GuardTransferStart(argument: _daemon_GuardTransferStartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  GuardTransferStart(argument: _daemon_GuardTransferStartRequest, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  guardTransferStart(argument: _daemon_GuardTransferStartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  guardTransferStart(argument: _daemon_GuardTransferStartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  guardTransferStart(argument: _daemon_GuardTransferStartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  guardTransferStart(argument: _daemon_GuardTransferStartRequest, callback: grpc.requestCallback<_daemon_GuardTransferStartResponse__Output>): grpc.ClientUnaryCall;
  
  GuardUnlock(argument: _daemon_GuardUnlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  GuardUnlock(argument: _daemon_GuardUnlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  GuardUnlock(argument: _daemon_GuardUnlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  GuardUnlock(argument: _daemon_GuardUnlockRequest, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  guardUnlock(argument: _daemon_GuardUnlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  guardUnlock(argument: _daemon_GuardUnlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  guardUnlock(argument: _daemon_GuardUnlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  guardUnlock(argument: _daemon_GuardUnlockRequest, callback: grpc.requestCallback<_daemon_GuardUnlockResponse__Output>): grpc.ClientUnaryCall;
  
  PlayGame(argument: _daemon_PlayGameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  PlayGame(argument: _daemon_PlayGameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  PlayGame(argument: _daemon_PlayGameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  PlayGame(argument: _daemon_PlayGameRequest, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  playGame(argument: _daemon_PlayGameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  playGame(argument: _daemon_PlayGameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  playGame(argument: _daemon_PlayGameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  playGame(argument: _daemon_PlayGameRequest, callback: grpc.requestCallback<_daemon_PlayGameResponse__Output>): grpc.ClientUnaryCall;
  
  SetFriendNickname(argument: _daemon_SetFriendNicknameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  SetFriendNickname(argument: _daemon_SetFriendNicknameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  SetFriendNickname(argument: _daemon_SetFriendNicknameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  SetFriendNickname(argument: _daemon_SetFriendNicknameRequest, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  setFriendNickname(argument: _daemon_SetFriendNicknameRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  setFriendNickname(argument: _daemon_SetFriendNicknameRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  setFriendNickname(argument: _daemon_SetFriendNicknameRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  setFriendNickname(argument: _daemon_SetFriendNicknameRequest, callback: grpc.requestCallback<_daemon_SetFriendNicknameResponse__Output>): grpc.ClientUnaryCall;
  
  StopDaemon(argument: _daemon_StopDaemonRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  StopDaemon(argument: _daemon_StopDaemonRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  StopDaemon(argument: _daemon_StopDaemonRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  StopDaemon(argument: _daemon_StopDaemonRequest, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  stopDaemon(argument: _daemon_StopDaemonRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  stopDaemon(argument: _daemon_StopDaemonRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  stopDaemon(argument: _daemon_StopDaemonRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  stopDaemon(argument: _daemon_StopDaemonRequest, callback: grpc.requestCallback<_daemon_StopDaemonResponse__Output>): grpc.ClientUnaryCall;
  
  StreamEvents(argument: _daemon_StreamEventsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_daemon_StreamEventsResponse__Output>;
  StreamEvents(argument: _daemon_StreamEventsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_daemon_StreamEventsResponse__Output>;
  streamEvents(argument: _daemon_StreamEventsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_daemon_StreamEventsResponse__Output>;
  streamEvents(argument: _daemon_StreamEventsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_daemon_StreamEventsResponse__Output>;
  
  UpdateManualPrices(argument: _daemon_UpdateManualPricesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  UpdateManualPrices(argument: _daemon_UpdateManualPricesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  UpdateManualPrices(argument: _daemon_UpdateManualPricesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  UpdateManualPrices(argument: _daemon_UpdateManualPricesRequest, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  updateManualPrices(argument: _daemon_UpdateManualPricesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  updateManualPrices(argument: _daemon_UpdateManualPricesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  updateManualPrices(argument: _daemon_UpdateManualPricesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  updateManualPrices(argument: _daemon_UpdateManualPricesRequest, callback: grpc.requestCallback<_daemon_UpdateManualPricesResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface DaemonServiceHandlers extends grpc.UntypedServiceImplementation {
  ExecAction: grpc.handleUnaryCall<_daemon_ExecActionRequest__Output, _daemon_ExecActionResponse>;
  
  ExecRequest: grpc.handleUnaryCall<_daemon_ExecRequestRequest__Output, _daemon_ExecRequestResponse>;
  
  ExitGame: grpc.handleUnaryCall<_daemon_ExitGameRequest__Output, _daemon_ExitGameResponse>;
  
  FreeMemory: grpc.handleUnaryCall<_daemon_FreeMemoryRequest__Output, _daemon_FreeMemoryResponse>;
  
  GetStatus: grpc.handleUnaryCall<_daemon_GetStatusRequest__Output, _daemon_GetStatusResponse>;
  
  GuardCode: grpc.handleUnaryCall<_daemon_GuardCodeRequest__Output, _daemon_GuardCodeResponse>;
  
  GuardImport: grpc.handleUnaryCall<_daemon_GuardImportRequest__Output, _daemon_GuardImportResponse>;
  
  GuardLinkFinalize: grpc.handleUnaryCall<_daemon_GuardLinkFinalizeRequest__Output, _daemon_GuardLinkFinalizeResponse>;
  
  GuardLinkStart: grpc.handleUnaryCall<_daemon_GuardLinkStartRequest__Output, _daemon_GuardLinkStartResponse>;
  
  GuardList: grpc.handleUnaryCall<_daemon_GuardListRequest__Output, _daemon_GuardListResponse>;
  
  GuardRespond: grpc.handleUnaryCall<_daemon_GuardRespondRequest__Output, _daemon_GuardRespondResponse>;
  
  GuardStatus: grpc.handleUnaryCall<_daemon_GuardStatusRequest__Output, _daemon_GuardStatusResponse>;
  
  GuardSubmitAuthCode: grpc.handleUnaryCall<_daemon_GuardSubmitAuthCodeRequest__Output, _daemon_GuardSubmitAuthCodeResponse>;
  
  GuardTransferFinish: grpc.handleUnaryCall<_daemon_GuardTransferFinishRequest__Output, _daemon_GuardTransferFinishResponse>;
  
  GuardTransferStart: grpc.handleUnaryCall<_daemon_GuardTransferStartRequest__Output, _daemon_GuardTransferStartResponse>;
  
  GuardUnlock: grpc.handleUnaryCall<_daemon_GuardUnlockRequest__Output, _daemon_GuardUnlockResponse>;
  
  PlayGame: grpc.handleUnaryCall<_daemon_PlayGameRequest__Output, _daemon_PlayGameResponse>;
  
  SetFriendNickname: grpc.handleUnaryCall<_daemon_SetFriendNicknameRequest__Output, _daemon_SetFriendNicknameResponse>;
  
  StopDaemon: grpc.handleUnaryCall<_daemon_StopDaemonRequest__Output, _daemon_StopDaemonResponse>;
  
  StreamEvents: grpc.handleServerStreamingCall<_daemon_StreamEventsRequest__Output, _daemon_StreamEventsResponse>;
  
  UpdateManualPrices: grpc.handleUnaryCall<_daemon_UpdateManualPricesRequest__Output, _daemon_UpdateManualPricesResponse>;
  
}

export interface DaemonServiceDefinition extends grpc.ServiceDefinition {
  ExecAction: MethodDefinition<_daemon_ExecActionRequest, _daemon_ExecActionResponse, _daemon_ExecActionRequest__Output, _daemon_ExecActionResponse__Output>
  ExecRequest: MethodDefinition<_daemon_ExecRequestRequest, _daemon_ExecRequestResponse, _daemon_ExecRequestRequest__Output, _daemon_ExecRequestResponse__Output>
  ExitGame: MethodDefinition<_daemon_ExitGameRequest, _daemon_ExitGameResponse, _daemon_ExitGameRequest__Output, _daemon_ExitGameResponse__Output>
  FreeMemory: MethodDefinition<_daemon_FreeMemoryRequest, _daemon_FreeMemoryResponse, _daemon_FreeMemoryRequest__Output, _daemon_FreeMemoryResponse__Output>
  GetStatus: MethodDefinition<_daemon_GetStatusRequest, _daemon_GetStatusResponse, _daemon_GetStatusRequest__Output, _daemon_GetStatusResponse__Output>
  GuardCode: MethodDefinition<_daemon_GuardCodeRequest, _daemon_GuardCodeResponse, _daemon_GuardCodeRequest__Output, _daemon_GuardCodeResponse__Output>
  GuardImport: MethodDefinition<_daemon_GuardImportRequest, _daemon_GuardImportResponse, _daemon_GuardImportRequest__Output, _daemon_GuardImportResponse__Output>
  GuardLinkFinalize: MethodDefinition<_daemon_GuardLinkFinalizeRequest, _daemon_GuardLinkFinalizeResponse, _daemon_GuardLinkFinalizeRequest__Output, _daemon_GuardLinkFinalizeResponse__Output>
  GuardLinkStart: MethodDefinition<_daemon_GuardLinkStartRequest, _daemon_GuardLinkStartResponse, _daemon_GuardLinkStartRequest__Output, _daemon_GuardLinkStartResponse__Output>
  GuardList: MethodDefinition<_daemon_GuardListRequest, _daemon_GuardListResponse, _daemon_GuardListRequest__Output, _daemon_GuardListResponse__Output>
  GuardRespond: MethodDefinition<_daemon_GuardRespondRequest, _daemon_GuardRespondResponse, _daemon_GuardRespondRequest__Output, _daemon_GuardRespondResponse__Output>
  GuardStatus: MethodDefinition<_daemon_GuardStatusRequest, _daemon_GuardStatusResponse, _daemon_GuardStatusRequest__Output, _daemon_GuardStatusResponse__Output>
  GuardSubmitAuthCode: MethodDefinition<_daemon_GuardSubmitAuthCodeRequest, _daemon_GuardSubmitAuthCodeResponse, _daemon_GuardSubmitAuthCodeRequest__Output, _daemon_GuardSubmitAuthCodeResponse__Output>
  GuardTransferFinish: MethodDefinition<_daemon_GuardTransferFinishRequest, _daemon_GuardTransferFinishResponse, _daemon_GuardTransferFinishRequest__Output, _daemon_GuardTransferFinishResponse__Output>
  GuardTransferStart: MethodDefinition<_daemon_GuardTransferStartRequest, _daemon_GuardTransferStartResponse, _daemon_GuardTransferStartRequest__Output, _daemon_GuardTransferStartResponse__Output>
  GuardUnlock: MethodDefinition<_daemon_GuardUnlockRequest, _daemon_GuardUnlockResponse, _daemon_GuardUnlockRequest__Output, _daemon_GuardUnlockResponse__Output>
  PlayGame: MethodDefinition<_daemon_PlayGameRequest, _daemon_PlayGameResponse, _daemon_PlayGameRequest__Output, _daemon_PlayGameResponse__Output>
  SetFriendNickname: MethodDefinition<_daemon_SetFriendNicknameRequest, _daemon_SetFriendNicknameResponse, _daemon_SetFriendNicknameRequest__Output, _daemon_SetFriendNicknameResponse__Output>
  StopDaemon: MethodDefinition<_daemon_StopDaemonRequest, _daemon_StopDaemonResponse, _daemon_StopDaemonRequest__Output, _daemon_StopDaemonResponse__Output>
  StreamEvents: MethodDefinition<_daemon_StreamEventsRequest, _daemon_StreamEventsResponse, _daemon_StreamEventsRequest__Output, _daemon_StreamEventsResponse__Output>
  UpdateManualPrices: MethodDefinition<_daemon_UpdateManualPricesRequest, _daemon_UpdateManualPricesResponse, _daemon_UpdateManualPricesRequest__Output, _daemon_UpdateManualPricesResponse__Output>
}
