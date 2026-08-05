export default function Loading() {
  return (
    <div className="p-6 md:p-12">
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded mb-3" />
        <div className="h-4 w-96 bg-slate-200 rounded mb-8" />
        <div className="h-40 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
