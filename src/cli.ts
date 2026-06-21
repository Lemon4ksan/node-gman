#!/usr/bin/env node

import { GManClient } from "./client";
import { ManualPriceEntry } from "./types";

// ANSI color escape codes for high-quality terminal visuals
const ColorReset = "\x1b[0m";
const ColorBold = "\x1b[1m";
const ColorGreen = "\x1b[32m";
const ColorRed = "\x1b[31m";
const ColorYellow = "\x1b[33m";
const ColorCyan = "\x1b[36m";
const ColorGray = "\x1b[90m";

function printUsage() {
  console.log(
    `${ColorCyan}${ColorBold}G-MAN Command Line Control Interface (gmanctl-node)${ColorReset}\n`,
  );
  console.log("Usage:");
  console.log("  gmanctl-node [command] [args...]");
  console.log("\nSystem Commands:");
  console.log(
    `  ${"status".padEnd(30)} Show daemon status, Steam connection and resource metrics`,
  );
  console.log(`  ${"stop".padEnd(30)} Stop the background daemon gracefully`);
  console.log(
    `  ${"gc".padEnd(30)} Force manual garbage collection and free physical memory`,
  );
  console.log(
    `  ${"events".padEnd(30)} Stream real-time daemon and game coordinator events`,
  );
  console.log(
    `  ${"migrate".padEnd(30)} Auto-migrate credentials and secrets from current directory`,
  );
  console.log("\nGame Commands:");
  console.log(
    `  ${"play <appid>".padEnd(30)} Launch game session & initialize Game Coordinator`,
  );
  console.log(
    `  ${"exit-game".padEnd(30)} Close active game session, return to simple online mode`,
  );
  console.log("\nAction Commands:");
  console.log(
    `  ${"exec <appid> <action> [params]".padEnd(30)} Execute game action (e.g., exec 440 craft-metal)`,
  );
  console.log(
    `  ${"exec <appid> inventory".padEnd(30)} Quick shortcut to query game backpack items`,
  );
  console.log(
    `  ${"update-prices <entry> [entry...]".padEnd(30)} Update manual pricing database entries`,
  );
  console.log(
    `  ${"request <type> <args...>".padEnd(30)} Execute raw Steam request (community, unified, webapi)`,
  );
  console.log(
    `  ${"nickname <steamid> [nickname]".padEnd(30)} Set or clear custom nickname for a Steam friend`,
  );
  console.log("\nGuard Commands:");
  console.log(
    `  ${"guard status".padEnd(30)} Show Steam Guard configuration status`,
  );
  console.log(
    `  ${"guard code".padEnd(30)} Generate current Steam Guard 2FA TOTP code`,
  );
  console.log(
    `  ${"guard list".padEnd(30)} List pending Steam Guard confirmations`,
  );
  console.log(
    `  ${"guard respond <id> <accept|decline>".padEnd(30)} Accept or decline a confirmation`,
  );
  console.log(
    `  ${"guard unlock <passphrase>".padEnd(30)} Unlock the daemon configuration`,
  );
  console.log(
    `  ${"guard import <shared> <identity> <device> [name] [token]".padEnd(30)} Import Steam Guard secrets`,
  );
  console.log("\nGlobal Parameters:");
  console.log(
    "  Arguments for 'exec' actions can be passed in key=value format (e.g., type=scrap).",
  );
  console.log(
    "  Arguments for 'update-prices' are formatted as: sku=buy_keys,buy_metal,sell_keys,sell_metal",
  );
  console.log('  Example: gmanctl-node update-prices "5021;6=1,0,1,0.11"');
}

