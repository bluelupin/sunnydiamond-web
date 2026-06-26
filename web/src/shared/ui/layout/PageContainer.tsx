import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

/** Figma 1440px frame with 40px horizontal safe area — see cursor/rules/project.mdc */
export const pageContainerClassName =
  "mx-auto w-full 2xl:max-w-1920 max-w-1440 px-5 md:px-8 lg:px-[40px] 2xl:px-[60px]";

type PageContainerProps = ComponentPropsWithoutRef<"div">;

const PageContainer = ({ className, ...props }: PageContainerProps) => (
  <div className={cn(pageContainerClassName, className)} {...props} />
);

export default PageContainer;
