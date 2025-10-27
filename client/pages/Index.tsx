import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Zap,
  Workflow,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Buy, sell, and share
              <span className="text-primary"> automations</span> that save time
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              AutoBits is the global marketplace for ready-made automation
              workflows. Find templates, sell your creations, and automate your
              daily tasks with community-built solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Explore Automations <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/creator-dashboard"
                className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Start Creating
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-primary">2.5K+</div>
                <p className="text-sm text-muted-foreground">Automations</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">$500K+</div>
                <p className="text-sm text-muted-foreground">Paid Out</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:block animate-fade-in">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <Workflow className="w-24 h-24 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Advanced automation workflows
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to automate
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From social media to CRM integrations, find or create the perfect
              automation for your workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Ready to Use",
                description: "Instant automation templates for your workflows",
              },
              {
                icon: DollarSign,
                title: "Earn Money",
                description: "Sell your automations and get paid instantly",
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with creators and share solutions",
              },
              {
                icon: Star,
                title: "Highly Rated",
                description: "Browse reviews and ratings from real users",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Automations Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Featured Automations
          </h2>
          <p className="text-muted-foreground">
            Discover popular templates trusted by thousands
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Email to Slack Notifications",
              category: "Productivity",
              price: "$9.99",
              rating: 4.8,
              reviews: 234,
              description:
                "Automatically send important emails to your Slack channel",
            },
            {
              title: "Instagram to Twitter Auto-Post",
              category: "Social Media",
              price: "$14.99",
              rating: 4.9,
              reviews: 456,
              description: "Cross-post your Instagram stories to Twitter",
            },
            {
              title: "Stripe to Google Sheets",
              category: "Finance",
              price: "$12.99",
              rating: 4.7,
              reviews: 189,
              description: "Track all Stripe transactions in a Google Sheet",
            },
          ].map((automation) => (
            <div
              key={automation.title}
              className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors flex items-center justify-center">
                <Workflow className="w-16 h-16 text-primary/30" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {automation.category}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {automation.price}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {automation.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {automation.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {automation.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({automation.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View All Automations <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-secondary/30 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">
              Find automations for any industry or use case
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Social Media",
              "Productivity",
              "CRM & Sales",
              "Finance",
              "E-Commerce",
              "Marketing",
              "Development",
              "HR & Recruitment",
              "Customer Support",
            ].map((category) => (
              <Link
                key={category}
                to={`/marketplace?category=${category.toLowerCase()}`}
                className="bg-white border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {category}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Loved by creators and users
          </h2>
          <p className="text-muted-foreground">
            See what the community is saying about AutoBits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Chen",
              role: "Freelance Marketer",
              image: "SC",
              quote:
                "AutoBits saved me hours every week. I found the perfect automation for my email campaigns and it's been working flawlessly.",
              rating: 5,
            },
            {
              name: "Marcus Johnson",
              role: "Automation Creator",
              image: "MJ",
              quote:
                "I've made over $5,000 selling my automation templates on AutoBits. The platform is intuitive and the community is amazing.",
              rating: 5,
            },
            {
              name: "Elena Rodriguez",
              role: "Small Business Owner",
              image: "ER",
              quote:
                "The variety of automation templates is incredible. I've streamlined my entire business operations with just a few purchases.",
              rating: 5,
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white border border-border rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
              </div>
              <p className="text-foreground mb-6">{testimonial.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to automate your workflow?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators and users building the future of automation
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white hover:bg-white/90 text-primary"
            asChild
          >
            <Link to="/signup">
              Start Automating Now <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">AutoBits</h3>
              <p className="text-sm text-muted-foreground">
                The global marketplace for automation workflows
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/marketplace"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    to="/creator-dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    For Creators
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AutoBits. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
