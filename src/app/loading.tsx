export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-foreground" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
