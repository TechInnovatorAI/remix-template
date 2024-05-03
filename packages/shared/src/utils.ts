/**
 * Check if the code is running in a browser environment.
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 *@name formatCurrency
 * @description Format the currency based on the currency code
 */
export function formatCurrency(currencyCode: string, value: string | number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(Number(value));
}
