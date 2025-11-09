"use client";

interface AddToCartProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  disabled?: boolean;
}

export function AddToCart({ productId, name, price, image, disabled }: AddToCartProps) {
  return (
    <div>
      <button>AddToCart</button>
    </div>
  );
}
