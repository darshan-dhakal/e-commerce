export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  numReview: number;
  price: number;
  countInStock: number;
  category: string;
  discount: number;
  discountType: "percent" | "amount";
}

export interface CartItem extends Product {
  qty: number;
}
