import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Creator Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Upload and manage your automation workflows. Track sales, revenue,
            and analytics from your creations.
          </p>
          <Button variant="outline">
            This page will include: Upload form, file management, sales analytics,
            revenue tracking, and workflow editor
          </Button>
        </div>
      </section>
    </div>
  );
}
