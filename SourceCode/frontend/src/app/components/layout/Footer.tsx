import * as React from "react";
import { Facebook, Instagram, Youtube, Twitter, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <h2 className="text-base font-bold">ISKCON</h2>
                <p className="text-xs text-gray-400 -mt-0.5">COURSE PORTAL</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Dedicated to providing authentic Vedic knowledge for the spiritual upliftment of all.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded flex items-center justify-center transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded flex items-center justify-center transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">QUICK LINKS</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Exam Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">SUPPORT</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">CONTACT US</h3>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <span>✉</span>
                <span>iskconcourse@example.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <span>📞</span>
                <span>+91 12345 67890</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <span>📍</span>
                <span>ISKCON, Hare Krishna Land, Andheri, India</span>
              </li>
            </ul>

            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">NEWSLETTER</h4>
              <p className="text-xs text-gray-400 mb-3">
                Subscribe to get updates on new courses and important announcements.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm h-9"
                />
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 h-9 px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            © 2024 ISKCON Course Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
