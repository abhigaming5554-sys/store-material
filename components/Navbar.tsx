"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {

  const { cart } = useCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (

    <div className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between">

      <Link href="/" className="text-3xl font-bold">
        Store
      </Link>

      <div className="flex items-center gap-6">

        <Link href="/">
          Home
        </Link>

        <Link href="/cart" className="relative">

          🛒 Cart

          {totalItems > 0 && (

            <span className="absolute -top-3 -right-4 bg-red-600 text-xs px-2 py-1 rounded-full">

              {totalItems}

            </span>

          )}

        </Link>

      </div>

    </div>

  );

}