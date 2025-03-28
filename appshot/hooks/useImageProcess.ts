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
