"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

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
    <Card className="w-full overflow-hidden border-2 transition-all duration-200 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-2">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
          上傳截圖
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
            isDragging ? "border-secondary bg-secondary/5 scale-[0.99] shadow-inner" : "border-border hover:border-primary/50 hover:bg-primary/5",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={isProcessing ? undefined : handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary animate-spin mb-2"></div>
                <p className="text-base font-medium">正在處理圖片...</p>
                <p className="text-sm text-muted-foreground mt-1">請稍候片刻</p>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 text-primary transition-transform duration-300",
                    isDragging ? "scale-110" : "hover:scale-110"
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-base font-medium mt-2">拖放截圖至此處或點擊上傳</p>
                <p className="text-sm text-muted-foreground">支援 JPG、PNG 格式，最大 10MB</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <span className="inline-block w-5 h-px bg-muted-foreground/30 mr-2"></span>
                  或直接從剪貼簿貼上
                  <span className="inline-block w-5 h-px bg-muted-foreground/30 ml-2"></span>
                </div>
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

        <div className="mt-3 grid grid-cols-3 gap-1 text-xs text-center">
          <div className="p-1 rounded bg-muted/50">
            <p className="font-medium">高解析度</p>
          </div>
          <div className="p-1 rounded bg-muted/50">
            <p className="font-medium">自動壓縮</p>
          </div>
          <div className="p-1 rounded bg-muted/50">
            <p className="font-medium">多種設備</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
