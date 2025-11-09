"use client";

interface CartActionsProps {
  productId: string;
  quantity: number;
}

export function CartActions({ productId, quantity }: CartActionsProps) {
  return (
    <div>
      <span>CartActions</span>
    </div>
  );
}
