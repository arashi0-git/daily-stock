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

3. **Git Hooks (Husky)**  
   `npm install` 実行時に `husky install` が走り、`pre-commit` で lint-staged + backend チェックが動きます。

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
