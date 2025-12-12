import { Mail, Instagram, MessageCircle, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocalSetting } from "@/hooks/useLocalSettings";

export function Footer() {
  const { data: instagramSetting } = useLocalSetting("instagram_url");
  const { data: youtubeSetting } = useLocalSetting("youtube_url");
  const { data: tiktokSetting } = useLocalSetting("tiktok_url");
  const { data: emailSetting } = useLocalSetting("business_email");
  const { data: phoneSetting } = useLocalSetting("business_phone");

  const instagramUrl = (instagramSetting?.setting_value as string) || "https://instagram.com";
  const youtubeUrl = (youtubeSetting?.setting_value as string) || "https://youtube.com";
  const tiktokUrl = (tiktokSetting?.setting_value as string) || "#";
  const email = (emailSetting?.setting_value as string) || "hello@example.com";
  const phone = (phoneSetting?.setting_value as string) || "";
  return (
    <footer className="bg-muted/50 border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="hashtag3D" 
                className="h-8 w-auto"
              />
            </Link>
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
                <Link to="/custom-orders" className="hover:text-primary transition-colors">
                  Custom Orders
                </Link>
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
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
              {instagramUrl && instagramUrl !== "https://instagram.com" && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {youtubeUrl && youtubeUrl !== "https://youtube.com" && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {tiktokUrl && tiktokUrl !== "#" && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              I'll respond to all inquiries within 24 hours.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} hashtag3D. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
