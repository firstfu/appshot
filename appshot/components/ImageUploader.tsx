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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">上傳截圖</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={isProcessing ? undefined : handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <p className="text-sm text-muted-foreground">支援 JPG、PNG 格式，最大 10MB</p>
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
