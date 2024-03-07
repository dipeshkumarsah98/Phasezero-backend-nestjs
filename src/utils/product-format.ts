import { calculateTotalStocksAvailabe } from './calculate-stocks';

export function formatProducts(products: any) {
  const formattedProducts = products.map(product => {
    const stocks = product.stock.map(stockItem => {
      const { color, size, quantity: stock } = stockItem;
      return {
        color: color.color,
        size: size.size,
        stockQuantity: stock,
      };
    });

    return {
      ...product,
      available_stock: calculateTotalStocksAvailabe(stocks),
      stock: stocks,
    };
  });
  return formattedProducts;
}

export function formatProduct(product: any) {
  const stocks = product.stock.map(stockItem => {
    const { color, size, quantity: stock } = stockItem;
    return {
      color: color.color,
      size: size.size,
      stockQuantity: stock,
    };
  });

  return {
    ...product,
    stock: stocks,
    available_stock: calculateTotalStocksAvailabe(stocks),
  };
}
