export const formatPriceCents = (
  priceCents: number | null | undefined,
  currency = "USD",
): string => {
  const cents = priceCents ?? 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
};
