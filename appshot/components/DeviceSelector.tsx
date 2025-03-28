"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "../lib/utils";
import { DeviceModel } from "../hooks/useDeviceModels";

interface DeviceSelectorProps {
  devices: DeviceModel[];
  selectedDevice: DeviceModel;
  onSelectDevice: (deviceId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function DeviceSelector({ devices, selectedDevice, onSelectDevice, darkMode, onToggleDarkMode }: DeviceSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>("ios");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // 切換時預設選擇當前類別的第一個設備
    const deviceOfType = devices.find(d => d.type === tab);
    if (deviceOfType) {
      onSelectDevice(deviceOfType.id);
    }
  };

  const filteredDevices = devices.filter(d => d.type === activeTab);

  return (
    <Card className="w-full overflow-hidden border-2 transition-all duration-200 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-3">
        <CardTitle className="text-center flex items-center justify-center gap-2 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <path d="M12 18h.01"></path>
          </svg>
          選擇設備外觀
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {/* 平台選擇 Tab */}
          <div className="flex p-1 rounded-xl bg-muted/50">
            <button
              className={cn(
                "flex-1 py-2 text-center rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === "ios" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => handleTabChange("ios")}
            >
              <div className="flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5a3 3 0 0 1 6 0v0a3 3 0 0 1-6 0v0Z" />
                  <path d="M4 10h16" />
                  <path d="M17 15.7V15a2 2 0 0 0-2-2h-.5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h.5a2 2 0 0 0 1.764-1.048" />
                  <path d="M13 15.5V15a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-.5" />
                  <path d="M9 10v10" />
                </svg>
                iPhone / iPad
              </div>
            </button>
            <button
              className={cn(
                "flex-1 py-2 text-center rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === "android" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => handleTabChange("android")}
            >
              <div className="flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2" />
                  <path d="M7 16h.01" />
                  <path d="M2 8l2 2 2-2" />
                  <path d="M2 16l2-2 2 2" />
                </svg>
                Android
              </div>
            </button>
          </div>

          {/* 主題切換按鈕 */}
          <div className="pt-2 px-1">
            <button
              onClick={onToggleDarkMode}
              className={cn(
                "w-full py-2.5 px-3 rounded-xl flex items-center justify-between gap-2 transition-all duration-300",
                darkMode
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "bg-card text-foreground border border-border/50 hover:border-primary/30 hover:bg-muted/20"
              )}
            >
              <div className="flex items-center gap-2">
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                <span className="font-medium">{darkMode ? "淺色模式" : "深色模式"}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">{darkMode ? "切換" : "切換"}</span>
            </button>
          </div>

          {/* 設備選擇 */}
          <div className="bg-muted/30 rounded-xl p-3 border border-border/40">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">選擇您喜歡的設備型號</h3>
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                {isExpanded ? "收起" : "查看全部"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredDevices.slice(0, isExpanded ? filteredDevices.length : 4).map(device => (
                <button
                  key={device.id}
                  onClick={() => onSelectDevice(device.id)}
                  className={cn(
                    "relative p-3 rounded-lg text-left transition-all duration-200 group",
                    selectedDevice.id === device.id
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Device Icon */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-md transition-colors",
                        selectedDevice.id === device.id ? "bg-primary/20" : "bg-muted-foreground/10 group-hover:bg-muted-foreground/20"
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {device.type === "ios" ? (
                          <>
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                          </>
                        ) : (
                          <>
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                            <path d="M7 2h10v2H7z" />
                          </>
                        )}
                      </svg>
                    </div>
                    <span className="font-medium text-sm truncate">{device.name}</span>
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {device.width} x {device.height} px
                  </div>

                  {/* Selected Indicator */}
                  {selectedDevice.id === device.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {!isExpanded && filteredDevices.length > 4 && (
              <div className="mt-2 text-center">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center justify-center gap-1 w-full py-1.5"
                >
                  還有 {filteredDevices.length - 4} 個設備
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* 提示 */}
          <div className="text-xs text-muted-foreground p-2">
            <p className="flex items-start gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              所有設備圖片均按照 App Store 和 Google Play 商店的最新規格生成，比例完美匹配
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
