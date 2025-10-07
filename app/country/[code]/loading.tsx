export default function LoadingCountryPage() {
  return (
    <div className="py-12 px-6 animate-pulse">
      <div className="h-8 w-1/3 bg-gray-200 rounded mb-6" />
      <div className="flex flex-col gap-4">
        <div className="h-20 w-full bg-gray-100 rounded mb-4" />
        <div className="h-6 w-2/3 bg-gray-100 rounded" />
        <div className="h-6 w-2/3 bg-gray-100 rounded" />
        <div className="h-6 w-1/2 bg-gray-100 rounded" />
        <div className="h-6 w-1/3 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
