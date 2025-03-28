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

  // 當 canvasRef 變化時通知父元素
  useEffect(() => {
    if (onCanvasRef) {
      onCanvasRef(canvasRef.current);
    }
  }, [canvasRef.current, onCanvasRef]);

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

      // 使用內嵌方式創建設備外殼
      ctx.fillStyle = darkMode ? "#222" : "#f5f5f5";
      ctx.strokeStyle = darkMode ? "#444" : "#ddd";
      ctx.lineWidth = 5;

      // 繪製設備外框
      const frameX = device.paddingLeft - 20;
      const frameY = device.paddingTop - 40;
      const frameWidth = device.width + 40;
      const frameHeight = device.height + 80;

      // 圓角矩形
      const radius = 40;
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

      ctx.fill();
      ctx.stroke();

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
    <Card className="w-full overflow-hidden border-2 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6 relative min-h-[400px]">
        <div className="w-full h-full flex justify-center items-center">
          {isRendering && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary animate-spin mb-4"></div>
              <p className="text-base font-medium">正在渲染預覽...</p>
              <p className="text-sm text-muted-foreground mt-1">高品質渲染中，請稍候</p>
            </div>
          )}

          <div className={`relative transition-all duration-500 ${image ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
            <div className="absolute -inset-px rounded-lg bg-gradient-to-tr from-primary/20 via-secondary/20 to-primary/20 blur-sm -z-10"></div>
            <canvas
              ref={canvasRef}
              className={`max-w-full max-h-[70vh] object-contain rounded shadow-lg transition-transform duration-300 hover:scale-[1.01] ${
                image ? "" : "hidden"
              }`}
            />
          </div>

          {!image && (
            <div className="text-center py-12 px-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">預覽區域</h3>
              <p className="text-muted-foreground max-w-md">請先上傳您的應用截圖，在此處可以預覽模擬在不同設備上的效果</p>
              <div className="grid grid-cols-3 gap-4 mt-6 text-xs text-center w-full max-w-sm">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <span className="text-primary">1</span>
                  </div>
                  <span>上傳截圖</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <span className="text-primary">2</span>
                  </div>
                  <span>選擇設備</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    <span className="text-primary">3</span>
                  </div>
                  <span>下載成品</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
