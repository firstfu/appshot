"use client";

import { useState, useRef, useEffect } from "react";
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
      <div className="bg-gradient-to-b from-background to-muted/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Header />

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="md:col-span-1 space-y-6">
                <ImageUploader onImageUpload={handleImageUpload} isProcessing={isProcessing} />

                <DeviceSelector
                  devices={deviceTypes}
                  selectedDevice={selectedDevice}
                  onSelectDevice={changeDevice}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />

                <div className="mt-6">
                  <DownloadButton canvasElement={canvasElement} device={selectedDevice} disabled={!uploadedImage} />
                </div>
              </div>

              <div className="md:col-span-2">
                <ImagePreview image={uploadedImage} device={selectedDevice} darkMode={darkMode} onCanvasRef={handleCanvasRef} />
              </div>
            </div>
          </div>

          <footer className="max-w-6xl mx-auto mt-16 pb-6 border-t border-border/40 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">© 2024 AppShot - 無需註冊的 App Store 截圖生成工具。使用本工具表示您同意遵守我們的服務條款。</p>
              </div>
              <div className="flex justify-start md:justify-end gap-4">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  幫助
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  隱私
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  條款
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
