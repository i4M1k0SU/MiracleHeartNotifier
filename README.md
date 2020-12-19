# MiracleHeartNotifier

ミラクル♡ライト・ミラクルいちごライトでSlackを通知する

## Setup

```bash
npm ci
cp .env.sample .env
vim .env
```

## Run

```bash
npm start
```

## 点灯パターンについて

点灯パターンは `commands.json` のキー名を `.env` の `COLOR_PATTERN` に指定することで変更することができます。

`commands.json` の作成には、ohtake氏の解析成果を利用しています。

## Thanks

- [Miracle Light Controller by ohtake](https://github.com/ohtake/miracle-light-controller)
