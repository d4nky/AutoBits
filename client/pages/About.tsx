import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold text-foreground mb-4">About</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Learn about AutoBits mission, team, and vision for the future of
            automation.
          </p>
          <Button variant="outline">
            This page will include: Company story, team profiles, mission statement,
            and community values
          </Button>
        </div>
      </section>
    </div>
  );
}
