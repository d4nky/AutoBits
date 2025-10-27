import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Admin() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Manage users, workflows, transactions, and payouts.
          </p>
          <Button variant="outline">
            This page will include: User management, workflow moderation, transaction
            tracking, payout management, and platform analytics
          </Button>
        </div>
      </section>
    </div>
  );
}
