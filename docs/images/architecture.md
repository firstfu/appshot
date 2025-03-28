```mermaid
graph TD
    A[使用者瀏覽器] --> B[Next.js 應用]
    B --> C[React 組件]
    C --> D[Canvas 圖像處理]
    C --> E[UI 渲染]
    D --> F[設備模型庫]
    D --> G[狀態欄生成]
    D --> H[圖像合成]
    H --> I[本地下載]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#0070f3,stroke:#333,stroke-width:2px
    style C fill:#61dafb,stroke:#333,stroke-width:2px
    style D fill:#dfd,stroke:#333,stroke-width:2px
    style E fill:#dfd,stroke:#333,stroke-width:2px
    style F fill:#ffd,stroke:#333,stroke-width:2px
    style G fill:#ffd,stroke:#333,stroke-width:2px
    style H fill:#ffd,stroke:#333,stroke-width:2px
    style I fill:#ddf,stroke:#333,stroke-width:2px
```

**AppShot 純前端架構圖**

這是一個基於 React 和 Next.js 的純前端架構，所有的處理都在用戶的瀏覽器中完成：

1. 使用者訪問 AppShot 網站
2. Next.js 應用載入 (靜態生成的頁面)
3. React 組件在客戶端渲染
4. 使用者上傳圖片後，通過 Canvas API 進行處理
5. 從內建的設備模型庫讀取模板
6. 生成狀態欄與系統元素
7. 圖像合成將用戶圖片與設備模型結合
8. 最終圖像直接下載到用戶本地，無需經過伺服器

這種架構的優點是：

- 無需後端伺服器
- 使用者隱私得到保護，圖片不離開本地
- Next.js 提供更好的載入性能和 SEO 優化
- 可以輕鬆部署到 Vercel 或其他靜態網站託管服務
- 維護成本極低
