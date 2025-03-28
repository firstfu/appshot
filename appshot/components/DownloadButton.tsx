"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { DeviceModel } from "../hooks/useDeviceModels";

interface DownloadButtonProps {
  canvasElement: HTMLCanvasElement | null;
  device: DeviceModel;
  disabled: boolean;
}

export default function DownloadButton({ canvasElement, device, disabled }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = () => {
    if (!canvasElement || disabled) return;

    setIsDownloading(true);

    try {
      const canvas = canvasElement;
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
          <Button
            size="lg"
            className="px-6 py-6 font-medium text-base w-full sm:w-auto"
            variant="default"
            onClick={downloadImage}
            disabled={disabled || isDownloading}
          >
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
