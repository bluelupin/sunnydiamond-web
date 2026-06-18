import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

/** Figma 1440px frame with 40px horizontal safe area — see cursor/rules/project.mdc */
export const pageContainerClassName =
  "mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-10";

type PageContainerProps = ComponentPropsWithoutRef<"div">;

const PageContainer = ({ className, ...props }: PageContainerProps) => (
  <div className={cn(pageContainerClassName, className)} {...props} />
);

export default PageContainer;
