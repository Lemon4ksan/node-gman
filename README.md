# node-gman

TypeScript/Node.js SDK for [g-mand](https://github.com/lemon4ksan/g-man) — TF2 trading daemon.

## Installation

```bash
npm install node-gman
```

## Quick Start

```typescript
import { GManClient, TradeOfferManagerAdapter, SteamUserAdapter } from 'node-gman';

// Connect to g-mand daemon
const client = new GManClient({
  netType: 'tcp',           // 'tcp' or 'unix'
  address: '127.0.0.1:50051',
});

// Check status
const status = await client.getStatus();
console.log(`Steam ID: ${status.steam_id}, Connected: ${status.connected}`);

// Create adapters
const steamUser = new SteamUserAdapter(client);
const tradeManager = new TradeOfferManagerAdapter(client, { pollInterval: 30000 });

// Handle new offers
tradeManager.on('newOffer', async (offer) => {
  console.log(`New offer from ${offer.partner}`);
  
  // Accept the offer
  await client.execAction(440, 'accept-offer', { offer_id: offer.tradeofferid });
});

// Start polling
tradeManager.startPolling();
```

## Connection

### Via environment variables

```bash
GMAN_IPC_NET=tcp
GMAN_IPC_ADDR=127.0.0.1:50051
```

### Via constructor

```typescript
const client = new GManClient({
  netType: 'unix',
  address: '/home/user/.config/gman/gman.sock',
  autoLaunch: true,            // Spawn daemon automatically if it's not running
  daemonPath: './bin/g-mand'   // Optional: specify path to g-mand binary
});
```

### Auto-detection

- **Windows:** `tcp://127.0.0.1:50051`
- **Linux/macOS:** `unix://~/.config/gman/gman.sock`

## Classes

### GManClient

Main gRPC client for communicating with g-mand.

```typescript
const client = new GManClient(options?);
```

**Methods:**

| Method | Description |
|---|---|
| `getStatus()` | Connection status |
| `playGame(appid)` | Launch a game |
| `exitGame()` | Exit the game |
| `execAction(appid, action, params)` | Execute an action |
| `streamEvents()` | Stream events |
| `updateManualPrices(prices)` | Update prices |
| `freeMemory()` | Free memory |
| `stopDaemon()` | Stop daemon |
| `guardCode()` | Steam Guard code |
| `guardStatus()` | Guard status |
| `guardList()` | List confirmations |
| `guardRespond(id, accept)` | Respond to confirmation |
| `guardImport(...)` | Import Guard secrets |
| `close()` | Close connection |

### SteamUserAdapter

Adapter for Steam connection (emulates `steam-user`).

```typescript
const steamUser = new SteamUserAdapter(client);
```

**Events:**
- `loggedOn` — successful login
- `webSession` — web session established
- `error` — error occurred

**Methods:**
- `gamesPlayed(appid)` — launch a game
- `chatMessage(steamID, message)` — send a message

### TeamFortress2Adapter

Adapter for TF2 Game Coordinator (emulates `@tf2autobot/tf2`).

```typescript
const tf2 = new TeamFortress2Adapter(client);
```

**Properties:**
- `haveGCSession` — whether connected to GC

**Events:**
- `connectedToGC` — connected to GC
- `disconnectedFromGC` — disconnected from GC
- `itemAcquired` — item received
- `itemRemoved` — item removed
- `itemChanged` — item changed

**Methods:**
- `craft(assetids, recipe?)` — craft items
- `useItem(assetid)` — use an item
- `deleteItem(assetid)` — delete an item
- `sortBackpack(type)` — sort backpack

### TradeOfferManagerAdapter

Adapter for managing trade offers. Uses real-time gRPC event streaming (`StreamEvents` from the daemon) as the primary transport for instant updates, and falls back to polling for maximum reliability.

```typescript
const tradeManager = new TradeOfferManagerAdapter(client, {
  pollInterval: 30000, // polling interval in ms (fallback backup)
});
```

**Properties:**
- `pollData` — polling data
- `pollInterval` — polling interval

**Events:**
- `newOffer` — new incoming offer (emitted in real-time)
- `offerChanged` — offer status changed (emitted in real-time)
- `poll` — polling data updated
- `error` — error occurred

**Methods:**
- `startPolling()` — start real-time event streaming subscription and backup polling interval
- `stopPolling()` — unsubscribe from event streaming and stop polling interval
- `client.execAction(...)` — direct g-mand call

### SteamCommunityAdapter

Adapter for Steam Community (emulates `@tf2autobot/steamcommunity`). Supports web session cookie tracking and synchronization.

```typescript
const community = new SteamCommunityAdapter(client, { steamID: '...' });
```

**Methods:**
- `setCookie(cookie)` — set/track custom cookie string
- `setCookies(cookies)` — set/track custom cookies array
- `getWebSession(callback)` — retrieve active web session ID and cookies
- `getWebSessionSync()` — synchronously retrieve active web session ID and cookies

## Types

```typescript
interface TradeOffer {
  tradeofferid: string;
  partner: string;
  trade_offer_state: number;
  items_to_give?: TradeOfferItem[];
  items_to_receive?: TradeOfferItem[];
  message?: string;
  data?: Record<string, unknown>;
}

interface TradeOfferItem {
  appid: number;
  contextid: string;
  assetid: string;
  amount: number;
}

interface PollData {
  sent: Record<string, number>;
  received: Record<string, number>;
  offerData: Record<string, Record<string, unknown>>;
}

enum ETradeOfferState {
  Invalid = 1,
  Active = 2,
  Accepted = 3,
  Countered = 4,
  Expired = 5,
  Cancelled = 6,
  Declined = 7,
  InvalidItems = 8,
  CreatedNeedsConfirmation = 9,
  InEscrow = 10,
}
```

## g-mand Actions

Available actions via `client.execAction(440, action, params)`:

### Trading

| Action | Params | Description |
|---|---|---|
| `send-offer` | `offer_params` (JSON) | Send trade offer |
| `accept-offer` | `offer_id` | Accept offer |
| `decline-offer` | `offer_id` | Decline offer |
| `cancel-offer` | `offer_id` | Cancel offer |
| `check-escrow` | `offer` (JSON) | Check escrow |
| `active-offers` | — | Active incoming offers |
| `active-sent-offers` | — | Active outgoing offers |

### Inventory

| Action | Params | Description |
|---|---|---|
| `inventory` | — | Get inventory |
| `get-partner-inventory` | `partner_id` | Partner's inventory |
| `item-details` | `item_id` | Item details |
| `sort-backpack` | `type`, `sort_type` | Sort backpack |

### Crafting

| Action | Params | Description |
|---|---|---|
| `craft` | `recipe`, `items` (JSON) | Craft items |
| `craft-metal` | `type` | Combine metal |
| `smelt-weapons` | `class` | Smelt weapons |
| `condense-metal` | — | Condense metal |
| `make-change` | `target_defindex`, `target_count` | Break down metal |

### Other

| Action | Params | Description |
|---|---|---|
| `send-chat` | `steam_id`, `message` | Send chat message |
| `price-check` | `sku` | Check item price |
| `backpack-value` | — | Backpack value |
| `delete-item` | `item_id` | Delete item |
| `use-item` | `item_id` | Use item |
| `schema` | — | Get schema |

## CLI

```bash
# Install
npm install -g node-gman

# Daemon status
gmanctl-node status

# Launch TF2
gmanctl-node play 440

# Send a message
gmanctl-node exec 440 send-chat steam_id=76561198000000000 message=Hello

# Check price
gmanctl-node exec 440 price-check sku=5021;6

# Stop daemon
gmanctl-node stop

# Auto-migrate credentials and secrets from current folder (.env or config.json)
gmanctl-node migrate
```

## Example: Simple Bot

```typescript
import { GManClient, TradeOfferManagerAdapter, SteamUserAdapter, TeamFortress2Adapter } from 'node-gman';

async function main() {
  const client = new GManClient();
  const status = await client.getStatus();
  
  if (!status.connected) {
    console.error('g-mand is not connected to Steam');
    process.exit(1);
  }

  const steamUser = new SteamUserAdapter(client);
  const tradeManager = new TradeOfferManagerAdapter(client);
  const tf2 = new TeamFortress2Adapter(client);

  // Wait for TF2 GC connection
  await new Promise<void>((resolve) => {
    if (tf2.haveGCSession) resolve();
    else tf2.once('connectedToGC', () => resolve());
  });

  console.log('Bot started');

  tradeManager.on('newOffer', async (offer) => {
    console.log(`Offer from ${offer.partner}`);
    
    try {
      // Accept all offers (example)
      await client.execAction(440, 'accept-offer', { 
        offer_id: offer.tradeofferid 
      });
      console.log(`Offer ${offer.tradeofferid} accepted`);
      
      // Send thank you message
      await client.execAction(440, 'send-chat', {
        steam_id: offer.partner,
        message: 'Thanks for the trade!',
      });
    } catch (err) {
      console.error('Error:', err);
    }
  });

  tradeManager.startPolling();
}

main();
```

## Security & Session Isolation

To keep Steam accounts highly secure, **sensitive session tokens (cookies) and shared secrets are never exported over the gRPC / IPC channels** to the JS client. 
* All authentication session cookies are kept strictly in `g-mand` daemon memory space.
* The JS emulators (`steamcommunity` and `tradeoffer-manager`) route HTTP requests to the daemon via `ExecRequest`.
* The daemon automatically injects the proper cookies and updates the `sessionid` parameter on the fly for every request, maintaining seamless compatibility with external frameworks (like `tf2autobot`) while minimizing the attack surface.

If you really need to access the daemon's IPC channel directly, you can:
1. Execute a GET request via `client.execRequest` on any Steam page (e.g., `/my`).
2. In the returned HTTP headers (Headers), intercept the new `Set-Cookie` headers that Steam, and parse them.

## Drop-in Subpackages

To simplify the migration of existing bots (such as `tf2autobot`), `node-gman` includes a set of drop-in subpackage replacements in the `packages/` directory. These packages fully emulate the API of their original Node.js counterparts, routing actions to the `g-mand` daemon or resolving them locally:

* **`@node-gman/steam-totp`** — replacement for `steam-totp` (generates 2FA codes locally or via the daemon).
* **`@node-gman/steam-user`** — replacement for `steam-user` (Steam connection via g-mand).
* **`@node-gman/steamcommunity`** — replacement for `steamcommunity` (community web sessions).
* **`@node-gman/tf2`** — replacement for `@tf2autobot/tf2` (TF2 Game Coordinator interaction).
* **`@node-gman/tradeoffer-manager`** — replacement for `@tf2autobot/tradeoffer-manager` (real-time trade offers).
* **`@node-gman/tf2-sku`** — replacement for `@tf2autobot/tf2-sku` (item SKU parsing and generation).
* **`@node-gman/tf2-currencies`** — replacement for `@tf2autobot/tf2-currencies` (TF2 currency math and formatting).

### Using in Existing Projects

You can drop these replacements into your existing project's `package.json` using npm aliases:

```json
"dependencies": {
  "steam-totp": "npm:@node-gman/steam-totp@^1.0.2",
  "steam-user": "npm:@node-gman/steam-user@^1.0.2",
  "@tf2autobot/tradeoffer-manager": "npm:@node-gman/tradeoffer-manager@^1.0.2",
  "@tf2autobot/tf2": "npm:@node-gman/tf2@^1.0.2",
  "@tf2autobot/steamcommunity": "npm:@node-gman/steamcommunity@^1.0.2",
  "@tf2autobot/tf2-sku": "npm:@node-gman/tf2-sku@^1.0.2",
  "@tf2autobot/tf2-currencies": "npm:@node-gman/tf2-currencies@^1.0.2"
}
```

## Build & Tests

The library uses static type generation from protobuf files.

```bash
# Generate types and compile TypeScript to dist/
npm run build

# Run Jest unit test suite
npm run test
```

## License

BSD-3-Clause
