"use client";

import { useRef, useEffect, useState } from "react";
import { DeviceModel } from "../hooks/useDeviceModels";
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
    <Card className="w-full">
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
