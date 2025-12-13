export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#001F5F]" />
        
        {/* Text */}
        <p className="text-sm font-medium text-gray-700">
          Loading, please wait…
        </p>
      </div>
    </div>
  );
}