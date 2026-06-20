"use client";
import React, { useState } from "react";
import { Dropdown, Button, Label, Header, Separator } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
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
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  const handleLoginSimulate = () => {
    setUser({
      name: "Suzon",
      email: "suzon@blooddonation.com",
      role: "Admin",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    });
  };

  return (
    <div className="w-full bg-background/80 my-5 backdrop-blur-md border-b border-default-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground text-xl p-1 focus:outline-none"
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
          <button
            onClick={user ? handleLogout : handleLoginSimulate}
            className="text-[11px] bg-default-100 text-default-500 hover:text-danger px-2 py-1 rounded border border-default-300 transition-colors font-mono"
          >
            {user ? "[Simulate LogOut]" : "[Simulate LogIn]"}
          </button>
        </div>

        <div className="flex items-center">
          {!user ? (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 bg-danger/10 hover:bg-danger/20 text-danger font-bold px-4 py-2 rounded-full border border-danger/20 text-sm transition-all active:scale-95"
            >
              <FaSignInAlt className="text-base" />
              <span>Login</span>
            </Link>
          ) : (
            <Dropdown>
              <Dropdown.Trigger>
                <span className="flex items-center gap-3 p-1 rounded-xl hover:opacity-80 cursor-pointer select-none">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="w-10 h-10 rounded-full border-2 border-danger object-cover shadow-md"
                  />
                  <div className="hidden sm:flex flex-col items-start">
                    <h4 className="text-sm font-bold text-foreground leading-none">
                      {user.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-danger uppercase mt-1">
                      {user.role}
                    </span>
                  </div>
                </span>
              </Dropdown.Trigger>
              <Dropdown.Popover className="w-60 p-2 bg-background border border-default-200 shadow-xl rounded-xl mt-1">
                <Dropdown.Menu>
                  <Dropdown.Section>
                    <Header className="px-2 py-1 text-xs font-semibold text-default-400">
                      Account info
                    </Header>
                    <Dropdown.Item className="px-2 py-1">
                      <Label className="text-sm text-default-500 truncate">
                        {user.email}
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Separator className="my-1 border-default-100" />
                  <Dropdown.Item className="p-2 hover:bg-default-100 rounded-lg">
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
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="p-2 hover:bg-danger-50 rounded-lg"
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
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-default-200 p-4 flex flex-col gap-4">
          <Link
            href="/donation-requests"
            className="text-foreground font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Donation Requests
          </Link>
          {user && (
            <Link
              href="/funding"
              className="text-foreground font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Funding
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarClient;
