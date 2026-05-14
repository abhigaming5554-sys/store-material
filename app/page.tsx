"use client";

import {

  useEffect,

  useMemo,

  useState,

} from "react";

import Link
from "next/link";

import {
  useRouter,
} from "next/navigation";

import toast
from "react-hot-toast";

interface Product {

  _id: string;

  title: string;

  description: string;

  price: number;

  category: string;

  thumbnail: string;

  previewVideo?: string;

  fileUrl: string;

}

export default function HomePage() {

  const router =
    useRouter();

  const [products,
    setProducts] =
    useState<Product[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [category,
    setCategory] =
    useState("All");

  const [sort,
    setSort] =
    useState("latest");

  const [wishlist,
    setWishlist] =
    useState<string[]>([]);

  // Fetch Products
  useEffect(() => {

    fetchProducts();

    const savedWishlist =

      JSON.parse(

        localStorage.getItem(
          "wishlist"
        ) || "[]"

      );

    setWishlist(
      savedWishlist
    );

  }, []);

  const fetchProducts =
    async () => {

      try {

        const res =
          await fetch(

            "/api/get-products"

          );

        const data =
          await res.json();

        if (
          data.products
        ) {

          setProducts(
            data.products
          );

        }

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  // Categories
  const categories =
    useMemo(() => {

      const cats =
        products.map(
          (p) =>
            p.category
        );

      return [

        "All",

        ...new Set(cats),

      ];

    }, [products]);

  // Filtered Products
  const filteredProducts =
    useMemo(() => {

      let filtered =

        [...products];

      // Search
      if (search) {

        filtered =
          filtered.filter(
            (item) =>

              item.title
                .toLowerCase()

                .includes(

                  search.toLowerCase()

                )
          );

      }

      // Category
      if (
        category !== "All"
      ) {

        filtered =
          filtered.filter(
            (item) =>

              item.category ===
              category
          );

      }

      // Sort
      if (
        sort ===
        "low-high"
      ) {

        filtered.sort(

          (a, b) =>

            a.price -
            b.price

        );

      }

      if (
        sort ===
        "high-low"
      ) {

        filtered.sort(

          (a, b) =>

            b.price -
            a.price

        );

      }

      return filtered;

    }, [

      products,

      search,

      category,

      sort,

    ]);

  // Add To Cart
  const addToCart =
    (
      product: Product
    ) => {

      const oldCart =

        JSON.parse(

          localStorage.getItem(
            "cart"
          ) || "[]"

        );

      const exists =
        oldCart.find(
          (
            item: Product
          ) =>

            item._id ===
            product._id
        );

      if (exists) {

        toast.error(
          "Already in cart"
        );

        return;

      }

      const updatedCart = [

        ...oldCart,

        product,

      ];

      localStorage.setItem(

        "cart",

        JSON.stringify(
          updatedCart
        )

      );

      toast.success(
        "Added to cart 😄"
      );

    };

  // Wishlist
  const toggleWishlist =
    (
      productId: string
    ) => {

      let updated =
        [...wishlist];

      if (
        updated.includes(
          productId
        )
      ) {

        updated =
          updated.filter(
            (id) =>

              id !==
              productId
          );

        toast.success(
          "Removed from wishlist"
        );

      } else {

        updated.push(
          productId
        );

        toast.success(
          "Added to wishlist ❤️"
        );

      }

      setWishlist(
        updated
      );

      localStorage.setItem(

        "wishlist",

        JSON.stringify(
          updated
        )

      );

    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-black">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">

      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">

        <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>

        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse"></div>

      </div>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-20 pb-14">

        <div className="max-w-7xl mx-auto text-center">

          <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8">

            Premium Digital

            <span className="text-blue-500">

              {" "}Marketplace

            </span>

          </h1>

          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-12">

            Buy and download premium digital products instantly 🚀

          </p>

          <div className="flex flex-wrap justify-center gap-5">

            <button
              onClick={() =>
                router.push(
                  "/cart"
                )
              }
              className="px-8 py-5 rounded-3xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-xl font-black"
            >

              Open Cart 🛒

            </button>

            <button
              onClick={() =>
                router.push(
                  "/wishlist"
                )
              }
              className="px-8 py-5 rounded-3xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200 text-xl font-black border border-white/10"
            >

              Wishlist ❤️

            </button>

          </div>

        </div>

      </section>

      {/* Filters */}
      <section className="relative z-10 px-6 mb-14">

        <div className="max-w-7xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] p-6">

          <div className="grid md:grid-cols-3 gap-5">

            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            >

              {categories.map(
                (cat) => (

                  <option
                    key={cat}
                    value={cat}
                  >

                    {cat}

                  </option>

                )
              )}

            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            >

              <option value="latest">

                Latest

              </option>

              <option value="low-high">

                Price Low To High

              </option>

              <option value="high-low">

                Price High To Low

              </option>

            </select>

          </div>

        </div>

      </section>

      {/* Products */}
      <section className="relative z-10 px-6 pb-20">

        <div className="max-w-7xl mx-auto">

          {filteredProducts.length === 0 ? (

            <div className="bg-white/5 border border-white/10 rounded-[35px] p-16 text-center">

              <h2 className="text-4xl font-black mb-5">

                No Products Found 😢

              </h2>

              <p className="text-gray-400 text-lg">

                Try different search or category

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {filteredProducts.map(
                (product) => (

                  <div
                    key={
                      product._id
                    }
                    className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] overflow-hidden hover:scale-[1.02] transition-all duration-300"
                  >

                    {/* Image */}
                    <div className="relative">

                      <img
                        src={
                          product.thumbnail
                        }
                        alt={
                          product.title
                        }
                        className="w-full h-72 object-cover"
                      />

                      {/* Wishlist */}
                      <button
                        onClick={() =>
                          toggleWishlist(

                            product._id

                          )
                        }
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center text-2xl hover:scale-110 transition-all duration-200"
                      >

                        {wishlist.includes(

                          product._id

                        )

                          ? "❤️"

                          : "🤍"}

                      </button>

                    </div>

                    {/* Content */}
                    <div className="p-7">

                      <div className="flex justify-between items-center mb-4">

                        <span className="px-4 py-2 rounded-full bg-blue-600 text-sm font-semibold">

                          {
                            product.category
                          }

                        </span>

                        <span className="text-3xl font-black text-blue-400">

                          ₹
                          {
                            product.price
                          }

                        </span>

                      </div>

                      <h2 className="text-3xl font-black mb-4 line-clamp-2">

                        {
                          product.title
                        }

                      </h2>

                      <p className="text-gray-300 leading-relaxed line-clamp-3 mb-7">

                        {
                          product.description
                        }

                      </p>

                      {/* Actions */}
                      <div className="flex flex-col gap-4">

                        <Link
                          href={`/product/${product._id}`}
                        >

                          <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold">

                            View Product 🚀

                          </button>

                        </Link>

                        <button
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                          className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200 font-bold border border-white/10"
                        >

                          Add To Cart 🛒

                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </div>

  );

}