export function calculateTotalStocksAvailabe(
  stocks: { color: string; size: string; stockQuantity: number }[],
) {
  const totalStocksAvailable = stocks.reduce(
    (total, stockItem) => total + stockItem.stockQuantity,
    0,
  );
  return totalStocksAvailable;
}
