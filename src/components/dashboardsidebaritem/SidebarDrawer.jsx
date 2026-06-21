"use client";
import { useState } from "react";
import Link from "next/link";
import { Drawer, Button } from "@heroui/react";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaListUl,
  FaPlusCircle,
  FaUser,
  FaUsers,
  FaTint,
  FaTimes,
  FaHeartbeat,
  FaBars,
  FaThLarge,
} from "react-icons/fa";

const SidebarDrawer = ({ role = "donor" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getMenuItems = (userRole) => {
    const normalizedRole = userRole?.toLowerCase() || "donor";
    const commonMenu = [
      { name: "Dashboard", path: "/dashboard", icon: <FaThLarge /> },
      { name: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
    ];

    switch (normalizedRole) {
      case "admin":
        return [
          ...commonMenu,
          {
            name: "All Users",
            path: "/dashboard/all-users",
            icon: <FaUsers />,
          },
          {
            name: "All Requests",
            path: "/dashboard/all-blood-donation-request",
            icon: <FaTint />,
          },
        ];
      case "volunteer":
        return [
          ...commonMenu,
          {
            name: "All Requests",
            path: "/dashboard/all-blood-donation-request",
            icon: <FaTint />,
          },
        ];
      default:
        return [
          ...commonMenu,
          {
            name: "My Requests",
            path: "/dashboard/my-donation-requests",
            icon: <FaListUl />,
          },
          {
            name: "Create Request",
            path: "/dashboard/create-donation-request",
            icon: <FaPlusCircle />,
          },
        ];
    }
  };

  const menuItems = getMenuItems(role);

  // লিঙ্ক ক্লিকের সমস্যা সমাধানের জন্য সরাসরি Link ব্যবহার করা হয়েছে
  const renderMenuItems = () => (
    <div className="flex flex-col gap-2">
      <div className="px-4 py-2 text-xs font-semibold text-default-400">
        Menu
      </div>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all w-full
            ${
              pathname === item.path
                ? "bg-danger text-white shadow-md"
                : "text-default-600 dark:text-default-400 hover:bg-danger-50 dark:hover:bg-danger-950/30 hover:text-danger dark:hover:text-danger"
            }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="font-semibold text-base">{item.name}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* মোবাইলের বাটন - ফুটারে না লেগে থাকার জন্য bottom-20 */}
      <div className="md:hidden fixed bottom-20 left-6 z-50">
        <Button
          isIconOnly
          radius="full"
          color="danger"
          variant="shadow"
          size="lg"
          className="shadow-xl"
          onClick={() => setIsOpen(true)}
          aria-label="Open Sidebar"
        >
          <FaBars className="text-white text-xl" />
        </Button>
      </div>

      {/* ড্রয়ার (মোবাইল) */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="left"
        className="w-64"
      >
        <Drawer.Content className="dark:bg-zinc-950">
          <Drawer.Dialog>
            <Drawer.CloseTrigger
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-danger-50 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <FaTimes className="text-danger" />
            </Drawer.CloseTrigger>
            <Drawer.Header className="px-6 py-8">
              <Drawer.Heading className="flex items-center gap-2">
                <FaHeartbeat className="text-danger text-2xl animate-pulse" />
                <span className="text-2xl font-extrabold text-danger">
                  LifeFlow
                </span>
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="px-4">{renderMenuItems()}</Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer>

      {/* ডেস্কটপ সাইডবার - top-20 এবং bottom-20 ব্যবহার করা হয়েছে যাতে ন্যাপবার বা ফুটারের সাথে না লাগে */}
      <div className="hidden md:block w-64 fixed left-0 top-20 bottom-20 border-r border-default-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pt-4 shadow-sm overflow-y-auto rounded-r-2xl">
        <div className="px-6 pb-6 flex items-center gap-2">
          <FaHeartbeat className="text-danger text-2xl animate-pulse" />
          <h1 className="text-2xl font-extrabold text-danger">LifeFlow</h1>
        </div>
        <div className="px-4">{renderMenuItems()}</div>
      </div>
    </>
  );
};

export default SidebarDrawer;
