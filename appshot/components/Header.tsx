import React from "react";

export default function Header() {
  return (
    <header className="w-full py-8 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary w-8 h-8 mr-2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M8 21h8"></path>
              <path d="M12 17v4"></path>
            </svg>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AppShot</h1>
          </div>
          <p className="text-muted-foreground mt-1 max-w-md mx-auto text-lg ">無需註冊、即時生成精美的 App Store 設備截圖</p>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">簡單操作</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">高品質輸出</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground">免費使用</span>
          </div>
        </div>
      </div>
    </header>
  );
}
