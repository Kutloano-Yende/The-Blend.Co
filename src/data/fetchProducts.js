import { products } from './products';

export function fetchProducts() {
  const simulateError = new URLSearchParams(window.location.search).has('simulateError');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error('Unable to load products. Please check your connection and try again.'));
      } else {
        resolve(products);
      }
    }, 700);
  });
}
