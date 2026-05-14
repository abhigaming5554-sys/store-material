import type { Metadata }
from "next";

import "./globals.css";

import { Toaster }
from "react-hot-toast";

export const metadata: Metadata = {

  title:
    "Store Material 🚀",

  description:
    "Premium Digital Products Store",

};

export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html lang="en">

      <body>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
        />

        {/* App Content */}
        {children}

      </body>

    </html>

  );

}