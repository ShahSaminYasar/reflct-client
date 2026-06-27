import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import TanStackQueryProvider from "@/providers/TanStackQueryProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Reflct",
  description: "Preserve and share your life lessons",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-gray-900 antialiased`}>
        <TanStackQueryProvider>{children}</TanStackQueryProvider>
        <Toaster position="top-center" duration={2000} />
      </body>
    </html>
  );
}
