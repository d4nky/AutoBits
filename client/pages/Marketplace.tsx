import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Marketplace
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Browse, search, and filter automation workflows by category, price,
            and ratings.
          </p>
          <Button variant="outline">
            This page will include: Search filters, categories, automation cards
            with ratings, and sorting options
          </Button>
        </div>
      </section>
    </div>
  );
}
