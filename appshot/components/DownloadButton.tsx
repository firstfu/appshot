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
  const [showSuccess, setShowSuccess] = useState(false);

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

      // 顯示成功提示
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("下載失敗:", error);
      alert("圖片下載失敗，請重試");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* 成功提示浮層 */}
        {showSuccess && (
          <div className="absolute -top-14 left-0 right-0 bg-green-500/90 text-white rounded-lg p-3 shadow-lg text-center transform animate-fade-in-down">
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>下載成功！</span>
            </div>
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`w-full rounded-xl relative overflow-hidden bg-gradient-to-tr from-primary via-primary to-secondary btn-3d
                  ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
                  ${isDownloading ? "animate-pulse" : ""}
                `}
                onClick={downloadImage}
                disabled={disabled || isDownloading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-20 animate-shimmer"></div>
                <div className="relative z-10 flex items-center justify-center gap-3 text-white font-medium py-4">
                  {isDownloading ? (
                    <>
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white/90 animate-spin"></div>
                      <span className="text-lg">正在處理...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 transition-transform group-hover:translate-y-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="text-lg">下載截圖</span>
                    </>
                  )}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-primary text-primary-foreground border-none shadow-lg p-3">
              <p className="text-sm font-medium">下載高品質 PNG 設備截圖</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 額外功能選單 */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-colors
            ${disabled ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          disabled={disabled}
          onClick={() => window.open("about:blank", "_blank")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span>分享</span>
        </button>
        <button
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-colors
            ${disabled ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.8284 5.17705C11.6088 2.95739 8.05632 2.95739 5.83666 5.17705C3.617 7.39671 3.617 10.9492 5.83666 13.1689L12.0001 19.3323L18.1635 13.1689C20.3832 10.9492 20.3832 7.39671 18.1635 5.17705C15.9438 2.95739 12.3914 2.95739 10.1717 5.17705L9.75726 5.59146C9.36674 5.98198 8.73357 5.98198 8.34305 5.59146C7.95252 5.20094 7.95252 4.56777 8.34305 4.17725L8.75744 3.76284C11.7573 0.763373 16.5779 0.763373 19.5778 3.76284C22.5773 6.76233 22.5773 11.5837 19.5778 14.5832L12.0001 22.1609L4.42248 14.5832C1.42299 11.5837 1.42299 6.76233 4.42248 3.76284C7.42196 0.763373 12.2425 0.763373 15.242 3.76284L15.6564 4.17725C16.0469 4.56777 16.0469 5.20094 15.6564 5.59146C15.2658 5.98198 14.6327 5.98198 14.2422 5.59146L13.8278 5.17705Z"
            />
          </svg>
          <span>收藏</span>
        </button>
      </div>

      <div className="mt-2 text-xs text-center text-muted-foreground">
        <p>{disabled ? "請先上傳截圖以啟用下載功能" : "高品質 PNG 格式，完全符合 App Store 規範"}</p>
      </div>
    </div>
  );
}
