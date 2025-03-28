# AppShot 文檔中心

歡迎來到 AppShot 文檔中心。本文檔集合提供了關於 AppShot 極簡 MVP 版本的所有相關資訊，從概念設計到技術實現。

## 文檔目錄

### 1. [AppShot MVP 方案](./AppShot_MVP_Plan.md)

全面的專案規劃文檔，包含專案概述、技術架構、功能規格、開發計劃、資源需求等內容。

### 2. [技術實現指南](./AppShot_Technical_Guide.md)

詳細的技術指南，包含開發環境設置、核心功能實現代碼、部署指南、測試策略等。

### 3. 設計資源

- [架構圖](./images/architecture.md)：系統架構圖及說明
- [UI 模擬設計](./images/mockup.md)：使用者介面設計與說明
- [ASCII 架構圖](./images/architecture_ascii.txt)：純文字版架構圖

## 專案概述

AppShot 是一款極簡的 App Store 截圖生成工具，無需註冊即可使用，幫助 iOS 應用開發者快速生成符合上架規範的應用截圖。專案採用純前端架構，所有圖像處理都在使用者瀏覽器中完成，不需要後端服務。

### 技術棧

AppShot 使用現代化的前端技術來實現：

- **React 18**：現代化前端庫，提供高效的組件化開發體驗
- **Next.js 15**：最新版的 React 元框架，支援 React 19、Turbopack 穩定版和增強表單功能
- **Tailwind CSS**：工具類優先的 CSS 框架，用於快速構建自定義 UI
- **shadcn/ui**：構建在 Tailwind CSS 和 Radix UI 之上的無樣式組件庫，提供高度可定制的 UI 元素
- **Canvas API**：用於實現圖像合成和處理
- **TypeScript**：提供靜態類型檢查，增強開發體驗和代碼質量

本專案最初計劃使用 Vue.js 框架，後調整為 React + Next.js 技術棧，同時限定 UI 層僅使用 shadcn/ui 和 Tailwind CSS，以獲得更一致的開發體驗和設計語言。

### 核心特點

- **無註冊設計**：訪問即用，無需註冊與登入
- **極簡操作**：上傳 → 選擇設備 → 下載，三步完成
- **隱私保護**：所有處理在本地完成，不上傳圖片
- **輕量實現**：純前端架構，開發與維護成本低
- **高效部署**：支援 Vercel 一鍵部署

## 開發團隊指南

開發團隊應先閱讀 [AppShot MVP 方案](./AppShot_MVP_Plan.md) 以了解專案整體定位和規劃，再參考 [技術實現指南](./AppShot_Technical_Guide.md) 進行具體開發。

## 文檔更新記錄

- **2024-03-28**：初始文檔創建
  - MVP 方案文檔
  - 技術實現指南
  - 設計資源
- **2024-03-28**：技術棧更新
  - 從 Vue.js 更新為 React + Next.js
  - 從 Bulma CSS 更新為 Tailwind CSS
  - 架構圖與相關文檔更新
- **2024-03-30**：技術棧進一步更新
  - 明確使用 Next.js 14 最新版本
  - 限定 UI 框架僅使用 shadcn/ui 和 Tailwind CSS
  - 更新測試工具為 Vitest 和 Playwright
  - 添加 Docker 容器化部署支援
- **2024-12-20**：技術棧升級至 Next.js 15
  - 升級至 Next.js 15 最新版本
  - 加入對 TypeScript 配置文件的支援
  - 新增 Turbopack 穩定版開發環境支援
  - 整合 `next/form` 增強表單功能
  - 利用靜態指示器優化開發體驗

## 聯絡與支援

如有任何問題或建議，請通過以下方式聯絡我們：

- 專案 Issues：[GitHub Issues](https://github.com/example/appshot/issues)
- 開發者郵箱：developer@appshot.example.com

---

© 2024 AppShot Team. 保留所有權利。
