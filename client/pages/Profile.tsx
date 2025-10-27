import { Header } from "@/components/Header";

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
          <button className="inline-flex items-center justify-center h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
            This page will include: User info, purchase history, sales dashboard
            (for creators), ratings, and settings
          </button>
        </div>
      </section>
    </div>
  );
}
