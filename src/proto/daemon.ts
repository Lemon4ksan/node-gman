import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { DaemonServiceClient as _daemon_DaemonServiceClient, DaemonServiceDefinition as _daemon_DaemonServiceDefinition } from './daemon/DaemonService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  daemon: {
    DaemonService: SubtypeConstructor<typeof grpc.Client, _daemon_DaemonServiceClient> & { service: _daemon_DaemonServiceDefinition }
    ExecActionRequest: MessageTypeDefinition
    ExecActionResponse: MessageTypeDefinition
    ExitGameRequest: MessageTypeDefinition
    ExitGameResponse: MessageTypeDefinition
    FreeMemoryRequest: MessageTypeDefinition
    FreeMemoryResponse: MessageTypeDefinition
    GetStatusRequest: MessageTypeDefinition
    GetStatusResponse: MessageTypeDefinition
    GuardCodeRequest: MessageTypeDefinition
    GuardCodeResponse: MessageTypeDefinition
    GuardConfirmation: MessageTypeDefinition
    GuardImportRequest: MessageTypeDefinition
    GuardImportResponse: MessageTypeDefinition
    GuardListRequest: MessageTypeDefinition
    GuardListResponse: MessageTypeDefinition
    GuardRespondRequest: MessageTypeDefinition
    GuardRespondResponse: MessageTypeDefinition
    GuardStatusRequest: MessageTypeDefinition
    GuardStatusResponse: MessageTypeDefinition
    Item: MessageTypeDefinition
    ManualPriceEntry: MessageTypeDefinition
    PlayGameRequest: MessageTypeDefinition
    PlayGameResponse: MessageTypeDefinition
    StopDaemonRequest: MessageTypeDefinition
    StopDaemonResponse: MessageTypeDefinition
    StreamEventsRequest: MessageTypeDefinition
    StreamEventsResponse: MessageTypeDefinition
    UpdateManualPricesRequest: MessageTypeDefinition
    UpdateManualPricesResponse: MessageTypeDefinition
  }
}

