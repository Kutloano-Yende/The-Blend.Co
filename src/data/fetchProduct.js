import { getProductById } from './products';

export function fetchProduct(id) {
  const simulateError = new URLSearchParams(window.location.search).has('simulateError');

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error('Unable to load this product. Please check your connection and try again.'));
      } else {
        resolve(getProductById(id));
      }
    }, 600);
  });
}
