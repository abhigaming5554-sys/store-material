"use client";

import { useEffect, useState } from "react";

interface WishlistItem {

  _id: string;

  title: string;

  price: number;

  thumbnail: string;

}

export default function WishlistPage() {

  const [wishlist,
    setWishlist] =
    useState<WishlistItem[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // Load Wishlist
  useEffect(() => {

    const storedWishlist =
      JSON.parse(
        localStorage.getItem(
          "wishlist"
        ) || "[]"
      );

    setWishlist(
      storedWishlist
    );

    setLoading(false);

  }, []);

  // Remove
  const removeItem =
    (id: string) => {

      const updated =
        wishlist.filter(
          (item) =>
            item._id !== id
        );

      setWishlist(updated);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(
          updated
        )
      );

    };

  // Move To Cart
  const moveToCart =
    (item: WishlistItem) => {

      const existingCart =
        JSON.parse(
          localStorage.getItem(
            "cart"
          ) || "[]"
        );

      existingCart.push(item);

      localStorage.setItem(

        "cart",

        JSON.stringify(
          existingCart
        )

      );

      removeItem(item._id);

      alert(
        "Moved to cart 😄"
      );

    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">

        <div className="absolute w-[400px] h-[400px] bg-pink-500 rounded-full blur-3xl animate-pulse top-10 left-10"></div>

        <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl animate-pulse bottom-10 right-10"></div>

      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-5 border-b border-white/10 backdrop-blur-md">

        <h1 className="text-3xl font-bold">

          Wishlist ❤️

        </h1>

        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl"
        >

          Back Home

        </a>

      </nav>

      {/* Content */}
      <div className="relative z-10 px-6 py-16">

        {loading ? (

          <div className="text-center text-xl">

            Loading Wishlist...

          </div>

        ) : wishlist.length ===
          0 ? (

          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center">

            <h2 className="text-3xl font-bold mb-4">

              Wishlist Empty 😢

            </h2>

            <p className="text-gray-400 mb-6">

              Save products you like here.

            </p>

            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl"
            >

              Browse Products

            </a>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {wishlist.map((item) => (

              <div
                key={item._id}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition"
              >

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-60 object-cover"
                />

                <div className="p-6">

                  <h2 className="text-2xl font-bold mb-3">

                    {item.title}

                  </h2>

                  <p className="text-blue-400 text-2xl font-bold mb-5">

                    ₹{item.price}

                  </p>

                  <button
                    onClick={() =>
                      moveToCart(
                        item
                      )
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl mb-3"
                  >

                    Move To Cart

                  </button>

                  <button
                    onClick={() =>
                      removeItem(
                        item._id
                      )
                    }
                    className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-xl"
                  >

                    Remove

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}