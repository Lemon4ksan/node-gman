# node-gman

TypeScript/Node.js SDK для [g-mand](https://github.com/lemon4ksan/g-man) — демона торговли TF2.

## Установка

```bash
npm install node-gman
```

## Быстрый старт

```typescript
import { GManClient, TradeOfferManagerAdapter, SteamUserAdapter } from 'node-gman';

// Подключение к g-mand демону
const client = new GManClient({
  netType: 'tcp',           // 'tcp' или 'unix'
  address: '127.0.0.1:50051',
});

// Проверка статуса
const status = await client.getStatus();
console.log(`Steam ID: ${status.steam_id}, Connected: ${status.connected}`);

// Создание адаптеров
const steamUser = new SteamUserAdapter(client);
const tradeManager = new TradeOfferManagerAdapter(client, { pollInterval: 30000 });

// Обработка новых предложений
tradeManager.on('newOffer', async (offer) => {
  console.log(`Новое предложение от ${offer.partner}`);
  
  // Принять предложение
  await client.execAction(440, 'accept-offer', { offer_id: offer.tradeofferid });
});

// Запуск опроса
tradeManager.startPolling();
```

## Подключение

### Через переменные окружения

```bash
GMAN_IPC_NET=tcp
GMAN_IPC_ADDR=127.0.0.1:50051
```

### Через конструктор

```typescript
const client = new GManClient({
  netType: 'unix',
  address: '/home/user/.config/gman/gman.sock',
});
```

### Автоопределение

- **Windows:** `tcp://127.0.0.1:50051`
- **Linux/macOS:** `unix://~/.config/gman/gman.sock`

## Классы

### GManClient

Основной gRPC клиент для взаимодействия с g-mand.

```typescript
const client = new GManClient(options?);
```

**Методы:**

| Метод | Описание |
|---|---|
| `getStatus()` | Статус подключения |
| `playGame(appid)` | Запустить игру |
| `exitGame()` | Выйти из игры |
| `execAction(appid, action, params)` | Выполнить действие |
| `streamEvents()` | Стриминг событий |
| `updateManualPrices(prices)` | Обновить цены |
| `freeMemory()` | Очистить память |
| `stopDaemon()` | Остановить демон |
| `guardCode()` | Код Steam Guard |
| `guardStatus()` | Статус Guard |
| `guardList()` | Список подтверждений |
| `guardRespond(id, accept)` | Ответить на подтверждение |
| `guardImport(...)` | Импортировать Guard |
| `close()` | Закрыть соединение |

### SteamUserAdapter

Адаптер для Steam подключения (эмулирует `steam-user`).

```typescript
const steamUser = new SteamUserAdapter(client);
```

**События:**
- `loggedOn` — успешный вход
- `webSession` — веб-сессия установлена
- `error` — ошибка

**Методы:**
- `gamesPlayed(appid)` — запустить игру
- `chatMessage(steamID, message)` — отправить сообщение

### TeamFortress2Adapter

Адаптер для TF2 Game Coordinator (эмулирует `@tf2autobot/tf2`).

```typescript
const tf2 = new TeamFortress2Adapter(client);
```

**Свойства:**
- `haveGCSession` — подключён ли к GC

**События:**
- `connectedToGC` — подключение к GC
- `disconnectedFromGC` — отключение от GC
- `itemAcquired` — предмет получен
- `itemRemoved` — предмет удалён
- `itemChanged` — предмет изменён

**Методы:**
- `craft(assetids, recipe?)` — крафтинг
- `useItem(assetid)` — использовать предмет
- `deleteItem(assetid)` — удалить предмет
- `sortBackpack(type)` — сортировка рюкзака

### TradeOfferManagerAdapter

Адаптер для управления торговыми предложениями. Использует событийный стриминг по gRPC (`StreamEvents` из демона) в качестве основного транспорта для мгновенных обновлений в реальном времени с автоматическим переходом на периодический опрос в качестве резервного механизма.

```typescript
const tradeManager = new TradeOfferManagerAdapter(client, {
  pollInterval: 30000, // интервал резервного опроса в мс
});
```

**Свойства:**
- `pollData` — данные опроса
- `pollInterval` — интервал опроса

**События:**
- `newOffer` — новое входящее предложение (эмитится в реальном времени)
- `offerChanged` — изменение статуса предложения (эмитится в реальном времени)
- `poll` — данные опроса обновлены
- `error` — ошибка

**Методы:**
- `startPolling()` — подписаться на gRPC-стрим событий реального времени и запустить фоновый таймер резервного опроса
- `stopPolling()` — отписаться от стрима событий и остановить фоновый таймер опроса
- `client.execAction(...)` — прямой вызов g-mand

### SteamCommunityAdapter

Адаптер для Steam Community (эмулирует `@tf2autobot/steamcommunity`). Поддерживает отслеживание и синхронизацию cookie-файлов веб-сессии.

```typescript
const community = new SteamCommunityAdapter(client, { steamID: '...' });
```

**Методы:**
- `setCookie(cookie)` — установить/отслеживать строку cookie
- `setCookies(cookies)` — установить/отслеживать массив cookies
- `getWebSession(callback)` — получить ID активной веб-сессии и массив cookies
- `getWebSessionSync()` — синхронно получить ID активной веб-сессии и массив cookies

## Типы

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

Доступные действия через `client.execAction(440, action, params)`:

### Торговля

| Action | Params | Описание |
|---|---|---|
| `send-offer` | `offer_params` (JSON) | Отправить предложение |
| `accept-offer` | `offer_id` | Принять предложение |
| `decline-offer` | `offer_id` | Отклонить предложение |
| `cancel-offer` | `offer_id` | Отменить предложение |
| `check-escrow` | `offer` (JSON) | Проверить escrow |
| `active-offers` | — | Активные входящие |
| `active-sent-offers` | — | Активные исходящие |

### Инвентарь

| Action | Params | Описание |
|---|---|---|
| `inventory` | — | Получить инвентарь |
| `get-partner-inventory` | `partner_id` | Инвентарь партнёра |
| `item-details` | `item_id` | Детали предмета |
| `sort-backpack` | `type`, `sort_type` | Сортировка |

### Крафтинг

| Action | Params | Описание |
|---|---|---|
| `craft` | `recipe`, `items` (JSON) | Крафтинг |
| `craft-metal` | `type` | Комбинирование металла |
| `smelt-weapons` | `class` | Переплавка оружия |
| `condense-metal` | — | Уплотнение металла |
| `make-change` | `target_defindex`, `target_count` | Размен металла |

### Прочее

| Action | Params | Описание |
|---|---|---|
| `send-chat` | `steam_id`, `message` | Отправить сообщение |
| `price-check` | `sku` | Проверить цену |
| `backpack-value` | — | Стоимость рюкзака |
| `delete-item` | `item_id` | Удалить предмет |
| `use-item` | `item_id` | Использовать предмет |
| `schema` | — | Получить схему |

## CLI

```bash
# Установка
npm install -g node-gman

# Статус демона
gmanctl-node status

# Запустить TF2
gmanctl-node play 440

# Отправить сообщение
gmanctl-node exec 440 send-chat steam_id=76561198000000000 message=Hello

# Проверить цену
gmanctl-node exec 440 price-check sku=5021;6

# Остановить демон
gmanctl-node stop
```

## Пример: простой бот

```typescript
import { GManClient, TradeOfferManagerAdapter, SteamUserAdapter } from 'node-gman';

async function main() {
  const client = new GManClient();
  const status = await client.getStatus();
  
  if (!status.connected) {
    console.error('g-mand не подключён к Steam');
    process.exit(1);
  }

  const steamUser = new SteamUserAdapter(client);
  const tradeManager = new TradeOfferManagerAdapter(client);

  // Ждём подключения к TF2
  const tf2 = new (await import('node-gman')).TeamFortress2Adapter(client);
  
  await new Promise<void>((resolve) => {
    if (tf2.haveGCSession) resolve();
    else tf2.once('connectedToGC', () => resolve());
  });

  console.log('Бот запущен');

  tradeManager.on('newOffer', async (offer) => {
    console.log(`Предложение от ${offer.partner}`);
    
    // Принимаем все предложения (пример)
    try {
      await client.execAction(440, 'accept-offer', { 
        offer_id: offer.tradeofferid 
      });
      console.log(`Предложение ${offer.tradeofferid} принято`);
      
      // Отправляем сообщение
      await client.execAction(440, 'send-chat', {
        steam_id: offer.partner,
        message: 'Спасибо за трейд!',
      });
    } catch (err) {
      console.error('Ошибка:', err);
    }
  });

  tradeManager.startPolling();
}

main();
```

## Пакеты-заглушки (Drop-in Subpackages)

Для упрощения миграции существующих ботов (таких как `tf2autobot`), `node-gman` поставляется с набором пакетов-заглушек в директории `packages/`. Эти пакеты полностью эмулируют API оригинальных библиотек Node.js, перенаправляя вызовы в демон `g-mand` или выполняя их локально:

* **`@node-gman/steam-totp`** — замена для `steam-totp` (генерация 2FA-кодов локально или через демон).
* **`@node-gman/steam-user`** — замена для `steam-user` (подключение к Steam через g-mand).
* **`@node-gman/steamcommunity`** — замена для `steamcommunity` (работа с сессиями и запросами).
* **`@node-gman/tf2`** — замена для `@tf2autobot/tf2` (взаимодействие с координатором игры TF2).
* **`@node-gman/tradeoffer-manager`** — замена для `@tf2autobot/tradeoffer-manager` (управление трейдами в реальном времени).
* **`@node-gman/tf2-sku`** — замена для `@tf2autobot/tf2-sku` (парсинг и генерация SKU предметов).
* **`@node-gman/tf2-currencies`** — замена для `@tf2autobot/tf2-currencies` (математика и форматирование валюты TF2).

### Использование в существующих проектах

Вы можете легко заменить оригинальные зависимости в вашем `package.json` с помощью псевдонимов npm (npm aliases):

```json
"dependencies": {
  "steam-totp": "npm:@node-gman/steam-totp@^1.0.0",
  "steam-user": "npm:@node-gman/steam-user@^1.0.0",
  "@tf2autobot/tradeoffer-manager": "npm:@node-gman/tradeoffer-manager@^1.0.0",
  "@tf2autobot/tf2": "npm:@node-gman/tf2@^1.0.0",
  "@tf2autobot/steamcommunity": "npm:@node-gman/steamcommunity@^1.0.0",
  "@tf2autobot/tf2-sku": "npm:@node-gman/tf2-sku@^1.0.0",
  "@tf2autobot/tf2-currencies": "npm:@node-gman/tf2-currencies@^1.0.0"
}
```

## Сборка и Тесты

Библиотека использует статическую генерацию типов TypeScript из файлов описания protobuf.

```bash
# Сгенерировать типы и скомпилировать TypeScript код в dist/
npm run build

# Запустить тестовый набор Jest
npm run test
```

## Лицензия

BSD-3-Clause
