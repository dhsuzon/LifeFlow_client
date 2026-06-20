"use client";
import React, { useState } from "react";
import { Dropdown, Button, Label, Header, Separator } from "@heroui/react";

// Next.js Components
import Link from "next/link";
import Image from "next/image";

// Icons Import
import {
  FaHeartbeat,
  FaBars,
  FaTimes,
  FaThLarge,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

const NavbarClient = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ক্লায়েন্ট সাইড ডামি ইউজার স্টেট (শুরুতে null থাকবে)
  const [user, setUser] = useState(null);

  // লগআউট সিমুলেশন
  const handleLogout = () => {
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  // লগইন সিমুলেশন
  const handleLoginSimulate = () => {
    setUser({
      name: "Suzon",
      email: "suzon@blooddonation.com",
      role: "Admin", // টেস্ট করার জন্য "Donor" বা "Volunteer" লিখে দেখতে পারেন
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    });
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-default-200 sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* লোগো ও মোবাইল টগল বাটন */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground text-xl p-1 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link href="/" className="flex items-center gap-2 select-none">
            <FaHeartbeat className="text-danger text-2xl md:text-3xl animate-pulse" />
            <span className="font-extrabold text-xl md:text-2xl tracking-tight text-danger">
              LifeFlow
            </span>
          </Link>
        </div>

        {/* ডেক্সটপ ও ট্যাবলেট মেনু লিঙ্ক */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/donation-requests"
            className="text-foreground hover:text-danger font-medium text-base transition-colors"
          >
            Donation Requests
          </Link>
          {user && (
            <Link
              href="/funding"
              className="text-foreground hover:text-danger font-medium text-base transition-colors"
            >
              Funding
            </Link>
          )}

          {/* 🛠️ ডেভেলপমেন্ট সিমুলেশন বাটন (এটি ঠিকঠাক রাখা হলো) */}
          <button
            onClick={user ? handleLogout : handleLoginSimulate}
            className="text-[11px] bg-default-100 dark:bg-default-50 text-default-500 hover:text-danger px-2 py-1 rounded border border-default-300 transition-colors font-mono"
          >
            {user ? "[Simulate LogOut]" : "[Simulate LogIn]"}
          </button>
        </div>

        {/* ডানপাশ: আসল রাউট লিঙ্ক অথবা প্রোফাইল ড্রপডাউন */}
        <div className="flex items-center">
          {!user ? (
            /* আসল লগইন বাটন - যা সরাসরি /auth/login রাউটে নিয়ে যাবে */
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger font-bold px-4 py-2 rounded-full border border-danger/20 text-sm transition-all shadow-sm active:scale-95"
            >
              <FaSignInAlt className="text-base" />
              <span>Login</span>
            </Link>
          ) : (
            /* প্রোফাইল হেডিং ড্রপডাউন (সিমুলেশন অন করলেই এটি দেখা যাবে) */
            <Dropdown>
              <Dropdown.Trigger>
                <span className="flex items-center gap-3 p-1 rounded-xl hover:opacity-80 transition-opacity cursor-pointer focus:outline-none select-none">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="w-10 h-10 rounded-full border-2 border-danger object-cover shadow-md"
                  />
                  <div className="hidden sm:flex flex-col items-start justify-center">
                    <h4 className="text-sm font-bold text-foreground tracking-wide leading-none">
                      {user.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-danger tracking-wider uppercase mt-1">
                      {user.role}
                    </span>
                  </div>
                </span>
              </Dropdown.Trigger>

              <Dropdown.Popover className="w-60 p-2 bg-background border border-default-200 shadow-xl rounded-xl mt-1">
                <Dropdown.Menu>
                  {/* ইউজার অ্যাকাউন্ট ইনফো */}
                  <Dropdown.Section>
                    <Header className="px-2 py-1 text-xs font-semibold text-default-400">
                      Account info
                    </Header>
                    <Dropdown.Item className="px-2 py-1 cursor-default">
                      <Label className="font-medium text-sm text-default-500 block truncate">
                        {user.email}
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Section>

                  <Separator className="my-1 border-default-100" />

                  {/* ડેશબોર્ડ লিঙ্ক */}
                  <Dropdown.Item className="p-2 hover:bg-default-100 rounded-lg transition-colors cursor-pointer">
                    <Link
                      href={`/dashboard/${user.role.toLowerCase()}`}
                      className="flex items-center gap-2.5 w-full"
                    >
                      <FaThLarge className="text-base text-default-500" />
                      <Label className="text-sm font-medium text-foreground cursor-pointer">
                        Dashboard
                      </Label>
                    </Link>
                  </Dropdown.Item>

                  <Separator className="my-1 border-default-100" />

                  {/* লগআউট বাটন */}
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="p-2 hover:bg-danger-50 dark:hover:bg-danger-950/30 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 w-full text-danger">
                      <FaSignOutAlt className="text-base" />
                      <Label className="text-sm font-bold cursor-pointer">
                        Log Out
                      </Label>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>
      </div>

      {/* মোবাইল এবং ট্যাবলেট রেসপনসিভ ড্রয়ার মেনু */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-default-200 absolute top-16 left-0 w-full p-4 flex flex-col gap-4 shadow-lg">
          <Link
            href="/donation-requests"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-semibold py-2 px-3 hover:bg-default-100 rounded-lg text-foreground block"
          >
            Donation Requests
          </Link>

          {user && (
            <Link
              href="/funding"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold py-2 px-3 hover:bg-default-100 rounded-lg text-foreground block"
            >
              Funding
            </Link>
          )}

          {/* মোবাইলের জন্য সিমুলেশন টগল */}
          <button
            onClick={() => {
              user ? handleLogout() : handleLoginSimulate();
            }}
            className="text-left text-xs font-mono py-2 px-3 bg-default-100 text-default-500 rounded-lg"
          >
            {user ? "[Simulate LogOut]" : "[Simulate LogIn]"}
          </button>

          {!user && (
            /* মোবাইল মেনুর আসল লগইন লিঙ্ক */
            <Link
              href="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger font-bold py-3 mt-2 rounded-xl border border-danger/20 text-base transition-all"
            >
              <FaSignInAlt className="text-lg" />
              <span>Login</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarClient;
