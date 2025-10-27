import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My Profile
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            View and manage your account, purchases, and sales.
          </p>
          <Button variant="outline">
            This page will include: User info, purchase history, sales dashboard
            (for creators), ratings, and settings
          </Button>
        </div>
      </section>
    </div>
  );
}