async function main() {
  const args = process.argv.slice(2);

  if (
    args.length === 0 ||
    args[0] === "help" ||
    args[0] === "--help" ||
    args[0] === "-h"
  ) {
    printUsage();
    process.exit(0);
  }

  const command = args[0];
  const client = new GManClient({ autoLaunch: true });

  try {
    switch (command) {
      case "migrate":
        await handleMigrate(client);
        break;
      case "status":
        await handleStatus(client);
        break;
      case "stop":
        await handleStop(client);
        break;
      case "gc":
        await handleFreeMemory(client);
        break;
      case "events":
        handleStreamEvents(client);
        // Do not close client or exit process as it is a streaming event listener
        return;
      case "play":
        if (args.length < 2) {
          console.error(
            `${ColorRed}Error: 'play' command requires an AppID. Example: gmanctl-node play 440${ColorReset}`,
          );
          process.exit(1);
        }
        const playAppID = parseInt(args[1], 10);
        if (isNaN(playAppID)) {
          console.error(
            `${ColorRed}Error: Invalid AppID "${args[1]}". Must be an integer.${ColorReset}`,
          );
          process.exit(1);
        }
        await handlePlay(client, playAppID);
        break;
      case "exit-game":
        await handleExitGame(client);
        break;
      case "exec":
        if (args.length < 3) {
          console.error(
            `${ColorRed}Error: 'exec' command requires AppID and Action name. Example: gmanctl-node exec 440 craft-metal${ColorReset}`,
          );
          process.exit(1);
        }
        const execAppID = parseInt(args[1], 10);
        if (isNaN(execAppID)) {
          console.error(
            `${ColorRed}Error: Invalid AppID "${args[1]}".${ColorReset}`,
          );
          process.exit(1);
        }
        const action = args[2];
        const params: Record<string, string> = {};
        for (const arg of args.slice(3)) {
          const parts = arg.split("=");
          if (parts.length === 2) {
            params[parts[0]] = parts[1];
          } else {
            params[arg] = "true";
          }
        }
        await handleExec(client, execAppID, action, params);
        break;
      case "update-prices":
        if (args.length < 2) {
          console.error(
            `${ColorRed}Error: 'update-prices' command requires at least one price entry. Example: gmanctl-node update-prices "5021;6=1,0,1,0.11"${ColorReset}`,
          );
          process.exit(1);
        }
        await handleUpdatePrices(client, args.slice(1));
        break;
      case "request":
      case "req":
        if (args.length < 3) {
          printRequestUsage();
          process.exit(1);
        }
        await handleRequest(client, args.slice(1));
        break;
      case "nickname":
        if (args.length < 2) {
          console.error(
            `${ColorRed}Error: 'nickname' command requires a SteamID. Example: gmanctl-node nickname 76561198000000000 "Best Friend"${ColorReset}`,
          );
          process.exit(1);
        }
        const nicknameSteamID = args[1];
        const nicknameVal = args.slice(2).join(" ");
        await handleSetNickname(client, nicknameSteamID, nicknameVal);
        break;
      case "guard":
        if (args.length < 2) {
          console.error(
            `${ColorRed}Error: 'guard' command requires a subcommand (status, code, list, respond, import)${ColorReset}`,
          );
          process.exit(1);
        }
        const sub = args[1];
        switch (sub) {
          case "status":
            await handleGuardStatus(client);
            break;
          case "code":
            await handleGuardCode(client);
            break;
          case "list":
            await handleGuardList(client);
            break;
          case "respond":
            if (args.length < 4) {
              console.error(
                `${ColorRed}Error: 'guard respond' requires <id> <accept|decline>. Example: gmanctl-node guard respond 12345 accept${ColorReset}`,
              );
              process.exit(1);
            }
            const confID = args[2];
            const accept =
              args[3] === "accept" || args[3] === "true" || args[3] === "1";
            await handleGuardRespond(client, confID, accept);
            break;
          case "import":
            if (args.length < 5) {
              console.error(
                `${ColorRed}Error: 'guard import' requires <shared_secret> <identity_secret> <device_id> [account_name] [refresh_token]${ColorReset}`,
              );
              process.exit(1);
            }
            const shared = args[2];
            const identity = args[3];
            const device = args[4];
            const account = args[5] || "";
            const token = args[6] || "";
            await handleGuardImport(
              client,
              shared,
              identity,
              device,
              account,
              token,
            );
            break;
          case "unlock":
            if (args.length < 3) {
              console.error(
                `${ColorRed}Error: 'guard unlock' requires a passphrase. Example: gmanctl-node guard unlock mypass${ColorReset}`,
              );
              process.exit(1);
            }
            await handleGuardUnlock(client, args[2]);
            break;
          default:
            console.error(
              `${ColorRed}Unknown guard subcommand: ${sub}${ColorReset}`,
            );
            process.exit(1);
        }
        break;
      default:
        console.error(`${ColorRed}Unknown command: ${command}${ColorReset}`);
        printUsage();
        process.exit(1);
    }
  } catch (err: any) {
    console.error(
      `${ColorRed}Unexpected client error: ${err.message}${ColorReset}`,
    );
    process.exit(1);
  } finally {
    if (command !== "events") {
      client.close();
    }
  }
}

