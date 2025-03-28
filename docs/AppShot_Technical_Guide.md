# AppShot 技術實現指南

本文檔提供 AppShot MVP 版本的技術實現細節與指導，供開發團隊參考。

## 1. 開發環境設置

### 1.1 基礎環境

```bash
# 安裝 Node.js (建議使用 v20 或更高版本)

# 使用 Create Next App 初始化項目，使用最新的 Next.js 15
npx create-next-app@latest appshot-lite
# 按照提示選擇:
# ✅ 使用 TypeScript
# ✅ 使用 ESLint
# ✅ 使用 Tailwind CSS
# ✅ 使用 'src/' 目錄
# ✅ 使用 App Router (推薦)
# ✅ 自定義導入別名 (例如 @/*)
# ✅ 使用 next/font (推薦)

cd appshot-lite

# 安裝圖像處理相關套件
npm install browser-image-compression

# 安裝 shadcn/ui CLI 工具
npm install -D @shadcn/ui

# 初始化 shadcn/ui
npx shadcn-ui@latest init
# 選擇設定:
# 樣式: Default
# 基本色彩: Slate
# 全局 CSS 檔案位置: src/app/globals.css
# CSS 變數位置: src/app/globals.css
# 前綴: ui
# 組件目錄: src/components/ui
# 公用目錄: src/lib/utils.ts
# React 伺服器組件: Yes
# 設定已保存!

# 安裝必要的 shadcn/ui 組件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toggle
npx shadcn-ui@latest add tooltip
```

### 1.2 專案結構

```
appshot-lite/
├── public/
│   ├── favicon.ico
│   └── device-models/       # 設備模型素材
│       ├── iphone-14.png
│       └── ipad-pro.png
├── src/
│   ├── app/                 # Next.js 應用路由
│   │   ├── page.tsx         # 主頁面
│   │   ├── layout.tsx       # 布局組件
│   │   └── globals.css      # 全局樣式
│   ├── components/          # React 組件
│   │   ├── Header.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── DeviceSelector.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── DownloadButton.tsx
│   │   └── ui/              # shadcn/ui 組件
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── select.tsx
│   │       └── ...
│   ├── hooks/               # 自定義 React Hooks
│   │   ├── useImageProcess.ts   # 圖像處理邏輯
│   │   └── useDeviceModels.ts   # 設備模型邏輯
│   ├── lib/                 # 工具函數庫
│   │   └── utils.ts         # shadcn/ui 工具函數
│   ├── types/               # TypeScript 類型定義
│   │   └── index.ts
├── components.json          # shadcn/ui 配置文件
├── next.config.ts           # Next.js 15 支援 TypeScript 配置
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### 1.3 Next.js 15 新特性應用

AppShot 專案將利用 Next.js 15 的以下新特性：

1. **使用 TypeScript 配置**：將 `next.config.js` 改為 `next.config.ts` 以獲得更好的類型支援

   ```typescript
   // next.config.ts
   import { defineConfig } from "next";

   const nextConfig = defineConfig({
     reactStrictMode: true,
     swcMinify: true,
   });

   export default nextConfig;
   ```

2. **增強的表單功能**：利用 `next/form` 實現客戶端導航的表單體驗

   ```tsx
   // src/components/EnhancedForm.tsx
   "use client";

   import { form } from "next/form";

   export default function EnhancedForm() {
     return (
       <form action="/submit" {...form()}>
         <input name="field" />
         <button type="submit">Submit</button>
       </form>
     );
   }
   ```

3. **靜態指示器**：在開發模式下識別靜態和動態路由，優化應用性能

4. **Turbopack 穩定版**：使用更快的開發服務器
   ```bash
   # 使用 Turbopack 運行開發服務器
   npm run dev -- --turbo
   ```

## 2. 核心功能實現

### 2.1 圖像上傳與壓縮

```typescript
// src/hooks/useImageProcess.ts
import { useState } from "react";
import imageCompression from "browser-image-compression";

