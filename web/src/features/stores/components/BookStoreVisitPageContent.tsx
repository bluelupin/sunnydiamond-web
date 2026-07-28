"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookStoreVisitPanel from "@/features/products/components/detail/BookStoreVisitPanel";
import StoreLocatorHeroSection from "./StoreLocatorHeroSection";
import StoreLocatorSearchSection from "./StoreLocatorSearchSection";

const BookStoreVisitPageContent = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  return (
    <>
      <StoreLocatorHeroSection />
      <StoreLocatorSearchSection
        searchQuery={searchQuery}
        selectedState={selectedState}
        onSearchQueryChange={setSearchQuery}
        onSelectedStateChange={setSelectedState}
      />
      <BookStoreVisitPanel
        variant="page"
        onBack={() => router.back()}
        storeSearchQuery={searchQuery}
        storeStateFilter={selectedState}
      />
    </>
  );
};

export default BookStoreVisitPageContent;
