import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import * as os from "os";
import * as dotenv from "dotenv";
import { EventEmitter } from "events";
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
  ExecRequestRequest,
  ExecRequestResponse,
  SetFriendNicknameResponse,
  GuardUnlockResponse,
  GuardTransferStartResponse,
  GuardTransferFinishResponse,
  GuardLinkStartResponse,
  GuardLinkFinalizeResponse,
  GuardSubmitAuthCodeResponse,
} from "./types";

import { ProtoGrpcType } from "./proto/daemon";
import { DaemonServiceClient } from "./proto/daemon/DaemonService";

dotenv.config();

export interface GManClientOptions {
  netType?: "tcp" | "unix";
  address?: string;
}

export class GManClient {
  private client: DaemonServiceClient;
  private eventBus: EventEmitter | null = null;

  constructor(options: GManClientOptions = {}) {
    let netType = options.netType || process.env.GMAN_IPC_NET;
    let address = options.address || process.env.GMAN_IPC_ADDR;

    if (!netType) {
      if (os.platform() === "win32") {
        netType = "tcp";
      } else {
        netType = "unix";
      }
    }

    if (!address) {
      if (netType === "tcp") {
        address = "127.0.0.1:50051";
      } else {
        const home = os.homedir();
        if (home) {
          address = path.join(home, ".config", "gman", "gman.sock");
        } else {
          address = "gman.sock";
        }
      }
    }

    const target = netType === "unix" ? `unix:${address}` : address;

    // Load protobuf definition
    const protoPath = path.resolve(__dirname, "../proto/daemon.proto");
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(
      packageDefinition,
    ) as unknown as ProtoGrpcType;
    const daemonService = protoDescriptor.daemon.DaemonService;

    this.client = new daemonService(target, grpc.credentials.createInsecure(), {
      "grpc.max_receive_message_length": 64 * 1024 * 1024,
      "grpc.max_send_message_length": 64 * 1024 * 1024,
    });
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

  execAction(
    appid: number,
    action: string,
    params: Record<string, string> = {},
  ): Promise<ExecActionResponse> {
    return new Promise((resolve, reject) => {
      this.client.ExecAction(
        { appid, action, params },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        },
      );
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

  updateManualPrices(
    prices: Record<string, ManualPriceEntry>,
  ): Promise<UpdateManualPricesResponse> {
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

  guardRespond(
    confirmationId: string,
    accept: boolean,
    all: boolean = false,
  ): Promise<GuardRespondResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardRespond(
        { confirmation_id: confirmationId, accept, all },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        },
      );
    });
  }

  guardImport(
    sharedSecret: string,
    identitySecret: string,
    deviceId: string,
    accountName: string,
    refreshToken: string = "",
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
        },
      );
    });
  }

  execRequest(req: ExecRequestRequest): Promise<ExecRequestResponse> {
    return new Promise((resolve, reject) => {
      this.client.ExecRequest(req, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  setFriendNickname(steamId: string, nickname: string): Promise<SetFriendNicknameResponse> {
    return new Promise((resolve, reject) => {
      this.client.SetFriendNickname(
        { steam_id: steamId, nickname },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        },
      );
    });
  }

  guardUnlock(passphrase: string): Promise<GuardUnlockResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardUnlock({ passphrase }, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  guardTransferStart(): Promise<GuardTransferStartResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardTransferStart({}, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  guardTransferFinish(smsCode: string): Promise<GuardTransferFinishResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardTransferFinish(
        { sms_code: smsCode },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        },
      );
    });
  }

  guardLinkStart(deviceId: string): Promise<GuardLinkStartResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardLinkStart(
        { device_id: deviceId },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        },
      );
    });
  }

  guardLinkFinalize(
    sharedSecret: string,
    serverTime: string,
    smsCode: string,
    identitySecret: string,
    deviceId: string,
  ): Promise<GuardLinkFinalizeResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardLinkFinalize(
        {
          shared_secret: sharedSecret,
          server_time: serverTime,
          sms_code: smsCode,
          identity_secret: identitySecret,
          device_id: deviceId,
        },
        (err: any, response?: any) => {
          if (err) reject(err);
          else resolve(response);
        },
      );
    });
  }

  guardSubmitAuthCode(code: string): Promise<GuardSubmitAuthCodeResponse> {
    return new Promise((resolve, reject) => {
      this.client.GuardSubmitAuthCode({ code }, (err: any, response?: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  async getInventory(appid: number): Promise<any[]> {
    const resp = await this.execAction(appid, "inventory");
    return resp.items || [];
  }

  getEventBus(): EventEmitter {
    if (this.eventBus) return this.eventBus;

    const bus = new EventEmitter();
    this.eventBus = bus;
    const stream = this.streamEvents();

    stream.on("data", (data) => {
      let evType = data.event_type || "";
      const idx = evType.lastIndexOf(".");
      if (idx !== -1) {
        evType = evType.substring(idx + 1);
      }
      if (evType.startsWith("*")) {
        evType = evType.substring(1);
      }

      let eventName = evType;
      if (eventName.endsWith("Event")) {
        eventName = eventName.substring(0, eventName.length - 5);
      }
      if (eventName.length > 0) {
        eventName = eventName.charAt(0).toLowerCase() + eventName.slice(1);
      }

      try {
        const payload = data.payload_json ? JSON.parse(data.payload_json) : {};
        bus.emit(eventName, payload);
        bus.emit("event", { type: eventName, payload });
      } catch {
        bus.emit(eventName, data.payload_json);
        bus.emit("event", { type: eventName, payload: data.payload_json });
      }
    });

    stream.on("error", (err) => {
      bus.emit("error", err);
    });

    stream.on("end", () => {
      bus.emit("end");
    });

    return bus;
  }
}
