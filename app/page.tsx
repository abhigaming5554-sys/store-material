"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// STEP 1: Added Lucide Icons
import { Menu, X } from "lucide-react";

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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // STEP 2: Added Menu State
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch Products
  useEffect(() => {
    fetchProducts();
    const savedWishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    setWishlist(savedWishlist);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/get-products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Categories
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category);
    return ["All", ...new Set(cats)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search
    if (search) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    // Sort
    if (sort === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    }
    if (sort === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, category, sort]);

  // Add To Cart
  const addToCart = (product: Product) => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = oldCart.find((item: Product) => item._id === product._id);

    if (exists) {
      toast.error("Already in cart");
      return;
    }

    const updatedCart = [...oldCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Added to cart 😄");
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    let updated = [...wishlist];
    if (updated.includes(productId)) {
      updated = updated.filter((id) => id !== productId);
      toast.success("Removed from wishlist");
    } else {
      updated.push(productId);
      toast.success("Added to wishlist ❤️");
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
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
      
      {/* STEP 3: Added Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-3xl font-black text-white">
            Store Material 🚀
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {menuOpen && (
          <div className="px-6 pb-6">
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 flex flex-col gap-4">
              <Link
                href="/admin"
                className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all font-bold"
              >
                Admin Login 🔐
              </Link>
              <Link
                href="/profile"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-bold"
              >
                Profile 👤
              </Link>
              <Link
                href="/orders"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-bold"
              >
                Orders 📦
              </Link>
              <Link
                href="/cart"
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-bold"
              >
                Cart 🛒
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      {/* Hero - STEP 4: Replaced pt-20 with pt-36 */}
      <section className="relative z-10 px-6 pt-36 pb-14">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8">
            Abhay Premium Digital
            <span className="text-blue-500"> MarketPlace</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-12">
            Buy and download premium digital products instantly 🚀
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button
              onClick={() => router.push("/cart")}
              className="px-8 py-5 rounded-3xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-xl font-black"
            >
              Open Cart 🛒
            </button>
            <button
              onClick={() => router.push("/wishlist")}
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
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
            >
              <option value="latest">Latest</option>
              <option value="low-high">Price Low To High</option>
              <option value="high-low">Price High To Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-[35px] p-16 text-center">
              <h2 className="text-4xl font-black mb-5">No Products Found 😢</h2>
              <p className="text-gray-400 text-lg">Try different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] overflow-hidden hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-72 object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center text-2xl hover:scale-110 transition-all duration-200"
                    >
                      {wishlist.includes(product._id) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <div className="p-7">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-4 py-2 rounded-full bg-blue-600 text-sm font-semibold">
                        {product.category}
                      </span>
                      <span className="text-3xl font-black text-blue-400">
                        ₹{product.price}
                      </span>
                    </div>

                    <h2 className="text-3xl font-black mb-4 line-clamp-2">
                      {product.title}
                    </h2>
                    <p className="text-gray-300 leading-relaxed line-clamp-3 mb-7">
                      {product.description}
                    </p>

                    <div className="flex flex-col gap-4">
                      <Link href={`/product/${product._id}`}>
                        <button className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold">
                          View Product 🚀
                        </button>
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200 font-bold border border-white/10"
                      >
                        Add To Cart 🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Help Center */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[40px] p-10 md:p-16 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-10 left-10 w-[250px] h-[250px] bg-blue-500/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-purple-500/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-6">Help Center 💬</h2>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-12">
                Need help with payments, downloads, account access, products, or anything else? Contact us anytime 🚀
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Telegram */}
                <div className="bg-black/30 border border-white/10 rounded-[35px] p-8 hover:scale-[1.03] transition-all duration-300">
                  <div className="text-6xl mb-6">📲</div>
                  <h3 className="text-3xl font-black mb-4">Telegram Support</h3>
                  <p className="text-gray-400 leading-relaxed mb-8">
                    Fastest support for payment issues, download help, account support, and instant replies 😄
                  </p>
                  <a
                    href="https://t.me/ABHAY-X-07"
                    target="_blank"
                    className="inline-block px-8 py-4 rounded-3xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-lg font-black"
                  >
                    Open Telegram 🚀
                  </a>
                </div>

                {/* Gmail */}
                <div className="bg-black/30 border border-white/10 rounded-[35px] p-8 hover:scale-[1.03] transition-all duration-300">
                  <div className="text-6xl mb-6">📧</div>
                  <h3 className="text-3xl font-black mb-4">Gmail Support</h3>
                  <p className="text-gray-400 leading-relaxed mb-8">
                    Contact us anytime via email for business inquiries, technical support, refunds, and other help 🔥
                  </p>
                  <a
                    href="mailto:abhigaming5554@gmail.com"
                    className="inline-block px-8 py-4 rounded-3xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-200 text-lg font-black"
                  >
                    Send Email ✨
                  </a>
                </div>
              </div>

              <div className="mt-14">
                <button
                  onClick={() => router.push("/profile")}
                  className="px-10 py-5 rounded-3xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200 text-xl font-black border border-white/10"
                >
                  Open My Account 👤
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}