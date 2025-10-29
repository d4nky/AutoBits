import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPinIcon, ImageIcon, Loader2, Pencil, X } from "lucide-react";
import { CreateListingRequest, Listing } from "@shared/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CreatorDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    imageFile: null as File | null,
    imageUrl: "",
    mapUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState("");

  // Load existing listings when component mounts
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings/business");
      if (response.status === 401) {
        // Using test business ID for development
        console.info('Development mode: Using test business listings');
        return; // In production this would redirect to login
      }
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch listings");
      }
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error Loading Listings",
        description: error instanceof Error ? error.message : "Failed to load listings",
        variant: "destructive",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }
    if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.address && !formData.mapUrl) {
      newErrors.location = "Address or Google Maps link is required";
    }
    if (!formData.mapUrl) {
      newErrors.mapUrl = "Google Maps link is required (paste full URL)";
    }
    // Check for image presence (either file selected or URL provided)
    if (!formData.imageFile && !formData.imageUrl && !imagePreview) {
      newErrors.imageUrl = "Please choose an image for your listing";
      return false; // Stop form submission if no image
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Update image preview when imageUrl changes
    if (name === "imageUrl" && value) {
      setImagePreview(value);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      address: "",
      imageFile: null,
      imageUrl: "",
      mapUrl: "",
    });
    setImagePreview("");
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset any previous errors
    setErrors({});
    
    if (!validateForm()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields including an image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // If there's an image file, upload it first
      if (formData.imageFile) {
        const uploadForm = new FormData();
        uploadForm.append('image', formData.imageFile);
        console.log('Uploading image...');
        const uploadRes = await fetch('/api/files/upload', {
          method: 'POST',
          body: uploadForm,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadJson = await uploadRes.json();
        console.log('Upload successful:', uploadJson);
        imageUrl = uploadJson.url;
      }

      const listingData: any = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: {
          address: formData.address,
          mapUrl: formData.mapUrl,
        },
        imageUrl,
      };

      // Image URL has already been set above

      const url = editingId 
        ? `/api/listings/${editingId}`
        : "/api/listings";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${editingId ? "update" : "create"} listing`);
      }

      toast({
        title: "Success",
        description: `Listing ${editingId ? "updated" : "created"} successfully`,
      });

      resetForm();
      fetchListings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${editingId ? "update" : "create"} listing`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete listing");

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      fetchListings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Listing Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Create New Listing</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`h-32 ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Price (DZD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className={`hidden ${!formData.imageUrl && !imagePreview && !formData.imageFile ? 'border-red-500' : ''}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                            setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' }));
                            // Clear any previous image error
                            setErrors(prev => ({ ...prev, imageUrl: '' }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant={formData.imageFile || formData.imageUrl || imagePreview ? "outline" : "secondary"}
                      onClick={() => document.getElementById('image')?.click()}
                      className={`w-full ${!formData.imageFile && !formData.imageUrl && !imagePreview ? 'border-red-500 hover:border-red-600' : ''}`}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {formData.imageFile || formData.imageUrl || imagePreview ? 'Change Image' : 'Choose Image*'}
                    </Button>
                  </div>
                  {errors.imageUrl && (
                    <p className="text-sm text-red-500">{errors.imageUrl}</p>
                  )}
                  {imagePreview && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview("");
                          setFormData(prev => ({ ...prev, imageUrl: "" }));
                          const input = document.getElementById('image') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Location</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://www.google.com/maps', '_blank')}
                  >
                    Open Google Maps
                  </Button>
                </div>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Full address (e.g., 123 Main St, City)"
                />
                <Input
                  id="mapUrl"
                  name="mapUrl"
                  value={formData.mapUrl}
                  placeholder="Paste Google Maps link here"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, mapUrl: value }));
                  }}
                />
                {errors.mapUrl && (
                  <p className="text-sm text-red-500">{errors.mapUrl}</p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </form>
          </div>

          {/* Existing Listings */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Listings</h2>
            <div className="space-y-4">
              {listings.map((listing) => (
                <Card key={listing._id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{listing.location.address}</span>
                        {listing.location.mapUrl && (
                          <a
                            href={listing.location.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 text-xs text-primary underline"
                          >
                            Open in Maps
                          </a>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-semibold">
                          {listing.price.toLocaleString()} DZD
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData({
                                title: listing.title,
                                description: listing.description,
                                price: listing.price.toString(),
                                address: listing.location.address,
                                imageFile: null,
                                imageUrl: listing.imageUrl,
                                mapUrl: listing.location.mapUrl || "",
                              });
                              setImagePreview(listing.imageUrl);
                              setEditingId(listing._id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(listing._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {listings.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No listings yet. Create your first listing!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
