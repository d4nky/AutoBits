import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  Users,
  MessageCircle,
  MapPin,
  Shield,
  ArrowRight,
  Star,
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
              Find quick jobs
              <span className="text-primary"> in your city</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Connect with local businesses posting temporary job opportunities.
              Browse jobs by location, price, and category. Perfect for students,
              freelancers, and anyone looking for flexible work in Algeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Browse Jobs <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/signup?type=business"
                className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 border border-primary text-primary hover:bg-secondary transition-colors font-medium"
              >
                Post a Job
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-primary">1K+</div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5K+</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15K+</div>
                <p className="text-sm text-muted-foreground">Jobs Completed</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:block animate-fade-in">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <Briefcase className="w-24 h-24 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Find and post temporary jobs locally
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
              Why use JobMarket?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, secure platform designed to connect job seekers with
              opportunities in Algeria
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: "Location-Based",
                description: "Find jobs in your area with integrated maps",
              },
              {
                icon: Shield,
                title: "Secure",
                description: "Verified businesses and secure messaging",
              },
              {
                icon: MessageCircle,
                title: "Direct Chat",
                description: "Message businesses directly about opportunities",
              },
              {
                icon: TrendingUp,
                title: "Grow Your Skills",
                description: "Take on diverse projects and build experience",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
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

      {/* How It Works */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  title: "For Job Seekers",
                  steps: ["Sign up with your profile", "Browse nearby jobs", "Apply or message businesses", "Get hired and complete work"],
                },
                {
                  title: "For Businesses",
                  steps: ["Create business account", "Post a job opportunity", "Receive applications", "Hire and manage workers"],
                },
              ].map((section, i) => (
                <div key={i}>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-24 h-24 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Simple and straightforward</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to find work or hire?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users and businesses connecting on JobMarket
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup?type=user"
              className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors font-medium"
            >
              Find Jobs
            </Link>
            <Link
              to="/signup?type=business"
              className="inline-flex items-center justify-center gap-2 h-11 rounded-md px-8 border-2 border-primary-foreground hover:bg-primary-foreground/10 transition-colors font-medium"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/20 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 JobMarket. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
