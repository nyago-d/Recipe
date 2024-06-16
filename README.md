# レシピ管理

## 説明

レシピを管理するためのアプリケーションです。

https://shironeko.hateblo.jp/entry/2024/06/16/155905

## 構成

- Remix
- Prisma
- Storybook

## セットアップ

- `npm install` を実行してください。
- `.env` ファイルを作成し、`.env.sapmle`を基に環境変数を設定してください。
- データベースを作成後に、`npx prisma migrate dev` を実行してください。

※既存のDBに対してマイグレートは行わないように十分に注意してください。

## 実行

- `npm run dev` でアプリケーションが実行できます。
- `npm run storybook` で Storybook が起動します。