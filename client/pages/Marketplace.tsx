import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, DollarSign, Building2 } from "lucide-react";
import { getToken } from "@/lib/auth";

interface Job {
  _id: string;
  businessName: string;
  title: string;
  description: string;
  price: number;
  location: { city: string; address: string };
  jobType: string;
  views: number;
  applicants: number;
  createdAt: string;
}

export default function Marketplace() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (city) params.set("city", city);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("page", String(page));
      params.set("limit", "20");

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, city, minPrice, maxPrice]);

  useEffect(() => {
    fetchJobs();
  }, [page, search, city, minPrice, maxPrice]);

  const saveJob = async (jobId: string) => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("/api/jobs/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        alert("Job saved successfully");
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Browse Jobs</h1>

        {/* Filters */}
        <div className="bg-secondary/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search
              </label>
              <Input
                type="text"
                placeholder="Job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <Input
                type="text"
                placeholder="Algiers..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="DZD"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="DZD"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearch("");
                  setCity("");
                  setMinPrice("");
                  setMaxPrice("");
                  setPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No jobs found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-foreground flex-1">
                      {job.title}
                    </h3>
                    <button
                      onClick={() => saveJob(job._id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Heart className="w-5 h-5 text-primary" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      {job.businessName}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {job.location.city}
                    </div>
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {job.price.toLocaleString()} DZD
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      className="flex-1 text-sm"
                      onClick={() => {
                        // Navigate to job detail page
                        // For now, can show alert or implement detail modal
                        alert(`Job ${job.title} - Views: ${job.views}, Applicants: ${job.applicants}`);
                      }}
                    >
                      View Details
                    </Button>
                    <Button className="flex-1 text-sm">Apply</Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 py-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