export function useImageProcess() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compressImage = async (file: File): Promise<File | null> => {
    setIsProcessing(true);
    setError(null);

    const options = {
      maxSizeMB: 1, // 最大文件大小
      maxWidthOrHeight: 2000, // 最大寬度或高度
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (err) {
      console.error("圖像壓縮失敗:", err);
      setError("圖像處理失敗，請重試");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { compressImage, isProcessing, error };
}
```

### 2.2 設備模型管理

```typescript
// src/hooks/useDeviceModels.ts
import { useState } from "react";

export interface DeviceModel {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  statusBarHeight: number;
  bottomBarHeight: number;
  paddingTop: number;
  paddingLeft: number;
}

export function useDeviceModels() {
  const deviceTypes: DeviceModel[] = [
    {
      id: "iphone-14",
      name: "iPhone 14/15 (6.1吋)",
      image: "/device-models/iphone-14.png",
      width: 1170, // 設備截圖區域寬度
      height: 2532, // 設備截圖區域高度
      statusBarHeight: 47, // 狀態欄高度
      bottomBarHeight: 34, // 底部手勢條高度
      paddingTop: 200, // 頂部邊距
      paddingLeft: 32, // 左邊距
    },
    {
      id: "ipad-pro",
      name: "iPad Pro 12.9吋",
      image: "/device-models/ipad-pro.png",
      width: 2048,
      height: 2732,
      statusBarHeight: 24,
      bottomBarHeight: 0,
      paddingTop: 120,
      paddingLeft: 62,
    },
  ];

  const [selectedDevice, setSelectedDevice] = useState<DeviceModel>(deviceTypes[0]);

  const changeDevice = (deviceId: string) => {
    const device = deviceTypes.find(d => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
    }
  };

  return { deviceTypes, selectedDevice, changeDevice };
}
```

### 2.3 Canvas 圖像處理

```tsx
// src/components/ImagePreview.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { DeviceModel } from "@/hooks/useDeviceModels";
import { Card, CardContent } from "@/components/ui/card";

interface ImagePreviewProps {
  image: File | null;
  device: DeviceModel;
  darkMode: boolean;
}

export default function ImagePreview({ image, device, darkMode }: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const renderCanvas = async () => {
      setIsRendering(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 設置畫布大小為設備輸出尺寸
      canvas.width = device.width + device.paddingLeft * 2;
      canvas.height = device.height + device.paddingTop + device.paddingTop / 2;

      // 清空畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 繪製設備外殼
      const deviceImage = new Image();
      deviceImage.src = device.image;
      await new Promise(resolve => {
        deviceImage.onload = resolve;
      });
      ctx.drawImage(deviceImage, 0, 0, canvas.width, canvas.height);

      // 繪製狀態欄
      drawStatusBar(ctx, device, darkMode);

      // 繪製底部手勢條 (如果有)
      if (device.bottomBarHeight > 0) {
        drawBottomBar(ctx, device, darkMode);
      }

      // 繪製用戶圖片
      const userImage = new Image();
      userImage.src = URL.createObjectURL(image);
      await new Promise(resolve => {
        userImage.onload = resolve;
      });

      // 計算圖片在設備中的位置和尺寸
      const imageWidth = device.width;
      const imageHeight = device.height - device.statusBarHeight;
      if (device.bottomBarHeight > 0) {
        imageHeight -= device.bottomBarHeight;
      }

      ctx.drawImage(userImage, device.paddingLeft, device.paddingTop + device.statusBarHeight, imageWidth, imageHeight);

      // 釋放 URL 對象
      URL.revokeObjectURL(userImage.src);
      setIsRendering(false);
    };

    renderCanvas();
  }, [image, device, darkMode]);

  // 繪製狀態欄函數
  const drawStatusBar = (ctx: CanvasRenderingContext2D, device: DeviceModel, isDarkMode: boolean) => {
    const statusY = device.paddingTop;
    const statusHeight = device.statusBarHeight;

    // 設置顏色
    ctx.fillStyle = isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(device.paddingLeft, statusY, device.width, statusHeight);

    // 繪製時間、電池等圖標
    ctx.fillStyle = isDarkMode ? "white" : "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";

    // 時間
    ctx.fillText("10:30", device.paddingLeft + device.width / 2, statusY + 16);

    // 電池圖標
    ctx.fillText("100%", device.paddingLeft + device.width - 40, statusY + 16);

    // 信號圖標
    ctx.fillText("●●●●", device.paddingLeft + 40, statusY + 16);
  };

  // 繪製底部手勢條
  const drawBottomBar = (ctx: CanvasRenderingContext2D, device: DeviceModel, isDarkMode: boolean) => {
    const barY = device.paddingTop + device.height - device.bottomBarHeight;

    ctx.fillStyle = isDarkMode ? "rgba(45, 45, 45, 0.8)" : "rgba(245, 245, 245, 0.8)";
    ctx.fillRect(device.paddingLeft, barY, device.width, device.bottomBarHeight);

    // 繪製手勢條
    ctx.fillStyle = isDarkMode ? "rgb(160, 160, 160)" : "rgb(190, 190, 190)";
    const barWidth = 120;
    const barHeight = 5;
    ctx.fillRect(device.paddingLeft + (device.width - barWidth) / 2, barY + (device.bottomBarHeight - barHeight) / 2, barWidth, barHeight);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="w-full flex justify-center items-center">
          {isRendering && (
            <div className="text-center py-8">
              <p>正在渲染預覽...</p>
            </div>
          )}
          <canvas ref={canvasRef} className={`max-w-full max-h-[70vh] object-contain ${isRendering ? "hidden" : ""}`} />
          {!image && (
            <div className="text-center py-8">
              <p>請先上傳截圖</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.4 下載功能

```tsx
// src/components/DownloadButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DeviceModel } from "@/hooks/useDeviceModels";

interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  device: DeviceModel;
  disabled: boolean;
}

export default function DownloadButton({ canvasRef, device, disabled }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = () => {
    if (!canvasRef.current || disabled) return;

    setIsDownloading(true);

    try {
      const canvas = canvasRef.current;
      const deviceName = device.id;
      const timestamp = new Date().getTime();
      const fileName = `AppShot_${deviceName}_${timestamp}.png`;

      // 轉換 canvas 為 PNG
      const dataUrl = canvas.toDataURL("image/png");

      // 創建下載連結
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("下載失敗:", error);
      alert("圖片下載失敗，請重試");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="lg" className="px-6 py-6 font-medium text-base" variant="default" onClick={downloadImage} disabled={disabled || isDownloading}>
            {isDownloading ? "處理中..." : "生成並下載截圖"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>下載 PNG 格式的設備截圖</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### 2.5 圖像上傳組件

```tsx
// src/components/ImageUploader.tsx
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function ImageUploader({ onImageUpload, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    // 檢查文件類型
    if (!file.type.match("image/(jpeg|jpg|png)")) {
      alert("只接受 JPG 或 PNG 圖片格式");
      return;
    }

    // 檢查文件大小
    if (file.size > 10 * 1024 * 1024) {
      alert("檔案大小不能超過 10MB");
      return;
    }

    onImageUpload(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">上傳截圖</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={isProcessing ? undefined : handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {isProcessing ? (
              <p className="text-base">正在處理圖片...</p>
            ) : (
              <>
                <p className="text-base font-medium">拖放截圖至此處或點擊上傳</p>
                <p className="text-sm text-gray-500">支援 JPG、PNG 格式，最大 10MB</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.6 設備選擇器組件

```tsx
// src/components/DeviceSelector.tsx
"use client";

import { DeviceModel } from "@/hooks/useDeviceModels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

interface DeviceSelectorProps {
  devices: DeviceModel[];
  selectedDevice: DeviceModel;
  onSelectDevice: (deviceId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function DeviceSelector({ devices, selectedDevice, onSelectDevice, darkMode, onToggleDarkMode }: DeviceSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">設備選項</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="device-select" className="text-sm font-medium">
              選擇設備型號
            </label>
            <Select value={selectedDevice.id} onValueChange={onSelectDevice}>
              <SelectTrigger id="device-select">
                <SelectValue placeholder="選擇設備" />
              </SelectTrigger>
              <SelectContent>
                {devices.map(device => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode-toggle" className="text-sm font-medium">
              暗色模式
            </label>
            <Toggle id="dark-mode-toggle" pressed={darkMode} onPressedChange={onToggleDarkMode} aria-label="Toggle dark mode">
              {darkMode ? "開啟" : "關閉"}
            </Toggle>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.7 主頁面組件

```tsx
// src/app/page.tsx
"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import DeviceSelector from "@/components/DeviceSelector";
import ImagePreview from "@/components/ImagePreview";
import DownloadButton from "@/components/DownloadButton";
import { useDeviceModels } from "@/hooks/useDeviceModels";
import { useImageProcess } from "@/hooks/useImageProcess";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { deviceTypes, selectedDevice, changeDevice } = useDeviceModels();
  const { compressImage, isProcessing } = useImageProcess();

  const handleImageUpload = async (file: File) => {
    const compressedImage = await compressImage(file);
    if (compressedImage) {
      setUploadedImage(compressedImage);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="upload" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">上傳截圖</TabsTrigger>
              <TabsTrigger value="preview">預覽編輯</TabsTrigger>
              <TabsTrigger value="download" disabled={!uploadedImage}>
                下載
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-4">
              <ImageUploader onImageUpload={handleImageUpload} isProcessing={isProcessing} />
            </TabsContent>
            <TabsContent value="preview" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <DeviceSelector
                    devices={deviceTypes}
                    selectedDevice={selectedDevice}
                    onSelectDevice={changeDevice}
                    darkMode={isDarkMode}
                    onToggleDarkMode={toggleDarkMode}
                  />
                </div>
                <div className="md:col-span-2">
                  <ImagePreview image={uploadedImage} device={selectedDevice} darkMode={isDarkMode} ref={canvasRef} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="download" className="pt-4">
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <ImagePreview image={uploadedImage} device={selectedDevice} darkMode={isDarkMode} ref={canvasRef} />
                <div className="mt-6 text-center">
                  <DownloadButton canvasRef={canvasRef} device={selectedDevice} disabled={!uploadedImage || isProcessing} />
                  <p className="mt-4 text-sm text-gray-600">使用提示: 高品質的截圖建議使用PNG格式，寬度至少1242像素</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <footer className="mt-12 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">
            提供反饋
          </a>
          <p>AppShot © 2024</p>
          <a href="https://github.com/example/appshot" className="hover:text-gray-900" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
```

## 3. 部署指南

### 3.1 Vercel 部署 (推薦)

將專案部署到 Vercel 平台是最簡便的方法，特別是針對 Next.js 15 應用。

```bash
# 首先確保專案已推送到 GitHub
git add .
git commit -m "AppShot MVP ready for deployment with Next.js 15"
git push

# 使用 Vercel CLI 部署
npm install -g vercel
vercel
```

或者直接通過 Vercel 網頁界面部署：

1. 在 [Vercel](https://vercel.com) 上註冊或登入
2. 點擊「Add New...」→「Project」
3. 從 GitHub 導入專案倉庫
4. Vercel 會自動識別為 Next.js 專案並配置最佳設置
5. 點擊「Deploy」完成部署

Vercel 對 Next.js 15 有原生支援，自動優化包括：

- 自動應用緩存策略
- 邊緣計算網絡分發
- 自動縮放與零配置部署
- Next.js 15 靜態與服務器組件的智能識別

### 3.2 靜態導出部署 (GitHub Pages 或任何靜態主機)

Next.js 15 改進了靜態導出能力，可以部署到任何靜態網站主機。

1. 配置 `next.config.ts`：

```typescript
import { defineConfig } from "next";

const nextConfig = defineConfig({
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === "production" ? "/appshot" : "",
  trailingSlash: true,
});

export default nextConfig;
```

2. 設置 `package.json` 添加導出和部署腳本：

```json
"scripts": {
  "dev": "next dev --turbo",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "export": "next build",
  "deploy:gh-pages": "npm run export && touch out/.nojekyll && gh-pages -d out"
},
"devDependencies": {
  "gh-pages": "^6.1.1"
}
```

3. 安裝 `gh-pages` 工具(如果需要部署到 GitHub Pages)：

```bash
npm install -D gh-pages
```

4. 執行部署命令：

```bash
npm run deploy:gh-pages
```

### 3.3 Docker 容器部署

Next.js 15 改進了容器化支援，特別是在多段構建和性能優化方面：

1. 在專案根目錄創建 `Dockerfile`：

```dockerfile
FROM node:20-alpine AS base

# 安裝依賴環境
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 建置應用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 執行應用
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Next.js 15 最佳實踐
# 啟用 compression 和提供最佳快取控制
ENV NEXT_COMPRESS true
ENV NEXT_CACHE_HANDLER memory

CMD ["node", "server.js"]
```

2. 建立 `.dockerignore` 文件：

```
node_modules
.next
out
Dockerfile
.dockerignore
.git
.github
```

3. 更新 `next.config.ts` 以支援 Docker 部署：

```typescript
import { defineConfig } from "next";

const nextConfig = defineConfig({
  output: "standalone",
  experimental: {
    optimizeCss: true, // 啟用 CSS 優化
    optimizeServerReact: true, // 優化伺服器端 React 渲染
  },
});

export default nextConfig;
```

4. 建置並運行 Docker 映像：

```bash
# 建置映像
docker build -t appshot-lite .

# 運行容器
docker run -p 3000:3000 appshot-lite
```

## 4. 測試指南

### 4.1 單元與組件測試

AppShot 使用 Vitest 和 React Testing Library 進行測試，這些工具與 Next.js 有良好的整合。

```bash
# 安裝測試相關依賴
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

# 配置 vitest.config.ts
```

創建 `vitest.config.ts` 文件：

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

創建測試設置文件 `src/test/setup.ts`：

```typescript
import "@testing-library/jest-dom/extend-expect";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 清理每次測試後的渲染結果
afterEach(() => {
  cleanup();
});

// 確保 mockRejectedValue 和 mockResolvedValue 的類型檢查能正常工作
expect.extend({
  toBeInTheDocument: received => {
    const { isNot, utils } = expect.getState();
    return {
      pass: received?.classList !== undefined,
      message: () => `expected ${utils.printReceived(received)} ${isNot ? "not " : ""}to be in the document`,
    };
  },
});
```

修改 `package.json` 添加測試腳本：

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
},
```

組件測試示例 `src/components/__tests__/ImageUploader.test.tsx`：

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ImageUploader from "../ImageUploader";

describe("ImageUploader", () => {
  const mockOnImageUpload = vi.fn();
  const setup = (isProcessing = false) => {
    return render(<ImageUploader onImageUpload={mockOnImageUpload} isProcessing={isProcessing} />);
  };

  it("渲染上傳區域", () => {
    setup();
    expect(screen.getByText(/拖放截圖至此處或點擊上傳/i)).toBeInTheDocument();
  });

  it("當處理中時顯示載入狀態", () => {
    setup(true);
    expect(screen.getByText(/正在處理圖片.../i)).toBeInTheDocument();
  });

  it("點擊上傳區域觸發文件選擇", async () => {
    const { container } = setup();
    const uploadDiv = container.querySelector('div[class*="border-dashed"]');

    const user = userEvent.setup();
    await user.click(uploadDiv!);

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it("選擇文件時呼叫上傳函數", () => {
    const { container } = setup();
    const fileInput = container.querySelector('input[type="file"]');

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });
    }

    expect(mockOnImageUpload).toHaveBeenCalledWith(file);
  });

  it("檢查大檔案上傳", () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    const { container } = setup();
    const fileInput = container.querySelector('input[type="file"]');

    // 創建一個超過 10MB 的虛擬大檔案
    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], "large.png", { type: "image/png" });
    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
    }

    expect(alertMock).toHaveBeenCalledWith("檔案大小不能超過 10MB");
    expect(mockOnImageUpload).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });
});
```

### 4.2 Next.js 特有的測試

對於 Next.js 特有功能的測試，如路由和 SSG/SSR，使用 Next.js 的官方測試工具：

```bash
# 安裝 next/jest 配置工具
npm install -D @next/jest
```

創建 `jest.config.js` 文件：

```javascript
const nextJest = require("@next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
```

創建 `jest.setup.js` 文件：

```javascript
import "@testing-library/jest-dom/extend-expect";
```

添加 Jest 測試腳本到 `package.json`：

```json
"scripts": {
  "jest": "jest",
  "jest:watch": "jest --watch"
},
```

Next.js 頁面組件測試示例 `src/app/__tests__/page.test.tsx`：

```tsx
import { render, screen } from "@testing-library/react";
import Home from "../page";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Home 頁面", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("渲染主要功能區塊", () => {
    render(<Home />);

    expect(screen.getByText(/上傳截圖/i)).toBeInTheDocument();
    expect(screen.getByText(/預覽編輯/i)).toBeInTheDocument();
    expect(screen.getByText(/下載/i)).toBeInTheDocument();
  });
});
```

### 4.3 端到端測試

使用 Playwright 進行端到端測試，確保整個應用在真實瀏覽器環境中正常工作：

```bash
# 安裝 Playwright
npm init playwright@latest
```

選擇默認配置後，將創建 `playwright.config.ts` 文件，可以根據需要調整。

創建第一個端到端測試 `e2e/basic-flow.spec.ts`：

```typescript
import { test, expect } from "@playwright/test";

test("基本使用流程測試", async ({ page }) => {
  // 訪問主頁
  await page.goto("/");

  // 確認頁面標題
  await expect(page).toHaveTitle(/AppShot/);

  // 確認上傳區域存在
  const uploadArea = page.locator("text=拖放截圖至此處或點擊上傳");
  await expect(uploadArea).toBeVisible();

  // 模擬上傳文件
  const fileInputHandle = await page.$('input[type="file"]');
  await fileInputHandle?.setInputFiles({
    name: "test-image.png",
    mimeType: "image/png",
    buffer: Buffer.from("fake image content"),
  });

  // 等待頁面處理圖片
  await page.waitForSelector("canvas", { state: "visible" });

  // 切換到設備選擇頁籤
  await page.click("text=預覽編輯");

  // 選擇設備
  await page.selectOption("select", { label: "iPhone 14/15 (6.1吋)" });

  // 切換到下載頁籤
  await page.click("text=下載");

  // 確認下載按鈕可用
  const downloadButton = page.locator("text=生成並下載截圖");
  await expect(downloadButton).toBeEnabled();
});
```

運行端到端測試：

```bash
npx playwright test
```

### 4.4 效能測試重點

使用 Next.js 內建的效能分析工具與 Lighthouse 來測試：

```bash
# 啟用 Next.js 效能分析
ANALYZE=true npm run build
```

重點測試指標：

1. **頁面加載性能**：

   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)

2. **圖像處理性能**：

   - 大圖片壓縮時間
   - Canvas 繪製時間
   - 記憶體使用峰值

3. **響應性測試**：

   - 各種設備和螢幕尺寸的響應性
   - 觸屏設備的互動體驗

4. **網絡性能**：
   - 資源載入時間
   - 靜態資源緩存效果
   - 首屏渲染時間

## 5. 開發注意事項

1. **客戶端元件標記**: 使用 Canvas API 的元件必須標記為 'use client'
2. **圖像處理效能**: 使用 Web Worker 進行圖像處理，避免阻塞主線程
3. **記憶體管理**: 使用完畢後釋放圖像資源 (URL.revokeObjectURL)
4. **設備模型設計**: 確保模型設計簡潔，與實際設備有足夠差異避免版權問題
5. **錯誤處理**: 妥善處理圖像處理失敗、下載錯誤等異常情況
6. **Tailwind 配置**: 確保自定義樣式在 tailwind.config.js 中正確配置

## 6. 後續擴展準備

### 6.1 擴充設備模型

新增設備時需要準備:

- 設備外殼圖像 (PNG，透明背景)
- 設備參數 (尺寸、邊距、狀態欄高度等)
- 更新 `useDeviceModels.ts` 中的設備列表

### 6.2 批次處理功能

```typescript
// 批次處理示意代碼
const processBatchImages = async (imageFiles: File[]) => {
  const results: { file: string; dataUrl: string }[] = [];

  for (const file of imageFiles) {
    // 壓縮圖片
    const compressed = await compressImage(file);
    if (!compressed) continue;

    // 使用選定設備渲染
    const result = await renderDeviceImage(compressed);

    results.push({
      file: file.name,
      dataUrl: result,
    });
  }

  return results;
};
```

### 6.3 統計分析準備

```tsx
// src/app/layout.tsx 中添加匿名分析代碼 (示例使用 Plausible)
import { Analytics } from "@/components/Analytics";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head />
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

// src/components/Analytics.tsx
export function Analytics() {
  return <script defer data-domain="appshot.example.com" src="https://plausible.io/js/plausible.js" />;
}
```

## 7. 資源與參考

- React 文檔: https://react.dev/
- Next.js 文檔: https://nextjs.org/docs
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- browser-image-compression: https://github.com/Donaldcwl/browser-image-compression
- Tailwind CSS: https://tailwindcss.com/
- App Store 截圖尺寸要求: https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications
