"use client";

import { DeviceModel } from "../hooks/useDeviceModels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

interface DeviceSelectorProps {
  devices: DeviceModel[];
  selectedDevice: DeviceModel;
  onSelectDevice: (deviceId: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function DeviceSelector({ devices, selectedDevice, onSelectDevice, darkMode, onToggleDarkMode }: DeviceSelectorProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">設備選項</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="device-select" className="text-sm font-medium">
              選擇設備型號
            </label>
            <Select value={selectedDevice.id} onValueChange={onSelectDevice}>
              <SelectTrigger id="device-select">
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

          <div className="flex items-center justify-between">
            <label htmlFor="dark-mode-toggle" className="text-sm font-medium">
              深色模式
            </label>
            <Toggle id="dark-mode-toggle" pressed={darkMode} onPressedChange={() => onToggleDarkMode()}>
              {darkMode ? "開啟" : "關閉"}
            </Toggle>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
