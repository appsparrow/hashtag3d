import { Heart } from "lucide-react";

export function DonationBanner() {
  return (
    <div className="bg-accent/20 border-y border-accent/30 py-4 px-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-center gap-3 text-center">
        <Heart className="w-5 h-5 text-accent fill-accent" />
        <p className="text-sm font-medium text-foreground">
          <span className="text-accent font-semibold">Giving Back:</span>{" "}
          A portion of every purchase is donated to support local community causes.
        </p>
        <Heart className="w-5 h-5 text-accent fill-accent" />
      </div>
    </div>
  );
}
