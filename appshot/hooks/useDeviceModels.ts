import { useState } from "react";

export interface DeviceModel {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  statusBarHeight: number;
  bottomBarHeight: number;
  paddingTop: number;
  paddingLeft: number;
}

export function useDeviceModels() {
  const deviceTypes: DeviceModel[] = [
    {
      id: "iphone-14",
      name: "iPhone 14/15 (6.1吋)",
      image: "/device-models/iphone-placeholder.png", // 暫時使用占位圖像
      width: 1170, // 設備截圖區域寬度
      height: 2532, // 設備截圖區域高度
      statusBarHeight: 47, // 狀態欄高度
      bottomBarHeight: 34, // 底部手勢條高度
      paddingTop: 200, // 頂部邊距
      paddingLeft: 32, // 左邊距
    },
    {
      id: "ipad-pro",
      name: "iPad Pro 12.9吋",
      image: "/device-models/ipad-placeholder.png", // 暫時使用占位圖像
      width: 2048,
      height: 2732,
      statusBarHeight: 24,
      bottomBarHeight: 0,
      paddingTop: 120,
      paddingLeft: 62,
    },
  ];

  const [selectedDevice, setSelectedDevice] = useState<DeviceModel>(deviceTypes[0]);

  const changeDevice = (deviceId: string) => {
    const device = deviceTypes.find(d => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
    }
  };

  return { deviceTypes, selectedDevice, changeDevice };
}
