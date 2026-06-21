ifeq ($(OS),Windows_NT)
    RUN_NPM := npm.cmd
else
    RUN_NPM := npm
endif

.PHONY: all build build-sdk build-steam-totp build-steam-user build-steamcommunity build-tf2 build-tf2-currencies build-tf2-sku build-tradeoffer-manager test lint clean

all: build test lint

build: build-sdk build-steam-totp build-steam-user build-steamcommunity build-tf2 build-tf2-currencies build-tf2-sku build-tradeoffer-manager

build-sdk:
	$(RUN_NPM) run build

build-steam-totp:
	$(RUN_NPM) run build --prefix packages/steam-totp

build-steam-user:
	$(RUN_NPM) run build --prefix packages/steam-user

build-steamcommunity:
	$(RUN_NPM) run build --prefix packages/steamcommunity

build-tf2:
	$(RUN_NPM) run build --prefix packages/tf2

build-tf2-currencies:
	$(RUN_NPM) run build --prefix packages/tf2-currencies

build-tf2-sku:
	$(RUN_NPM) run build --prefix packages/tf2-sku

build-tradeoffer-manager:
	$(RUN_NPM) run build --prefix packages/tradeoffer-manager

test:
	$(RUN_NPM) test

lint:
	$(RUN_NPM) run lint

clean:
	@echo Cleaning root build outputs...
	node -e "const fs = require('fs'); ['dist'].forEach(d => { if (fs.existsSync(d)) fs.rmSync(d, {recursive: true, force: true}) })"
	@echo Cleaning compiled JS/TS outputs in source directories...
	node -e "const fs = require('fs'); const path = require('path'); const cleanDir = (dir) => { if (!fs.existsSync(dir)) return; fs.readdirSync(dir).forEach(file => { const p = path.join(dir, file); if (fs.statSync(p).isDirectory()) { if (file !== 'node_modules' && file !== 'dist' && file !== 'proto') cleanDir(p); } else if (['.js', '.js.map', '.d.ts'].some(ext => file.endsWith(ext))) { if (file !== 'eslint.config.js' && file !== 'jest.config.js') fs.unlinkSync(p); } }); }; cleanDir('src'); cleanDir('packages');"
