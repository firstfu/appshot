"use client";

import { useRef, useEffect, useState } from "react";
import { DeviceModel } from "../hooks/useDeviceModels";
import { Card, CardContent } from "../components/ui/card";

interface ImagePreviewProps {
  image: File | null;
  device: DeviceModel;
  darkMode: boolean;
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
}

export default function ImagePreview({ image, device, darkMode, onCanvasRef }: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // 當 canvasRef 變化時通知父元素
  useEffect(() => {
    if (onCanvasRef) {
      onCanvasRef(canvasRef.current);
    }
  }, [canvasRef.current, onCanvasRef]);

  // 監聽 Esc 鍵關閉放大視圖
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

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

      // 設置設備外殼的背景色和陰影
      ctx.save();

      // 外殼座標和尺寸
      const frameX = device.paddingLeft - 20;
      const frameY = device.paddingTop - 40;
      const frameWidth = device.width + 40;
      const frameHeight = device.height + 80;
      const radius = 40;

      // 繪製陰影
      ctx.shadowColor = darkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      // 圓角矩形路徑
      ctx.beginPath();
      ctx.moveTo(frameX + radius, frameY);
      ctx.lineTo(frameX + frameWidth - radius, frameY);
      ctx.arcTo(frameX + frameWidth, frameY, frameX + frameWidth, frameY + radius, radius);
      ctx.lineTo(frameX + frameWidth, frameY + frameHeight - radius);
      ctx.arcTo(frameX + frameWidth, frameY + frameHeight, frameX + frameWidth - radius, frameY + frameHeight, radius);
      ctx.lineTo(frameX + radius, frameY + frameHeight);
      ctx.arcTo(frameX, frameY + frameHeight, frameX, frameY + frameHeight - radius, radius);
      ctx.lineTo(frameX, frameY + radius);
      ctx.arcTo(frameX, frameY, frameX + radius, frameY, radius);
      ctx.closePath();

      // 外殼底色 - 使用漸變效果
      const gradient = ctx.createLinearGradient(frameX, frameY, frameX, frameY + frameHeight);
      if (darkMode) {
        gradient.addColorStop(0, "#333");
        gradient.addColorStop(1, "#222");
        ctx.fillStyle = gradient;
      } else {
        gradient.addColorStop(0, "#f8f8f8");
        gradient.addColorStop(1, "#e8e8e8");
        ctx.fillStyle = gradient;
      }
      ctx.fill();

      // 移除陰影設置以免影響後續繪製
      ctx.restore();

      // 繪製設備邊框
      ctx.strokeStyle = darkMode ? "#444" : "#ddd";
      ctx.lineWidth = 3;

      // 重新繪製路徑
      ctx.beginPath();
      ctx.moveTo(frameX + radius, frameY);
      ctx.lineTo(frameX + frameWidth - radius, frameY);
      ctx.arcTo(frameX + frameWidth, frameY, frameX + frameWidth, frameY + radius, radius);
      ctx.lineTo(frameX + frameWidth, frameY + frameHeight - radius);
      ctx.arcTo(frameX + frameWidth, frameY + frameHeight, frameX + frameWidth - radius, frameY + frameHeight, radius);
      ctx.lineTo(frameX + radius, frameY + frameHeight);
      ctx.arcTo(frameX, frameY + frameHeight, frameX, frameY + frameHeight - radius, radius);
      ctx.lineTo(frameX, frameY + radius);
      ctx.arcTo(frameX, frameY, frameX + radius, frameY, radius);
      ctx.closePath();
      ctx.stroke();

      // 繪製螢幕
      ctx.fillStyle = darkMode ? "#111" : "#fff";
      ctx.fillRect(device.paddingLeft, device.paddingTop, device.width, device.height);

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
      let imageHeight = device.height - device.statusBarHeight;
      if (device.bottomBarHeight > 0) {
        imageHeight -= device.bottomBarHeight;
      }

      ctx.drawImage(userImage, device.paddingLeft, device.paddingTop + device.statusBarHeight, imageWidth, imageHeight);

      // 新增物理按鈕
      drawDeviceButtons(ctx, device, darkMode, frameX, frameY, frameHeight);

      // 釋放 URL 對象
      URL.revokeObjectURL(userImage.src);

      // 延遲一點時間，讓動畫效果更明顯
      setTimeout(() => {
        setIsRendering(false);
      }, 300);
    };

    renderCanvas();
  }, [image, device, darkMode]);

  // 繪製物理按鈕
  const drawDeviceButtons = (ctx: CanvasRenderingContext2D, device: DeviceModel, isDarkMode: boolean, frameX: number, frameY: number, frameHeight: number) => {
    // 電源按鈕
    ctx.fillStyle = isDarkMode ? "#333" : "#ddd";
    const buttonWidth = 4;
    const buttonHeight = 30;

    // 假設電源按鈕在右側
    ctx.fillRect(frameX + device.width + device.paddingLeft * 2 - 2, frameY + 120, buttonWidth, buttonHeight);

    // 音量按鈕在左側
    ctx.fillRect(frameX - 2, frameY + 100, buttonWidth, buttonHeight);

    ctx.fillRect(frameX - 2, frameY + 140, buttonWidth, buttonHeight);
  };

  // 繪製狀態欄函數
  const drawStatusBar = (ctx: CanvasRenderingContext2D, device: DeviceModel, isDarkMode: boolean) => {
    const statusY = device.paddingTop;
    const statusHeight = device.statusBarHeight;

    // 動態顏色
    let statusBarColor;
    if (isDarkMode) {
      statusBarColor = "rgba(0, 0, 0, 0.9)";
    } else {
      statusBarColor = "rgba(255, 255, 255, 0.95)";
    }

    // 設置顏色
    ctx.fillStyle = statusBarColor;
    ctx.fillRect(device.paddingLeft, statusY, device.width, statusHeight);

    // 繪製時間、電池等圖標
    ctx.fillStyle = isDarkMode ? "white" : "black";
    ctx.font = "bold 14px -apple-system, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 時間
    ctx.fillText("10:30", device.paddingLeft + device.width / 2, statusY + statusHeight / 2);

    // 信號圖標 (左側)
    ctx.textAlign = "left";
    ctx.font = "12px -apple-system, system-ui, sans-serif";

    // 訊號
    ctx.fillText("●●●●●", device.paddingLeft + 15, statusY + statusHeight / 2);

    // 電池圖標 (右側)
    ctx.textAlign = "right";

    // 電池
    ctx.fillRect(device.paddingLeft + device.width - 35, statusY + (statusHeight - 10) / 2, 20, 10);
    ctx.strokeStyle = isDarkMode ? "white" : "black";
    ctx.strokeRect(device.paddingLeft + device.width - 35, statusY + (statusHeight - 10) / 2, 20, 10);
    ctx.fillRect(device.paddingLeft + device.width - 15, statusY + (statusHeight - 6) / 2, 2, 6);
  };

  // 繪製底部手勢條
  const drawBottomBar = (ctx: CanvasRenderingContext2D, device: DeviceModel, isDarkMode: boolean) => {
    const barY = device.paddingTop + device.height - device.bottomBarHeight;

    // 背景條
    ctx.fillStyle = isDarkMode ? "rgba(30, 30, 30, 0.95)" : "rgba(250, 250, 250, 0.95)";
    ctx.fillRect(device.paddingLeft, barY, device.width, device.bottomBarHeight);

    // 繪製手勢條
    ctx.fillStyle = isDarkMode ? "rgba(160, 160, 160, 0.8)" : "rgba(180, 180, 180, 0.8)";
    const barWidth = 120;
    const barHeight = 5;
    ctx.beginPath();
    ctx.roundRect(device.paddingLeft + (device.width - barWidth) / 2, barY + (device.bottomBarHeight - barHeight) / 2, barWidth, barHeight, barHeight / 2);
    ctx.fill();
  };

  const toggleZoom = () => {
    if (image) {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden border-2 transition-all duration-200 hover:shadow-md relative">
        <CardContent className="p-6 relative min-h-[450px]">
          <div className="w-full h-full flex justify-center items-center">
            {isRendering && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="h-16 w-16 rounded-full border-t-3 border-b-3 border-primary animate-spin mb-4"></div>
                <p className="text-lg font-medium">正在生成預覽...</p>
                <p className="text-sm text-muted-foreground mt-2">為您打造精美設備框架</p>
              </div>
            )}

            <div className={`relative transition-all duration-700 ${image ? "scale-100 opacity-100" : "scale-95 opacity-0"}`} onClick={toggleZoom}>
              {/* 動態背景光暈效果 */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 animate-pulse blur-lg -z-10"></div>

              {/* 裝飾元素 */}
              {image && (
                <>
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary/20 rounded-full blur-sm"></div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary/20 rounded-full blur-sm"></div>
                </>
              )}

              <canvas
                ref={canvasRef}
                className={`max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl transition-all cursor-pointer duration-500
                  ${image ? "hover:shadow-2xl hover:scale-[1.02]" : "hidden"}
                  ${isRendering ? "opacity-80 blur-[1px]" : "opacity-100"}`}
                title={image ? "點擊放大預覽" : ""}
              />

              {image && (
                <div className="absolute right-3 bottom-3 bg-background/80 backdrop-blur-sm p-1.5 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3h-6" />
                  </svg>
                </div>
              )}
            </div>

            {!image && (
              <div className="text-center py-14 px-8 flex flex-col items-center animate-fadeIn">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium mb-3">預覽區域</h3>
                <p className="text-muted-foreground max-w-md text-base">上傳您的應用截圖後，在此處預覽模擬在不同設備上的效果</p>

                <div className="grid grid-cols-3 gap-6 mt-8 max-w-md w-full">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary font-medium">1</div>
                    <span className="text-sm">上傳截圖</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2 text-secondary font-medium">2</div>
                    <span className="text-sm">選擇設備</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2 text-accent font-medium">3</div>
                    <span className="text-sm">下載成品</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 全螢幕預覽模式 */}
      {isZoomed && image && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-8" onClick={toggleZoom}>
          <div className="relative max-w-7xl w-full max-h-screen flex flex-col items-center">
            <button className="absolute top-0 right-0 p-2 bg-card rounded-full shadow-md z-10 hover:bg-muted transition-colors" onClick={toggleZoom}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="overflow-auto max-h-[calc(100vh-120px)] p-4">
              <canvas ref={canvasRef} className="max-w-full object-contain shadow-2xl rounded-lg" />
            </div>

            <p className="text-sm text-muted-foreground mt-4">點擊任意位置或按 ESC 鍵關閉</p>
          </div>
        </div>
      )}
    </>
  );
}