async function handleStatus(client: GManClient) {
  const resp = await client.getStatus();
  console.log(
    `${ColorBold}${ColorCyan}=== G-MAN DAEMON STATUS ===${ColorReset}`,
  );

  const connStr = resp.connected
    ? `${ColorGreen}ONLINE [Steam]${ColorReset}`
    : `${ColorRed}OFFLINE [Steam]${ColorReset}`;

  console.log(`Connection State: ${connStr}`);

  let steamID = resp.steam_id;
  if (!steamID || steamID === "0") {
    steamID = `${ColorGray}Not logged in${ColorReset}`;
  }
  console.log(`Steam ID:         ${steamID}`);

  let gameStr = `${ColorGray}None${ColorReset}`;
  if (resp.current_appid !== 0) {
    gameStr = `${ColorGreen}${resp.current_appid} (${resp.current_app_name})${ColorReset}`;
  }
  console.log(`Active Game:      ${gameStr}`);
  console.log(`Daemon Uptime:    ${ColorYellow}${resp.uptime}${ColorReset}`);

  const memMB = Number(resp.memory_bytes) / 1024.0 / 1024.0;
  console.log(
    `Memory Usage:     ${ColorYellow}${memMB.toFixed(2)} MB${ColorReset}`,
  );
}

async function handleStop(client: GManClient) {
  console.log(`${ColorYellow}Stopping g-man daemon...${ColorReset}`);
  const resp = await client.stopDaemon();
  console.log(`${ColorGreen}${resp.message}${ColorReset}`);
}

async function handleFreeMemory(client: GManClient) {
  console.log(
    `${ColorYellow}Triggering manual Garbage Collection in daemon...${ColorReset}`,
  );
  const resp = await client.freeMemory();
  console.log(`${ColorGreen}${resp.message}${ColorReset}`);
  const memMB = Number(resp.memory_bytes) / 1024.0 / 1024.0;
  console.log(
    `New Memory Usage: ${ColorYellow}${memMB.toFixed(2)} MB${ColorReset}`,
  );
}

function handleStreamEvents(client: GManClient) {
  console.log(
    `${ColorCyan}Streaming real-time daemon events... (Press Ctrl+C to exit)${ColorReset}\n`,
  );

  const stream = client.streamEvents();

  stream.on("data", (resp) => {
    const timestampMs = Number(resp.timestamp) * 1000;
    const timeStr = new Date(timestampMs).toTimeString().split(" ")[0];

    let evType = resp.event_type;
    const idx = evType.lastIndexOf(".");
    if (idx !== -1) {
      evType = evType.substring(idx + 1);
    }
    if (evType.startsWith("*")) {
      evType = evType.substring(1);
    }

    console.log(
      `[${timeStr}] ${ColorGreen}${evType}${ColorReset}: ${resp.payload_json}`,
    );
  });

  stream.on("error", (err: any) => {
    console.error(
      `${ColorRed}Stream connection lost: ${err.message}${ColorReset}`,
    );
    client.close();
    process.exit(1);
  });

  stream.on("end", () => {
    console.log(`${ColorYellow}Stream ended by server.${ColorReset}`);
    client.close();
    process.exit(0);
  });
}

async function handlePlay(client: GManClient, appID: number) {
  console.log(
    `${ColorCyan}Launching session for game AppID ${appID}...${ColorReset}`,
  );
  const resp = await client.playGame(appID);
  console.log(`${ColorGreen}${resp.message}${ColorReset}`);
}

async function handleExitGame(client: GManClient) {
  console.log(
    `${ColorCyan}Stopping playing session and exiting game...${ColorReset}`,
  );
  const resp = await client.exitGame();
  console.log(`${ColorGreen}${resp.message}${ColorReset}`);
}

async function handleExec(
  client: GManClient,
  appID: number,
  action: string,
  params: Record<string, string>,
) {
  console.log(
    `${ColorCyan}Executing action ${ColorBold}"${action}"${ColorReset}${ColorCyan} on game AppID ${ColorBold}${appID}${ColorReset}...`,
  );
  const resp = await client.execAction(appID, action, params);

  console.log(
    `\n${ColorBold}${ColorGreen}Action completed! Result message:${ColorReset}`,
  );
  console.log(resp.message);
  if (resp.details) {
    console.log(resp.details);
  }
}

async function handleUpdatePrices(client: GManClient, priceArgs: string[]) {
  const prices: Record<string, ManualPriceEntry> = {};

  for (const arg of priceArgs) {
    const parts = arg.split("=");
    if (parts.length !== 2) {
      console.error(
        `${ColorRed}Error: Invalid price format "${arg}". Expected: sku=buy_keys,buy_metal,sell_keys,sell_metal${ColorReset}`,
      );
      process.exit(1);
    }

    const sku = parts[0];
    const priceVals = parts[1].split(",");
    if (priceVals.length !== 4) {
      console.error(
        `${ColorRed}Error: Invalid price values "${parts[1]}". Expected 4 comma-separated values (buy_keys,buy_metal,sell_keys,sell_metal)${ColorReset}`,
      );
      process.exit(1);
    }

    const buyKeys = parseInt(priceVals[0], 10);
    const buyMetal = parseFloat(priceVals[1]);
    const sellKeys = parseInt(priceVals[2], 10);
    const sellMetal = parseFloat(priceVals[3]);

    if (
      isNaN(buyKeys) ||
      isNaN(buyMetal) ||
      isNaN(sellKeys) ||
      isNaN(sellMetal)
    ) {
      console.error(
        `${ColorRed}Error: Invalid price number formatting in "${arg}"${ColorReset}`,
      );
      process.exit(1);
    }

    prices[sku] = {
      buy_keys: buyKeys,
      buy_metal: buyMetal,
      sell_keys: sellKeys,
      sell_metal: sellMetal,
    };
  }

  console.log(`${ColorCyan}Sending price updates to daemon...${ColorReset}`);
  const resp = await client.updateManualPrices(prices);
  if (resp.success) {
    console.log(`${ColorGreen}${resp.message}${ColorReset}`);
  } else {
    console.log(`${ColorRed}Failed: ${resp.message}${ColorReset}`);
  }
}

async function handleGuardStatus(client: GManClient) {
  const resp = await client.guardStatus();
  console.log(
    `${ColorBold}${ColorCyan}=== STEAM GUARD STATUS ===${ColorReset}`,
  );

  if (resp.configured) {
    console.log(`Status:    ${ColorGreen}Configured${ColorReset}`);
  } else {
    console.log(`Status:    ${ColorRed}Not configured${ColorReset}`);
  }

  if (resp.device_id) {
    console.log(`Device ID: ${ColorYellow}${resp.device_id}${ColorReset}`);
  }

  if (resp.steam_id) {
    console.log(`Steam ID:  ${ColorYellow}${resp.steam_id}${ColorReset}`);
  }
}

async function handleGuardCode(client: GManClient) {
  const resp = await client.guardCode();
  console.log(
    `${ColorBold}${ColorGreen}Current Steam Guard Code: ${resp.code}${ColorReset}`,
  );
}

