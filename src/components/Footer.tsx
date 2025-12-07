import { Printer, Mail, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Printer className="w-6 h-6 text-primary" />
              <span className="text-xl font-display font-bold text-foreground">
                3D Prints
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Custom 3D printing services for personalized gifts, home décor, 
              and unique creations. Bringing your ideas to life, one layer at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#products" className="hover:text-primary transition-colors">
                  Browse Products
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-primary transition-colors">
                  Custom Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Me
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Get in Touch</h4>
            <div className="flex gap-3">
              <a
                href="mailto:hello@example.com"
                className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              I'll respond to all inquiries within 24 hours.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 3D Prints. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
