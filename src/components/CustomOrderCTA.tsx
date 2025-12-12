import { Link } from "react-router-dom";
import { Sparkles, MessageCircle, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalSetting } from "@/hooks/useLocalSettings";

export function CustomOrderCTA() {
  const { data: emailSetting } = useLocalSetting("business_email");
  const { data: instagramSetting } = useLocalSetting("instagram_url");
  const email = (emailSetting?.setting_value as string) || "hello@hashtag3d.com";
  const instagramUrl = (instagramSetting?.setting_value as string) || "";

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CardContent className="p-6 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Have an Idea? Let's Build It Together!
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              If you see something you like, we can print it. If you have an idea, we can work together to bring it to life.
            </p>
            <p className="text-base text-muted-foreground">
              We're creative and always ready to work on new, exciting projects.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-foreground">Share Your Vision</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about your project, share images, or describe what you have in mind.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-foreground">We'll Review & Quote</h3>
              <p className="text-sm text-muted-foreground">
                We'll review your request, ask questions, and provide a detailed quote.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-foreground">We Create Together</h3>
              <p className="text-sm text-muted-foreground">
                Once approved, we'll design and print your custom creation.
              </p>
            </div>
          </div>

          {/* What We Can Do */}
          <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="font-semibold text-foreground mb-3 text-center">What We Can Create</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Custom figurines, models, and miniatures</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Personalized gifts and custom items</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Functional parts and prototypes</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Unique designs and creative projects</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="flex-1 sm:flex-initial">
              <Link to="/custom-orders" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Start Your Custom Order
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            {email && (
              <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
                <a href={`mailto:${email}?subject=Custom Order Inquiry`} className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
              </Button>
            )}
            {instagramUrl && instagramUrl !== "https://instagram.com" && (
              <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Message on Instagram
                </a>
              </Button>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            We respond to all inquiries within 24 hours. Let's create something amazing together! ✨
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

