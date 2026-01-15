export default function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D Scene...</p>
      </div>
    </div>
  );
}
