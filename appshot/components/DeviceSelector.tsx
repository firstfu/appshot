"use client";

import { DeviceModel } from "../hooks/useDeviceModels";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Toggle } from "../components/ui/toggle";

interface DeviceSelectorProps {
  devices: DeviceModel[];
  selectedDevice: DeviceModel;
  onSelectDevice: (deviceId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function DeviceSelector({ devices, selectedDevice, onSelectDevice, darkMode, onToggleDarkMode }: DeviceSelectorProps) {
  return (
    <Card className="w-full overflow-hidden border-2 transition-all duration-200 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          設備選項
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-5">
          <div className="space-y-3">
            <label htmlFor="device-select" className="text-sm font-medium flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              選擇設備型號
            </label>

            <div className="grid grid-cols-2 gap-2 mb-2">
              {devices.map(device => (
                <div
                  key={device.id}
                  className={`border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                    selectedDevice.id === device.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}
                  onClick={() => onSelectDevice(device.id)}
                >
                  <div className="w-full aspect-[1/2] flex items-center justify-center relative mb-2">
                    {device.id.includes("iphone") ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12" y2="18.01" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="2" y1="20" x2="22" y2="20" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium truncate">{device.name}</span>
                </div>
              ))}
            </div>

            <Select value={selectedDevice.id} onValueChange={onSelectDevice}>
              <SelectTrigger id="device-select" className="w-full">
                <SelectValue placeholder="選擇設備" />
              </SelectTrigger>
              <SelectContent>
                {devices.map(device => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
            <label htmlFor="dark-mode-toggle" className="text-sm font-medium flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {darkMode ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                )}
              </svg>
              {darkMode ? "深色模式" : "淺色模式"}
            </label>
            <Toggle
              id="dark-mode-toggle"
              pressed={darkMode}
              onPressedChange={() => onToggleDarkMode()}
              className="data-[state=on]:bg-primary"
              aria-label="切換深色模式"
            >
              <span className="sr-only">{darkMode ? "開啟" : "關閉"}</span>
              <div className="flex items-center">
                <span className={`text-xs ${darkMode ? "text-primary-foreground" : ""}`}>{darkMode ? "開啟" : "關閉"}</span>
              </div>
            </Toggle>
          </div>

          <div className="text-xs text-center text-muted-foreground mt-1">
            <p>選擇合適的設備，查看您的 App 在不同裝置上的顯示效果</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
