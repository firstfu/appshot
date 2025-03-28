"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function ImageUploader({ onImageUpload, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const [dragEnterCount, setDragEnterCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragEnterCount(prev => prev + 1);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragEnterCount(prev => prev - 1);
    if (dragEnterCount <= 1) {
      setIsDragging(false);
      setDragEnterCount(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragEnterCount(0);

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

  // 處理從剪貼簿貼上圖片
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (isProcessing) return;

      if (e.clipboardData && e.clipboardData.items) {
        setIsPasting(true);
        const items = e.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              try {
                processFile(blob);
                e.preventDefault();
                break;
              } catch (error) {
                console.error("處理貼上的圖片時出錯:", error);
              } finally {
                setTimeout(() => setIsPasting(false), 500);
              }
            }
          }
        }

        setTimeout(() => setIsPasting(false), 500);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [isProcessing]);

  const processFile = (file: File) => {
    // 檢查文件類型
    if (!file.type.match("image/(jpeg|jpg|png|gif|webp)")) {
      alert("只接受常見圖片格式 (JPG、PNG、GIF、WebP)");
      return;
    }

    // 檢查文件大小
    if (file.size > 15 * 1024 * 1024) {
      alert("檔案大小不能超過 15MB");
      return;
    }

    onImageUpload(file);
  };

  return (
    <Card className="w-full overflow-hidden border-2 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-3">
        <CardTitle className="text-center flex items-center justify-center gap-2 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
          上傳應用截圖
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-5">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
            isDragging
              ? "border-secondary bg-secondary/10 scale-[0.99] shadow-inner border-opacity-100"
              : isPasting
              ? "border-accent bg-accent/10 scale-[0.99] shadow-inner border-opacity-100"
              : "border-border border-opacity-60 hover:border-primary/50 hover:bg-primary/5 hover:border-opacity-100",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={isProcessing ? undefined : handleButtonClick}
        >
          {/* 動畫效果背景 */}
          {isDragging && (
            <div className="absolute inset-0 bg-secondary/5 rounded-xl overflow-hidden">
              <div className="absolute w-40 h-40 -top-10 -left-10 bg-secondary/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute w-40 h-40 -bottom-10 -right-10 bg-secondary/10 rounded-full blur-xl animate-pulse delay-300"></div>
            </div>
          )}

          {isPasting && (
            <div className="absolute inset-0 bg-accent/5 rounded-xl overflow-hidden">
              <div className="absolute w-40 h-40 -top-10 -left-10 bg-accent/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute w-40 h-40 -bottom-10 -right-10 bg-accent/10 rounded-full blur-xl animate-pulse delay-300"></div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-3 relative z-10">
            {isProcessing ? (
              <div className="flex flex-col items-center py-4">
                <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-primary animate-spin mb-4"></div>
                <p className="text-lg font-medium">正在處理圖片...</p>
                <p className="text-sm text-muted-foreground mt-2">請稍候片刻，我們正在優化您的截圖</p>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "h-20 w-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 transition-transform duration-300 mb-1",
                    isDragging || isPasting ? "scale-110" : "hover:scale-110",
                    isDragging && "from-secondary/20 to-secondary/30",
                    isPasting && "from-accent/20 to-accent/30"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn("h-10 w-10 transition-colors duration-300", isDragging ? "text-secondary" : isPasting ? "text-accent" : "text-primary")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={isDragging || isPasting ? 2.5 : 2}
                      d={isDragging || isPasting ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-medium">{isDragging ? "放開以上傳圖片" : isPasting ? "正在從剪貼簿貼上..." : "拖放截圖至此處或點擊上傳"}</p>
                  <p className="text-sm text-muted-foreground">支援 JPG、PNG、GIF、WebP 格式，最大 15MB</p>
                </div>

                <div className="relative w-full max-w-xs mt-3 mb-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">或</span>
                  </div>
                </div>

                <p className="text-sm font-medium py-2 px-4 bg-muted/50 rounded-full text-muted-foreground inline-flex items-center">
                  <kbd className="bg-background border border-border rounded px-1.5 py-0.5 text-xs font-semibold mr-1">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="bg-background border border-border rounded px-1.5 py-0.5 text-xs font-semibold mr-1">V</kbd>
                  <span className="ml-1">直接從剪貼簿貼上</span>
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
          <div className="p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
            <p className="font-medium">高解析度</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">支援高DPI輸出</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
            <p className="font-medium">自動優化</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">智能調整與壓縮</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors duration-200">
            <p className="font-medium">多種設備</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">最新iPhone/Android</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
