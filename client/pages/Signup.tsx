import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Signup() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            Get Started
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Join AutoBits and automate your workflows
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <div className="pt-2">
              <Label className="mb-3 block">I am a:</Label>
              <RadioGroup defaultValue="buyer">
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="buyer" id="buyer" />
                  <Label htmlFor="buyer" className="font-normal cursor-pointer">
                    Buyer - Looking for automations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="creator" id="creator" />
                  <Label htmlFor="creator" className="font-normal cursor-pointer">
                    Creator - Selling automations
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <button className="w-full h-10 rounded-md px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors">
              Create Account
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
              Sign up with Google
            </button>
            <button className="w-full h-10 rounded-md px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors">
              Sign up with GitHub
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