async function handleGuardList(client: GManClient) {
  console.log(`${ColorCyan}Fetching pending confirmations...${ColorReset}`);
  const resp = await client.guardList();

  const confs = resp.confirmations || [];
  if (confs.length === 0) {
    console.log(`${ColorGray}No pending confirmations${ColorReset}`);
    return;
  }

  console.log(
    `${ColorBold}${ColorCyan}=== PENDING CONFIRMATIONS (${confs.length}) ===${ColorReset}`,
  );

  for (let i = 0; i < confs.length; i++) {
    const c = confs[i];
    console.log(
      `\n${ColorBold}[${i + 1}]${ColorReset} ${ColorGreen}${c.title}${ColorReset}`,
    );
    console.log(
      `    ID: ${ColorYellow}${c.id}${ColorReset}  Type: ${ColorYellow}${c.type_name}${ColorReset}`,
    );
    if (c.description) {
      console.log(`    ${ColorGray}${c.description}${ColorReset}`);
    }
  }

  console.log(
    `\n${ColorGray}To accept: gmanctl-node guard respond <id> accept${ColorReset}`,
  );
  console.log(
    `${ColorGray}To decline: gmanctl-node guard respond <id> decline${ColorReset}`,
  );
}

async function handleGuardRespond(
  client: GManClient,
  confirmationId: string,
  accept: boolean,
) {
  const action = accept ? "accepting" : "declining";
  console.log(
    `${ColorCyan}${action} confirmation ${confirmationId}...${ColorReset}`,
  );

  const resp = await client.guardRespond(confirmationId, accept);
  if (resp.success) {
    console.log(`${ColorGreen}${resp.message}${ColorReset}`);
  } else {
    console.log(`${ColorRed}Failed: ${resp.message}${ColorReset}`);
  }
}

async function handleGuardImport(
  client: GManClient,
  sharedSecret: string,
  identitySecret: string,
  deviceId: string,
  accountName: string,
  refreshToken: string,
) {
  console.log(`${ColorCyan}Importing Steam Guard secrets...${ColorReset}`);
  const resp = await client.guardImport(
    sharedSecret,
    identitySecret,
    deviceId,
    accountName,
    refreshToken,
  );
  if (resp.success) {
    console.log(`${ColorGreen}${resp.message}${ColorReset}`);
  } else {
    console.log(`${ColorRed}Failed: ${resp.message}${ColorReset}`);
  }
}

function printRequestUsage() {
  console.log(
    `${ColorCyan}${ColorBold}Usage of 'request' command:${ColorReset}`,
  );
  console.log(
    "  gmanctl-node request community <method> <path> [key=val...] [body=raw_body] [is_post_form=true]",
  );
  console.log(
    "  gmanctl-node request unified <interface> <action> [version=N] [method=POST] [body=json_or_binary] [key=val...]",
  );
  console.log(
    "  gmanctl-node request webapi <interface> <action> [version=N] [method=GET] [key=val...]",
  );
  console.log("\nExamples:");
  console.log(
    "  gmanctl-node request community GET profiles/76561198000000000/inventory/json/730/2",
  );
  console.log(
    "  gmanctl-node request unified Player GetNickname version=1 body='{\"steamids\": [76561198000000000]}'",
  );
  console.log(
    "  gmanctl-node request webapi ISteamUser GetPlayerSummaries version=2 steamids=76561198000000000",
  );
}

