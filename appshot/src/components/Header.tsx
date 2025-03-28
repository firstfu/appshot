import React from "react";

export default function Header() {
  return (
    <header className="w-full py-6 mb-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold text-primary">AppShot</h1>
          <p className="text-muted-foreground mt-2">無註冊、即用即走的 App Store 截圖生成工具</p>
        </div>
      </div>
    </header>
  );
}
