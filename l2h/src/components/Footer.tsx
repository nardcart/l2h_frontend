import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <img 
                src="/images/logo.png" 
                alt="L2H - Low to High Upskilling Courses" 
                className="h-10 w-auto object-contain logo-image"
              />
            </div>
            <p className="text-muted-foreground mb-4">
              India's Premier Institution for Extraordinary Professionals
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61580610657298" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.instagram.com/low2high_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.linkedin.com/company/81814645/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.youtube.com/@Low2High" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer group"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</a></li>
              <li><a href="/blogs" className="text-muted-foreground hover:text-primary transition-colors">Blogs</a></li>
              <li><a href="/success-stories" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold mb-4">Popular Courses</h4>
            <ul className="space-y-2">
              <li><a href="/courses/professional-development" className="text-muted-foreground hover:text-primary transition-colors">Professional Development</a></li>
              <li><a href="/courses/leadership" className="text-muted-foreground hover:text-primary transition-colors">Leadership Excellence</a></li>
              <li><a href="/courses/technical" className="text-muted-foreground hover:text-primary transition-colors">Technical Mastery</a></li>
              <li><a href="/courses/communication" className="text-muted-foreground hover:text-primary transition-colors">Communication Skills</a></li>
              <li><a href="/ebooks" className="text-muted-foreground hover:text-primary transition-colors">Free Ebooks</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                <span className="block">Email:</span>
                <a href="mailto:care@l2h.in" className="hover:text-primary transition-colors">care@l2h.in</a>
              </li>
              <li className="text-muted-foreground">
                <span className="block">Phone:</span>
                <a href="tel:+91-9717268898" className="hover:text-primary transition-colors">+91-9717268898</a>
              </li>
              <li className="text-muted-foreground">
                <span className="block">Address:</span>
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} L2H Education. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/quality-policy" className="text-muted-foreground hover:text-primary transition-colors">Quality Policy</a>
            <a href="/refunds-cancellation" className="text-muted-foreground hover:text-primary transition-colors">Refunds & Cancellation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;