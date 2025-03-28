"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useDesignInspirations, DesignCategory } from "../hooks/useDesignInspirations";

interface DesignInspirationsProps {
  query?: string;
}

export default function DesignInspirations({ query = "app screenshots" }: DesignInspirationsProps) {
  const { designs, isLoading, error, activeTab, setActiveTab, designCategories } = useDesignInspirations(query);

  return (
    <Card className="w-full overflow-hidden border-2 transition-all duration-200 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 pb-3">
        <CardTitle className="text-center flex items-center justify-center gap-2 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z" />
            <path d="M12 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 0v4M9 9l-3-3M15 9l3-3" />
          </svg>
          設計靈感參考
        </CardTitle>
      </CardHeader>

      <div className="p-4">
        {/* 分類標籤 */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide">
          {designCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                activeTab === category.id ? "bg-accent text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>{error}</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">沒有找到相關設計靈感</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designs.map(design => (
              <a key={design.id} href={design.url} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="overflow-hidden rounded-lg border border-border/60 hover:border-accent/50 transition-all duration-300 hover:shadow-md">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white text-sm font-medium truncate">{design.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{design.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{design.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <CardFooter className="flex justify-between items-center p-4 border-t border-border/30 bg-muted/20">
        <p className="text-xs text-muted-foreground">來自 Dribbble 的精選設計靈感</p>
        <a
          href="https://dribbble.com/search/app-screenshots"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          查看更多
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </CardFooter>
    </Card>
  );
}
