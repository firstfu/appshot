import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DribbbleShot {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

// 獲取Dribbble精美設計參考
export async function fetchDribbbleDesigns(query: string = "app screenshots"): Promise<DribbbleShot[]> {
  try {
    // 在實際情況下，這裡應該調用Dribbble API
    // 但因為需要API金鑰，我們模擬一些精美設計的回應

    // 模擬網絡延遲
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockDesigns: DribbbleShot[] = [
      {
        id: "1",
        title: "App Store Screenshots - 現代設計",
        description: "簡潔現代的應用商店截圖，突顯核心功能並具有高轉換率",
        imageUrl: "https://cdn.dribbble.com/users/5031392/screenshots/15467520/media/c36b3b15b25b1e190704dc834a977222.png",
        url: "https://dribbble.com/shots/15467520-App-Store-Screenshots",
      },
      {
        id: "2",
        title: "極簡主義應用截圖",
        description: "簡約優雅的應用商店宣傳圖，專注於核心設計元素",
        imageUrl: "https://cdn.dribbble.com/users/1126935/screenshots/16358923/media/d9d74865367e5a3be0d6300540393e11.png",
        url: "https://dribbble.com/shots/16358923-App-Store-Screenshots",
      },
      {
        id: "3",
        title: "3D 設備模型展示",
        description: "令人驚艷的3D模型，完美展示您的移動應用程式",
        imageUrl: "https://cdn.dribbble.com/users/1787323/screenshots/17057543/media/1a541e2cade2c9533eace5bad16ac894.png",
        url: "https://dribbble.com/shots/17057543-3D-Device-Mockups",
      },
      {
        id: "4",
        title: "漸變風格UI截圖",
        description: "現代應用截圖，具有美麗的漸變色和清晰的排版",
        imageUrl: "https://cdn.dribbble.com/users/991275/screenshots/15800082/media/fd46fa66403c35e042e211c417eb72c4.jpg",
        url: "https://dribbble.com/shots/15800082-Gradient-UI-Screenshots",
      },
      {
        id: "5",
        title: "深色主題應用展示",
        description: "完美呈現深色主題界面的應用商店宣傳圖",
        imageUrl: "https://cdn.dribbble.com/users/2493067/screenshots/14825553/media/84c9a3aaa7978df2ef29ec2742c95fbd.png",
        url: "https://dribbble.com/shots/14825553-Dark-Theme-App-Store-Screenshots",
      },
      {
        id: "6",
        title: "多彩風格應用截圖",
        description: "鮮豔多彩的設計風格，讓您的應用在商店中脫穎而出",
        imageUrl: "https://cdn.dribbble.com/users/1615584/screenshots/15365288/media/214ea11b848aedc3f7e3a697fa4cc3b2.jpg",
        url: "https://dribbble.com/shots/15365288-Colorful-App-Store-Screenshots",
      },
      {
        id: "7",
        title: "電商應用截圖模板",
        description: "專為電子商務應用優化的商店宣傳圖，提高下載轉化率",
        imageUrl: "https://cdn.dribbble.com/users/962032/screenshots/15853075/media/58aec6d52478a4adbb61a0528c374974.png",
        url: "https://dribbble.com/shots/15853075-E-commerce-App-Screenshots",
      },
      {
        id: "8",
        title: "時尚現代應用展示",
        description: "時尚現代的設計風格，突顯應用功能與用戶體驗",
        imageUrl: "https://cdn.dribbble.com/users/4189231/screenshots/14809600/media/da3fa051ccb7627f95d0700cf764fb30.png",
        url: "https://dribbble.com/shots/14809600-App-Store-Screenshots",
      },
    ];

    // 根據查詢進行簡單過濾
    if (query.toLowerCase().includes("modern") || query.toLowerCase().includes("現代")) {
      return mockDesigns.filter(design => design.title.includes("現代") || design.id === "1" || design.id === "8");
    } else if (query.toLowerCase().includes("minimal") || query.toLowerCase().includes("簡約")) {
      return mockDesigns.filter(design => design.title.includes("簡") || design.id === "2");
    } else if (query.toLowerCase().includes("colorful") || query.toLowerCase().includes("多彩")) {
      return mockDesigns.filter(design => design.title.includes("多彩") || design.id === "6" || design.id === "4");
    } else if (query.toLowerCase().includes("dark") || query.toLowerCase().includes("深色")) {
      return mockDesigns.filter(design => design.title.includes("深色") || design.id === "5");
    } else if (query.toLowerCase().includes("commerce") || query.toLowerCase().includes("電商")) {
      return mockDesigns.filter(design => design.title.includes("電商") || design.id === "7");
    }

    return mockDesigns;
  } catch (error) {
    console.error("獲取Dribbble設計時出錯:", error);
    return [];
  }
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 生成唯一ID
export function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

// 防抖函數
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
