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
    <div className="w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className={`relative w-full sm:w-auto px-8 py-6 font-semibold text-base transition-all duration-300 overflow-hidden group ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              variant="default"
              onClick={downloadImage}
              disabled={disabled || isDownloading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    處理中...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transition-transform group-hover:translate-y-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    生成並下載截圖
                  </>
                )}
              </span>
              <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary/20 to-secondary/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-primary text-primary-foreground border-none">
            <p>下載高品質 PNG 設備截圖</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className="text-xs text-center text-muted-foreground mt-2">{disabled ? "請先上傳截圖以啟用下載功能" : "高品質 PNG 格式，隨時可用於 App Store"}</p>
    </div>
  );
}
