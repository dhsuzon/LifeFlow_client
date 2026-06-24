import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppShell from "@/components/layout/AppShell";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "LifeFlow | Blood Donation Platform",
  description: "Connect blood donors with recipients through LifeFlow.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" data-theme="dark" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* <AppShell navbar={<Navbar />} footer={<Footer />}>
          {children}
        </AppShell> */}
        <Navbar />
        {children}
        <Footer />

        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
};
export default RootLayout;
