# AppShot - App Store 截圖生成工具

AppShot 是一款無需註冊、即用即走的 App Store 截圖生成工具，專為 iOS 應用開發者設計。訪問網站即可上傳您的應用截圖，快速生成符合 App Store 上架規範的設備外殼截圖。

## 特色

- **即時使用**：無需註冊和登入，訪問網站即可使用
- **簡單直覺**：三步驟操作，上傳 → 選擇設備 → 下載
- **隱私優先**：所有處理在本地完成，無資料上傳
- **符合規範**：生成符合 App Store 要求的標準截圖

## 支援的設備

- iPhone 14/15 (6.1 吋)
- iPad Pro 12.9 吋

## 技術架構

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Canvas API 圖像處理
- shadcn/ui 組件庫

## 本地開發

### 前提條件

- Node.js v20 或更高版本
- npm v10 或更高版本

### 安裝

1. 克隆倉庫

```bash
git clone [repository-url]
cd appshot
```

2. 安裝依賴

```bash
npm install
```

3. 運行開發伺服器

```bash
npm run dev
```

應用將在 [http://localhost:3000](http://localhost:3000) 啟動。

### 構建生產版本

```bash
npm run build
npm start
```

## 設備模型

您需要將設備模型圖像放在 `public/device-models/` 目錄中：

- `iphone-14.png` - iPhone 14/15 6.1 吋模型
- `ipad-pro.png` - iPad Pro 12.9 吋模型

## 授權

本專案採用 MIT 授權條款 - 詳見 LICENSE 文件

## 貢獻

歡迎提交 Pull Request 或開設 Issue 討論您想添加的功能或報告問題。
