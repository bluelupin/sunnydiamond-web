"use client";

import { useRouter } from "next/navigation";
import BookStoreVisitPanel from "@/features/products/components/detail/BookStoreVisitPanel";

const BookStoreVisitPageContent = () => {
  const router = useRouter();

  return (
    <BookStoreVisitPanel
      variant="page"
      onBack={() => router.back()}
    />
  );
};

export default BookStoreVisitPageContent;
