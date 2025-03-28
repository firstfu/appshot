"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import Header from "../components/Header";
import ImageUploader from "../components/ImageUploader";
import DeviceSelector from "../components/DeviceSelector";
import ImagePreview from "../components/ImagePreview";
import DownloadButton from "../components/DownloadButton";
import { useDeviceModels } from "../hooks/useDeviceModels";
import { useImageProcess } from "../hooks/useImageProcess";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const { deviceTypes, selectedDevice, changeDevice } = useDeviceModels();
  const { compressImage, isProcessing } = useImageProcess();

  const handleImageUpload = async (file: File) => {
    const compressedFile = await compressImage(file);
    if (compressedFile) {
      setUploadedImage(compressedFile);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 設置 Canvas 元素引用
  const handleCanvasRef = (canvas: HTMLCanvasElement | null) => {
    setCanvasElement(canvas);
  };

  return (
    <main className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-1 space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} isProcessing={isProcessing} />

            <DeviceSelector
              devices={deviceTypes}
              selectedDevice={selectedDevice}
              onSelectDevice={changeDevice}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />

            <div className="flex justify-center mt-4">
              <DownloadButton canvasElement={canvasElement} device={selectedDevice} disabled={!uploadedImage} />
            </div>
          </div>

          <div className="md:col-span-2">
            <ImagePreview image={uploadedImage} device={selectedDevice} darkMode={darkMode} onCanvasRef={handleCanvasRef} />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2024 AppShot - 無需註冊的 App Store 截圖生成工具</p>
        </footer>
      </div>
    </main>
  );
}
