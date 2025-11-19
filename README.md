# daily-stock

## 技術スタック

フロントエンド

- React 18 + Vite + TypeScript 5
- React Router v6
- TanStack Query
- Zustand
- Tailwind CSS + shadcn/ui (Mantine よりシンプル)
- React Hook Form + Zod

バックエンド

- FastAPI + Python 3.11+
- Uvicorn
- Pydantic v2
- PostgreSQL + SQLAlchemy 2.0 + Alembic

OCR・AI 機能

- Azure Document Intelligence
- - レシート特化の事前学習モデルあり
- - 商品名・金額・日付を構造化して抽出可能

在庫予測: GPT-4 / GPT-4o

- 少量データでも文脈理解して予測可能
- プロンプトで「過去の購入履歴から次回購入日を予測」と指示

デプロイ
Docker + Docker Compose
フロントエンド: npm build → nginx
バックエンド: FastAPI + PostgreSQL

---

## プロジェクト構成

```
.
├── frontend/            # Vite + React 18 + TypeScript
│   ├── src/pages        # UI ページ (home/items/purchase)
│   ├── src/features     # 機能ごとの application / domain / infra
│   │   ├── items
│   │   └── purchase
│   └── src/shared       # components / hooks / utils の共通部品
├── backend/             # FastAPI + Pydantic + SQLAlchemy
│   ├── app/api          # API ルーター
│   ├── app/services     # ビジネスロジック
│   ├── app/repositories # データアクセス (現在は in-memory)
│   ├── app/schemas      # Pydantic モデル
│   └── scripts          # 品質チェック・アーキテクチャ検証
└── .github/workflows    # CI (GitHub Actions)
```

## セットアップ

1. **Node.js と npm の準備**  
   Node.js 20 系を想定しています。

   ```bash
   npm install
   ```

   ※ `.npmrc` で `legacy-peer-deps=true` を設定しているため、ESLint 9 系と一部プラグインの peer 依存差異を気にせずインストールできます。

2. **Python 依存関係 (3.11+)**

   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate  # 任意
   pip install -e ".[dev]"
   ```

   `.env`で以下のように環境変数を設定してください（例）:

   ```
   DAILY_STOCK_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/daily_stock
   DAILY_STOCK_JWT_SECRET_KEY=please-change-me
   DAILY_STOCK_CORS_ORIGINS=http://localhost:5173
   DAILY_STOCK_AUTH_COOKIE_SECURE=false
   ```

   FastAPI は `uvicorn app.main:app --reload` などで起動できます。  
   フロントエンドからは `VITE_API_BASE_URL=http://localhost:8000/api` を設定することで CORS + Cookie（HTTP-only）付きで API を呼び出せます。

3. **Git Hooks (Husky)**
   `npm install` 実行時に `husky install` が走り、`pre-commit` で lint-staged + backend チェックが動きます。

## Docker 開発環境

ローカルで Node/Python を直接入れずに動作させたい場合は Docker Compose を利用できます。

1. ルートで `docker compose build` を実行し、イメージを作成します。
2. `docker compose up -d` でバックエンド(FastAPI)、フロントエンド(Vite ビルド品を nginx で配信)、PostgreSQL が起動します。
3. ブラウザで `http://localhost:5173` にアクセスするとフロントエンド、`http://localhost:8000/docs` にアクセスすると FastAPI のドキュメントが確認できます。

デフォルト設定:

- PostgreSQL: `postgres:postgres@localhost:5432/daily_stock`
- バックエンド: http://localhost:8000
- フロントエンド: http://localhost:5173
- `VITE_API_BASE_URL` は build 引数で上書き可能 (`docker compose build --build-arg VITE_API_BASE_URL=... frontend`)

Azure Document Intelligence など追加の環境変数が必要な場合は `docker-compose.yml` の `backend` サービスに `environment` を追記してください。  
開発中にコンテナを停止するには `docker compose down` を実行します。

## 主要コマンド

| コマンド | 説明 |
| --- | --- |
| `npm run dev --workspace frontend` | Vite 開発サーバ |
| `npm run lint:frontend` | ESLint + boundaries チェック |
| `npm run typecheck:frontend` | TypeScript 型チェック |
| `npm run test:frontend` | Vitest (jsdom) |
| `npm run deps:graph` | dependency-cruiser による依存監視 |
| `npm run backend:ruff` | Ruff lint (`backend/scripts/run_ruff.sh`) |
| `npm run backend:mypy` | mypy (strict) |
| `npm run backend:pytest` | pytest + coverage |
| `npm run backend:layers` | 独自 Python スクリプトで層違反を検出 |
| `npm run backend:check` | 上記バックエンドコマンドをまとめて実行 |
| `npm run validate` | フロント/バックの品質ゲートを一括実行 |

## CI/CD

- `.github/workflows/ci.yml` が Push / PR で自動実行
  - **Frontend job**: `npm install` → ESLint → TypeScript → Vitest → dependency-cruiser
  - **Backend job**: `pip install -e .[dev]` → Ruff → Ruff format --check → mypy → pytest → カスタム層チェック

## アーキテクチャチェック

- フロントエンド: `eslint-plugin-boundaries` と `dependency-cruiser` で Clean Architecture のレイヤー違反を検出
- バックエンド: `backend/scripts/check_layers.py` で `api -> services -> repositories -> models` などの依存方向を静的解析

## 今後の拡張ヒント

- Azure Document Intelligence / GPT-4 呼び出しは `backend/app/services/inventory.py` にエントリーポイントを用意済み
- PostgreSQL / SQLAlchemy への置き換えは `PurchaseRepository` を差し替えることで対応
