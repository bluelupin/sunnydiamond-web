import { diamondsForEveryonePageContent } from "../data/content";
import { clampDfeMonthlyAmount, type DfeInvestmentConfig } from "./investmentConfig";

const { investPath } = diamondsForEveryonePageContent.investment;

export function buildDfeInvestUrl(monthlyAmount: number, config: DfeInvestmentConfig): string {
  return `${investPath}?amount=${clampDfeMonthlyAmount(monthlyAmount, config)}`;
}

export function parseDfeInvestAmount(
  raw: string | null | undefined,
  config: DfeInvestmentConfig,
): number {
  const parsed = Number(raw);
  if (!raw?.trim() || !Number.isFinite(parsed)) {
    return config.defaultMonthly;
  }
  return clampDfeMonthlyAmount(parsed, config);
}
