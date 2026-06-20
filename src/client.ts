import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import * as os from 'os';
import * as dotenv from 'dotenv';
import {
  FreeMemoryResponse,
  GetStatusResponse,
  StopDaemonResponse,
  PlayGameResponse,
  ExitGameResponse,
  ExecActionResponse,
  StreamEventsResponse,
  ManualPriceEntry,
  UpdateManualPricesResponse,
  GuardCodeResponse,
  GuardListResponse,
  GuardRespondResponse,
  GuardStatusResponse,
  GuardImportResponse,
} from './types';

import { ProtoGrpcType } from './proto/daemon';
import { DaemonServiceClient } from './proto/daemon/DaemonService';

dotenv.config();

export interface GManClientOptions {
  netType?: 'tcp' | 'unix';
  address?: string;
}

export class GManClient {
  private client: DaemonServiceClient;

  constructor(options: GManClientOptions = {}) {
    let netType = options.netType || process.env.GMAN_IPC_NET;
    let address = options.address || process.env.GMAN_IPC_ADDR;

    if (!netType) {
      if (os.platform() === 'win32') {
        netType = 'tcp';
      } else {
        netType = 'unix';
      }
    }

    if (!address) {
      if (netType === 'tcp') {
        address = '127.0.0.1:50051';
      } else {
        const home = os.homedir();
        if (home) {
          address = path.join(home, '.config', 'gman', 'gman.sock');
        } else {
          address = 'gman.sock';
        }
      }
    }

    const target = netType === 'unix' ? `unix:${address}` : address;

    // Load protobuf definition
    const protoPath = path.resolve(__dirname, '../proto/daemon.proto');
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
    const daemonService = protoDescriptor.daemon.DaemonService;

    this.client = new daemonService(
      target,
      grpc.credentials.createInsecure(),
      {
        'grpc.max_receive_message_length': 64 * 1024 * 1024,
        'grpc.max_send_message_length': 64 * 1024 * 1024,
      }
    );
  }

  close(): void {
    if (this.client) {
      this.client.close();
    }
  }

  getStatus(): Promise<GetStatusResponse> {
    return new Promise((resolve, reject) => {
      this.client.GetStatus({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  stopDaemon(): Promise<StopDaemonResponse> {
    return new Promise((resolve, reject) => {
      this.client.StopDaemon({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  playGame(appid: number): Promise<PlayGameResponse> {
    return new Promise((resolve, reject) => {
      this.client.PlayGame({ appid }, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  exitGame(): Promise<ExitGameResponse> {
    return new Promise((resolve, reject) => {
      this.client.ExitGame({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  execAction(appid: number, action: string, params: Record<string, string> = {}): Promise<ExecActionResponse> {
    return new Promise((resolve, reject) => {
      this.client.ExecAction({ appid, action, params }, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  freeMemory(): Promise<FreeMemoryResponse> {
    return new Promise((resolve, reject) => {
      this.client.FreeMemory({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  streamEvents(): grpc.ClientReadableStream<StreamEventsResponse> {
    return this.client.StreamEvents({}) as any;
  }

  updateManualPrices(prices: Record<string, ManualPriceEntry>): Promise<UpdateManualPricesResponse> {
    return new Promise((resolve, reject) => {
      this.client.UpdateManualPrices({ prices }, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  guardCode(): Promise<GuardCodeResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardCode({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  guardStatus(): Promise<GuardStatusResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardStatus({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  guardList(): Promise<GuardListResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardList({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  guardRespond(confirmationId: string, accept: boolean, all: boolean = false): Promise<GuardRespondResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardRespond(
        { confirmation_id: confirmationId, accept, all },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        }
      );
    });
  }

  guardImport(
    sharedSecret: string,
    identitySecret: string,
    deviceId: string,
    accountName: string,
    refreshToken: string = ''
  ): Promise<GuardImportResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardImport(
        {
          shared_secret: sharedSecret,
          identity_secret: identitySecret,
          device_id: deviceId,
          account_name: accountName,
          refresh_token: refreshToken,
        },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        }
      );
    });
  }
}
