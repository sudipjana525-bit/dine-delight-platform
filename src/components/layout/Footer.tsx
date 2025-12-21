import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <span className="text-3xl font-display font-bold">Savoria</span>
            <p className="text-background/70 text-sm leading-relaxed">
              Crafting exceptional dining experiences since 2010. Fresh ingredients, 
              bold flavors, and warm hospitality.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/menu" className="text-background/70 hover:text-primary transition-colors text-sm">
                Our Menu
              </Link>
              <Link to="/locations" className="text-background/70 hover:text-primary transition-colors text-sm">
                Find a Location
              </Link>
              <Link to="/about" className="text-background/70 hover:text-primary transition-colors text-sm">
                About Us
              </Link>
              <Link to="/careers" className="text-background/70 hover:text-primary transition-colors text-sm">
                Careers
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+1234567890" className="text-background/70 hover:text-primary transition-colors text-sm flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (123) 456-7890
              </a>
              <a href="mailto:hello@savoria.com" className="text-background/70 hover:text-primary transition-colors text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@savoria.com
              </a>
              <span className="text-background/70 text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                123 Culinary Avenue<br />
                New York, NY 10001
              </span>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold">Hours</h4>
            <div className="flex flex-col gap-2 text-sm text-background/70">
              <div className="flex justify-between">
                <span>Mon - Thu</span>
                <span>11am - 10pm</span>
              </div>
              <div className="flex justify-between">
                <span>Fri - Sat</span>
                <span>11am - 11pm</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>12pm - 9pm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© {new Date().getFullYear()} Savoria. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-background transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
