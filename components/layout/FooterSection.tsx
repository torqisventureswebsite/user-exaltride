interface FooterSectionProps {
  title: string;
  items: { label: string; href?: string; icon?: React.ReactNode }[];
}

export default function FooterSection({ title, items }: FooterSectionProps) {
  return (
    <div className="bg-[#061A78]/40 backdrop-blur-sm rounded-xl border border-[#1D3BBF]/40 p-5 text-gray-300 shadow-[0_0_10px_rgba(13,56,175,0.25)] hover:shadow-[0_0_14px_rgba(255,255,255,0.25)] transition">
      <h3 className="relative text-lg font-semibold text-yellow-400 mb-4">
        • {title}
        <span className="block w-8 h-[2px] bg-yellow-400 mt-1"></span>
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 hover:text-yellow-400 transition-colors">
            {item.icon && <span className="pt-[2px]">{item.icon}</span>}
            {item.href ? (
              <a href={item.href} className="hover:underline">
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
