import { diamondsForEveryonePageContent } from "../data/content";

const { investment } = diamondsForEveryonePageContent;

export function buildDfeInvestUrl(monthlyAmount: number): string {
  const clamped = Math.min(
    investment.maxMonthly,
    Math.max(investment.minMonthly, monthlyAmount),
  );
  return `${investment.investPath}?amount=${clamped}`;
}

export function parseDfeInvestAmount(raw: string | null | undefined): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return investment.defaultMonthly;
  }
  return Math.min(investment.maxMonthly, Math.max(investment.minMonthly, parsed));
}
