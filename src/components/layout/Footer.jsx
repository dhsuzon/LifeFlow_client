import React from "react";
import Link from "next/link";
import { Separator } from "@heroui/react";
import { FaHeartbeat } from "react-icons/fa";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center gap-2 justify-center">
            <FaHeartbeat className="text-danger text-3xl" />
            <span className="text-2xl font-bold dark:text-white">LifeFlow</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
            Connecting lives through blood donation. Your small act of kindness
            can save a precious life today.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="font-bold text-lg mb-4 dark:text-white">
            Quick Links
          </h4>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
            <li>
              <Link href="/about" className="hover:text-danger transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-danger transition">
                Find a Donor
              </Link>
            </li>
            <li>
              <Link href="/campaigns" className="hover:text-danger transition">
                Blood Campaigns
              </Link>
            </li>
          </ul>
        </div>

        {/* জরুরি সেবা */}
        <div className="flex flex-col items-center">
          <h4 className="font-bold text-lg mb-4 dark:text-white">Emergency</h4>
          <ul className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
            <li>
              <Link href="/request" className="hover:text-danger transition">
                Request Blood
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-danger transition">
                Safety Guidelines
              </Link>
            </li>
            <li>
              <Link href="/hospitals" className="hover:text-danger transition">
                Hospital Partners
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="font-bold text-lg mb-4 dark:text-white">Follow Us</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {[FaWhatsapp, FaFacebook, FaXTwitter, FaLinkedin, FaInstagram].map(
              (Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all duration-300 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                >
                  <Icon size={20} />
                </Link>
              ),
            )}
          </div>
        </div>
      </div>

      <Separator className="my-8 bg-zinc-200 dark:bg-zinc-800" />

      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-500 text-sm">
          © 2026 LifeFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