async function handleRequest(client: GManClient, requestArgs: string[]) {
  const reqTypeStr = requestArgs[0].toLowerCase();
  let type: number;

  switch (reqTypeStr) {
    case "community":
    case "comm":
      type = 1; // REQUEST_TYPE_COMMUNITY
      break;
    case "unified":
    case "uni":
      type = 2; // REQUEST_TYPE_UNIFIED
      break;
    case "webapi":
    case "api":
      type = 3; // REQUEST_TYPE_WEBAPI
      break;
    default:
      console.error(
        `${ColorRed}Error: Unknown request type "${requestArgs[0]}". Expected: community, unified, webapi.${ColorReset}`,
      );
      process.exit(1);
  }

  const req: any = {
    type,
    params: {},
  };

  const keyValArgs = requestArgs.slice(3);
  const parsed = parseKeyValArgs(keyValArgs);

  if (reqTypeStr === "community" || reqTypeStr === "comm") {
    if (requestArgs.length < 3) {
      console.error(
        `${ColorRed}Error: community request requires method and path (e.g., gmanctl-node request community GET profiles/.../inventory).${ColorReset}`,
      );
      process.exit(1);
    }
    req.method = requestArgs[1];
    req.path = requestArgs[2];
  } else {
    if (requestArgs.length < 3) {
      console.error(
        `${ColorRed}Error: ${reqTypeStr} request requires interface and action (e.g., gmanctl-node request ${reqTypeStr} Player GetNickname).${ColorReset}`,
      );
      process.exit(1);
    }
    req.interface = requestArgs[1];
    req.action = requestArgs[2];
  }

  if (parsed.body) req.body = parsed.body;
  if (parsed.version) req.version = parsed.version;
  if (parsed.is_post_form) req.is_post_form = parsed.is_post_form;
  if (parsed.method) req.method = parsed.method;
  req.params = parsed.params;

  console.log(`${ColorCyan}Executing ${reqTypeStr} request to Steam...${ColorReset}`);
  const resp = await client.execRequest(req);

  if (!resp.success) {
    console.error(`${ColorRed}Failed: ${resp.message}${ColorReset}`);
    process.exit(1);
  }

  console.log(`${ColorBold}${ColorGreen}Request completed successfully!${ColorReset}`);
  if (resp.status_code && resp.status_code > 0) {
    console.log(`HTTP Status:   ${resp.status_code}`);
  }
  if (resp.eresult && resp.eresult > 0) {
    console.log(`Steam EResult: ${resp.eresult}`);
  }

  if (resp.headers && Object.keys(resp.headers).length > 0) {
    console.log(`\n${ColorBold}Response Headers:${ColorReset}`);
    const sortedKeys = Object.keys(resp.headers).sort();
    for (const k of sortedKeys) {
      console.log(`  ${k}: ${resp.headers[k]}`);
    }
  }

  if (resp.body) {
    console.log(`\n${ColorBold}Response Body:${ColorReset}`);
    const bodyStr = resp.body.toString();
    const trimmed = bodyStr.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        console.log(JSON.stringify(JSON.parse(bodyStr), null, 2));
        return;
      } catch {
        // ignore JSON formatting err, print raw
      }
    }
    console.log(bodyStr);
  }
}

function parseKeyValArgs(args: string[]) {
  const params: Record<string, string> = {};
  let body: string | undefined;
  let version: number | undefined;
  let is_post_form: boolean | undefined;
  let method: string | undefined;

  for (const arg of args) {
    const parts = arg.split("=");
    if (parts.length !== 2) {
      continue;
    }
    const key = parts[0];
    const val = parts[1];

    switch (key) {
      case "body":
        body = val;
        break;
      case "version":
        const v = parseInt(val, 10);
        if (!isNaN(v)) {
          version = v;
        }
        break;
      case "is_post_form":
        is_post_form = val === "true" || val === "1";
        break;
      case "method":
        method = val;
        break;
      default:
        params[key] = val;
    }
  }

  return { body, version, is_post_form, method, params };
}

main().catch((err) => {
  console.error(`${ColorRed}Unhandled error: ${err.message}${ColorReset}`);
  process.exit(1);
});

async function handleSetNickname(
  client: GManClient,
  steamId: string,
  nickname: string,
) {
  if (nickname === "") {
    console.log(
      `${ColorCyan}Clearing nickname for SteamID ${steamId}...${ColorReset}`,
    );
  } else {
    console.log(
      `${ColorCyan}Setting nickname for SteamID ${steamId} to "${nickname}"...${ColorReset}`,
    );
  }

  const resp = await client.setFriendNickname(steamId, nickname);
  if (resp.success) {
    console.log(`${ColorGreen}${resp.message}${ColorReset}`);
  } else {
    console.log(`${ColorRed}Failed: ${resp.message}${ColorReset}`);
  }
}

async function handleGuardUnlock(client: GManClient, passphrase: string) {
  console.log(
    `${ColorCyan}Attempting to unlock daemon configuration...${ColorReset}`,
  );
  const resp = await client.guardUnlock(passphrase);
  if (resp.success) {
    console.log(`${ColorGreen}${resp.message}${ColorReset}`);
  } else {
    console.log(`${ColorRed}Failed: ${resp.message}${ColorReset}`);
  }
}

