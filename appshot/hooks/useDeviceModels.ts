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
  type: string; // 'ios' 或 'android'
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
      type: "ios",
    },
    {
      id: "iphone-15-pro",
      name: "iPhone 15 Pro (6.1吋)",
      image: "/device-models/iphone-placeholder.png",
      width: 1179,
      height: 2556,
      statusBarHeight: 47,
      bottomBarHeight: 34,
      paddingTop: 200,
      paddingLeft: 32,
      type: "ios",
    },
    {
      id: "iphone-15-pro-max",
      name: "iPhone 15 Pro Max",
      image: "/device-models/iphone-placeholder.png",
      width: 1290,
      height: 2796,
      statusBarHeight: 47,
      bottomBarHeight: 34,
      paddingTop: 200,
      paddingLeft: 32,
      type: "ios",
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
      type: "ios",
    },
    {
      id: "ipad-air",
      name: "iPad Air 10.9吋",
      image: "/device-models/ipad-placeholder.png",
      width: 1640,
      height: 2360,
      statusBarHeight: 24,
      bottomBarHeight: 0,
      paddingTop: 120,
      paddingLeft: 62,
      type: "ios",
    },
    {
      id: "pixel-7",
      name: "Google Pixel 7",
      image: "/device-models/android-placeholder.png",
      width: 1080,
      height: 2400,
      statusBarHeight: 40,
      bottomBarHeight: 42,
      paddingTop: 200,
      paddingLeft: 32,
      type: "android",
    },
    {
      id: "pixel-7-pro",
      name: "Google Pixel 7 Pro",
      image: "/device-models/android-placeholder.png",
      width: 1440,
      height: 3120,
      statusBarHeight: 40,
      bottomBarHeight: 42,
      paddingTop: 200,
      paddingLeft: 32,
      type: "android",
    },
    {
      id: "samsung-s23",
      name: "Samsung Galaxy S23",
      image: "/device-models/android-placeholder.png",
      width: 1080,
      height: 2340,
      statusBarHeight: 40,
      bottomBarHeight: 42,
      paddingTop: 200,
      paddingLeft: 32,
      type: "android",
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
