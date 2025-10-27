import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            Sign In
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Welcome back to AutoBits
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <button className="w-full h-10 rounded-md px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors">
              Sign In
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Or</span>
              </div>
            </div>

            <button className="w-full h-10 rounded-md px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors">
              Continue with Google
            </button>
            <button className="w-full h-10 rounded-md px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors">
              Continue with GitHub
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
