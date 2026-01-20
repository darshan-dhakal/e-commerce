export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  numReview: number;
  price: number;
  countInStock: number;
}

export interface CartItem extends Product {
  qty: number;
}
