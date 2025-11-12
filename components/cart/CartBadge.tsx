interface CartBadgeProps {
  count: number;
}

export function CartBadge({ count }: CartBadgeProps) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center text-black">
      {count > 99 ? "99+" : count}
    </span>
  );
}