async function handleMigrate(client: GManClient) {
  const fs = require("fs");
  const path = require("path");

  let foundEnv = false;
  let foundConfig = false;
  const credentials: Record<string, string> = {};

  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    console.log(`${ColorCyan}Found .env file. Parsing...${ColorReset}`);
    foundEnv = true;
    const content = fs.readFileSync(envPath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
        if (["STEAM_ACCOUNT_NAME", "STEAM_USERNAME", "USERNAME"].includes(key)) {
          credentials.accountName = val;
        } else if (["STEAM_PASSWORD", "PASSWORD"].includes(key)) {
          credentials.password = val;
        } else if (["STEAM_SHARED_SECRET", "SHARED_SECRET"].includes(key)) {
          credentials.sharedSecret = val;
        } else if (["STEAM_IDENTITY_SECRET", "IDENTITY_SECRET"].includes(key)) {
          credentials.identitySecret = val;
        } else if (["STEAM_DEVICE_ID", "DEVICE_ID"].includes(key)) {
          credentials.deviceId = val;
        }
      }
    }
  }

  const configPath = path.join(process.cwd(), "config.json");
  if (fs.existsSync(configPath)) {
    console.log(`${ColorCyan}Found config.json file. Parsing...${ColorReset}`);
    foundConfig = true;
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (config.username || config.accountName || config.account_name) {
        credentials.accountName = config.username || config.accountName || config.account_name;
      }
      if (config.password) {
        credentials.password = config.password;
      }
      if (config.sharedSecret || config.shared_secret) {
        credentials.sharedSecret = config.sharedSecret || config.shared_secret;
      }
      if (config.identitySecret || config.identity_secret) {
        credentials.identitySecret = config.identitySecret || config.identity_secret;
      }
      if (config.deviceId || config.device_id) {
        credentials.deviceId = config.deviceId || config.device_id;
      }
    } catch (e: any) {
      console.warn(`${ColorYellow}Warning: Failed to parse config.json: ${e.message}${ColorReset}`);
    }
  }

  if (!foundEnv && !foundConfig) {
    console.error(
      `${ColorRed}Error: No .env or config.json found in the current working directory (${process.cwd()}).${ColorReset}`,
    );
    process.exit(1);
  }

  console.log(`\n${ColorBold}Extracted Credentials:${ColorReset}`);
  console.log(`  Account Name:    ${credentials.accountName || `${ColorGray}(not found)${ColorReset}`}`);
  console.log(`  Password:        ${credentials.password ? `${ColorGreen}*****${ColorReset}` : `${ColorGray}(not found)${ColorReset}`}`);
  console.log(`  Shared Secret:   ${credentials.sharedSecret ? `${ColorGreen}*****${ColorReset}` : `${ColorGray}(not found)${ColorReset}`}`);
  console.log(`  Identity Secret: ${credentials.identitySecret ? `${ColorGreen}*****${ColorReset}` : `${ColorGray}(not found)${ColorReset}`}`);
  console.log(`  Device ID:       ${credentials.deviceId || `${ColorGray}(not found)${ColorReset}`}`);

  if (!credentials.sharedSecret || !credentials.identitySecret || !credentials.deviceId) {
    console.error(
      `\n${ColorRed}Error: Missing required Steam Guard secrets (sharedSecret, identitySecret, and deviceId must all be configured).${ColorReset}`,
    );
    process.exit(1);
  }

  console.log(`\n${ColorCyan}Importing secrets into the G-MAN daemon...${ColorReset}`);
  try {
    const resp = await client.guardImport(
      credentials.sharedSecret,
      credentials.identitySecret,
      credentials.deviceId,
      credentials.accountName || "",
    );
    if (resp.success) {
      console.log(`${ColorBold}${ColorGreen}Success: ${resp.message}${ColorReset}`);
    } else {
      console.error(`${ColorRed}Daemon Import Failed: ${resp.message}${ColorReset}`);
      process.exit(1);
    }
  } catch (err: any) {
    console.error(`${ColorRed}Error calling daemon: ${err.message}${ColorReset}`);
    process.exit(1);
  }
}
