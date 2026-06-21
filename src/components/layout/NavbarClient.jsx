"use client";
import React, { useState } from "react";
import {
  Dropdown,
  Button,
  Label,
  Header,
  Separator,
  Avatar,
  Toast,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import {
  FaHeartbeat,
  FaBars,
  FaTimes,
  FaThLarge,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const NavbarClient = ({ InitialUser }) => {
  const Router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = isPending ? InitialUser : session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success(`${user?.name ? user.name : ""} Logout sucessfully`, {
      onClose: () => Router.push("/auth/login"),
    });
  };

  return (
    <div className="w-full bg-background/80 my-2 backdrop-blur-md border-b border-default-200 sticky top-0 z-50">
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
        </div>

        <div className="flex items-center">
          {!user ? (
            <div className="flex items-center gap-3">
              {/* Button Shape Login */}
              <Link
                href="/auth/login"
                className="flex items-center gap-2 border border-default-300 bg-default-50 text-foreground hover:bg-default-100 px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
              >
                <FaSignInAlt className="text-sm" />
                <span>Sign In</span>
              </Link>
              {/* Button Shape Register */}
              <Link
                href="/auth/register"
                className="flex items-center gap-2 bg-danger text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-danger/90 transition-all active:scale-95"
              >
                <FaUserPlus className="text-sm" />
                <span>Sign Up</span>
              </Link>
            </div>
          ) : (
            <Dropdown>
              <Dropdown.Trigger>
                <span className="flex items-center gap-3 p-1 rounded-xl hover:opacity-80 cursor-pointer select-none">
                  <Avatar className="w-10 h-10 border-2 border-danger shadow-md object-cover">
                    <Avatar.Image src={user.image} alt={user.name} />
                    <Avatar.Fallback>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
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
              <Dropdown.Popover className="w-50 p-2 bg-background border border-default-200 shadow-xl rounded-xl mt-1">
                <Dropdown.Menu>
                  <Dropdown.Section>
                    <Header className="px-2 py-1 text-xs font-semibold text-default-400">
                      Account info
                    </Header>
                    <Dropdown.Item className="px-2 py-2">
                      <Label className="text-sm text-default-500  text-wrap">
                        {user.email}
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Separator className="my-1 border-default-100" />
                  <Dropdown.Item className="p-2 hover:bg-default-100 rounded-lg">
                    <Link
                      href={`/dashboard`}
                      className="flex items-center gap-2.5 w-full"
                    >
                      <FaThLarge className="text-base text-default-500" />
                      <Label className="text-sm font-medium text-foreground cursor-pointer">
                        Dashboard
                      </Label>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item className="p-2 hover:bg-default-100 rounded-lg">
                    <Link
                      href={`/`}
                      className="flex items-center gap-2.5 w-full"
                    >
                      <FaHome className="text-base text-default-500" />
                      <Label className="text-sm font-medium text-foreground cursor-pointer">
                        Home
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

      {/* Mobile Menu */}
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
          {!user && (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 border border-default-200 text-foreground py-2 rounded-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaSignInAlt /> Sign In
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-2 bg-danger text-white py-2 rounded-lg font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUserPlus /> Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarClient;
