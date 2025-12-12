import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalSetting } from "@/hooks/useLocalSettings";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import { Settings } from "lucide-react";

export default function CustomOrders() {
  const { data: emailSetting } = useLocalSetting("business_email");
  const { data: instagramSetting } = useLocalSetting("instagram_url");
  const email = (emailSetting?.setting_value as string) || "hello@hashtag3d.com";
  const instagramUrl = (instagramSetting?.setting_value as string) || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectDescription: "",
    referenceImages: "",
    quantity: "",
    timeline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const subject = encodeURIComponent(`Custom Order Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Project Description:\n${formData.projectDescription}\n\n` +
      `Reference Images/URLs: ${formData.referenceImages || "None"}\n` +
      `Quantity: ${formData.quantity || "Not specified"}\n` +
      `Timeline: ${formData.timeline || "Not specified"}\n\n` +
      `---\nThis inquiry was submitted through the Custom Orders page.`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logomark.png" 
              alt="hashtag3D" 
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <span className="font-bold text-lg md:text-xl text-foreground">hashtag3D</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <CartButton />
            <Link 
              to="/auth" 
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Admin"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Custom Orders
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have an idea? We can work together to bring it to life. We're creative and always ready to work on new, exciting projects.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <CardTitle className="text-lg">Share Your Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tell us about your project, share reference images, and describe what you have in mind.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <CardTitle className="text-lg">We'll Review & Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We'll review your request, ask any clarifying questions, and provide a detailed quote.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <CardTitle className="text-lg">We Build Together</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Once approved, we'll create your custom design and keep you updated throughout the process.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inquiry Form */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Tell Us About Your Project
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you within 24 hours to discuss your custom order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  required
                  placeholder="Describe your custom 3D printing project. What do you want to create? What's the purpose? Any specific requirements?"
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Be as detailed as possible. Include dimensions, colors, materials, and any special features you need.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceImages">Reference Images or Links</Label>
                <Input
                  id="referenceImages"
                  value={formData.referenceImages}
                  onChange={(e) => setFormData({ ...formData, referenceImages: e.target.value })}
                  placeholder="Paste image URLs, Pinterest links, or describe what you've seen"
                />
                <p className="text-xs text-muted-foreground">
                  Share any images, links, or references that help us understand your vision.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g., 1, 5, 10+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline / Deadline</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    placeholder="e.g., ASAP, 2 weeks, 1 month"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
                {instagramUrl && instagramUrl !== "https://instagram.com" && (
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="flex-1"
                    size="lg"
                  >
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                      Message on Instagram
                    </a>
                  </Button>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By submitting this form, you'll send an email to {email}. We'll respond within 24 hours.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* What We Can Do */}
        <Card>
          <CardHeader>
            <CardTitle>What We Can Create</CardTitle>
            <CardDescription>Examples of custom projects we've worked on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Custom Figurines & Models</p>
                  <p className="text-sm text-muted-foreground">Character models, miniatures, architectural models, and more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Personalized Gifts</p>
                  <p className="text-sm text-muted-foreground">Custom keychains, name tags, photo frames, and personalized items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Functional Parts</p>
                  <p className="text-sm text-muted-foreground">Replacement parts, brackets, organizers, and functional components</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Prototypes & Designs</p>
                  <p className="text-sm text-muted-foreground">Product prototypes, design iterations, and concept models</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}

