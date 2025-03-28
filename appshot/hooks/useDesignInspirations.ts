import { useState, useEffect } from "react";
import { DribbbleShot, fetchDribbbleDesigns } from "../lib/utils";

export interface DesignCategory {
  id: string;
  name: string;
}

export function useDesignInspirations(query: string = "app screenshots") {
  const [designs, setDesigns] = useState<DribbbleShot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const designCategories: DesignCategory[] = [
    { id: "all", name: "所有靈感" },
    { id: "modern", name: "現代風格" },
    { id: "minimalist", name: "簡約設計" },
    { id: "colorful", name: "多彩風格" },
  ];

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDribbbleDesigns(query);
        setDesigns(data);
      } catch (err) {
        setError("無法載入設計靈感。請稍後再試。");
        console.error("無法載入設計靈感:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDesigns();
  }, [query]);

  const filteredDesigns =
    activeTab === "all" ? designs : designs.filter((_, index) => index % designCategories.length === designCategories.findIndex(c => c.id === activeTab));

  return {
    designs: filteredDesigns,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    designCategories,
  };
}
