"use client";

import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ImageUploader from "../components/ImageUploader";
import DeviceSelector from "../components/DeviceSelector";
import ImagePreview from "../components/ImagePreview";
import DownloadButton from "../components/DownloadButton";
import { useDeviceModels } from "../hooks/useDeviceModels";
import { useImageProcess } from "../hooks/useImageProcess";
import DesignInspirations from "../components/DesignInspirations";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const { deviceTypes, selectedDevice, changeDevice } = useDeviceModels();
  const { compressImage, isProcessing } = useImageProcess();
  const [showIntro, setShowIntro] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (file: File) => {
    const compressedFile = await compressImage(file);
    if (compressedFile) {
      setUploadedImage(compressedFile);
      setShowIntro(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // 設置 Canvas 元素引用
  const handleCanvasRef = (canvas: HTMLCanvasElement | null) => {
    setCanvasElement(canvas);
  };

  // 從Dribbble獲取設計趨勢
  useEffect(() => {
    const fetchDesignTrends = async () => {
      try {
        // 在此處實際獲取設計趨勢，已經通過DesignInspirations組件實現
        console.log("正在獲取設計趨勢數據");
      } catch (error) {
        console.error("獲取設計趨勢時出錯:", error);
      }
    };

    fetchDesignTrends();
  }, []);

  return (
    <main className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gradient-to-br from-background via-background to-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-6 lg:py-10">
          <Header />

          <div className="max-w-7xl mx-auto mt-6 lg:mt-12">
            {showIntro && !uploadedImage && (
              <div className="text-center mb-16 animate-fadeIn">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                  精美應用截圖，一鍵生成
                </h2>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">專業級應用商店展示圖，無需設計經驗。上傳、選擇，立即下載。</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                  <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center">簡單上傳</h3>
                    <p className="text-muted-foreground text-center">拖放您的應用截圖，或從剪貼簿貼上</p>
                  </div>
                  <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center">多種設備</h3>
                    <p className="text-muted-foreground text-center">選擇最新的iPhone、iPad或Android設備框架</p>
                  </div>
                  <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-center">快速下載</h3>
                    <p className="text-muted-foreground text-center">一鍵下載符合App Store規範的高質量圖片</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
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

                {uploadedImage && (
                  <div className="bg-card p-6 rounded-2xl shadow-md border border-border/50 mt-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      使用技巧
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-6 w-6 mr-2 mt-0.5 text-xs">1</span>
                        <span>嘗試切換深色/淺色模式以適應不同主題</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-6 w-6 mr-2 mt-0.5 text-xs">2</span>
                        <span>預覽區域可滾動查看更多設備型號</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-6 w-6 mr-2 mt-0.5 text-xs">3</span>
                        <span>您可以直接從剪貼簿貼上屏幕截圖</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* 如果已經上傳了圖片，則顯示設計靈感組件 */}
                {uploadedImage && (
                  <div className="mt-6 animate-fadeIn">
                    <DesignInspirations query={`app store screenshots ${darkMode ? "dark theme" : "light theme"}`} />
                  </div>
                )}
              </div>

              <div className="lg:col-span-8">
                <ImagePreview image={uploadedImage} device={selectedDevice} darkMode={darkMode} onCanvasRef={handleCanvasRef} />

                {!uploadedImage && (
                  <div className="mt-8 bg-card p-6 rounded-2xl shadow-md border border-border/50 animate-fadeIn">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      開始使用
                    </h3>
                    <p className="text-muted-foreground mb-4">上傳您的應用截圖，選擇設備框架，然後下載高質量的App Store宣傳圖片。</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <button
                        onClick={() => fileInputRef?.current?.click()}
                        className="btn-3d flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl text-lg font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                          />
                        </svg>
                        上傳截圖
                      </button>
                      <button className="btn-3d flex items-center justify-center gap-2 bg-muted text-foreground py-3 px-4 rounded-xl text-lg font-medium border border-border/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        查看教學
                      </button>
                    </div>
                  </div>
                )}

                {/* 如果沒有上傳圖片，則在預覽區下方顯示設計靈感 */}
                {!uploadedImage && (
                  <div className="mt-8 animate-fadeIn">
                    <DesignInspirations query={selectedDevice.type === "ios" ? "app store screenshots ios" : "google play screenshots android"} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <footer className="max-w-7xl mx-auto mt-16 pb-6 border-t border-border/40 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary w-5 h-5 mr-2"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M8 21h8"></path>
                    <path d="M12 17v4"></path>
                  </svg>
                  <h3 className="text-lg font-semibold">AppShot</h3>
                </div>
                <p className="text-sm text-muted-foreground">© 2024 AppShot - 無需註冊的 App Store 截圖生成工具。使用本工具表示您同意遵守我們的服務條款。</p>
              </div>
              <div className="flex flex-col md:items-end gap-4">
                <div className="flex gap-4">
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
                <div className="flex gap-3 md:mt-2">
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-muted-foreground" viewBox="0 0 16 16">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                  </a>
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-muted-foreground" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
