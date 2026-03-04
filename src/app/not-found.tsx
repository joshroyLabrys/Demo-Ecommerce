import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button className="mt-8 gap-2 rounded-full px-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
