"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

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

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProductPage() {

  const { id } =
    useParams();

  const router =
    useRouter();

  const [product,
    setProduct] =
    useState<Product | null>(
      null
    );

  const [loading,
    setLoading] =
    useState(true);

  const [reviews,
    setReviews] =
    useState<Review[]>([]);

  const [rating,
    setRating] =
    useState(5);

  const [comment,
    setComment] =
    useState("");

  const [reviewLoading,
    setReviewLoading] =
    useState(false);

  const [relatedProducts,
    setRelatedProducts] =
    useState<Product[]>([]);

  // Load
  useEffect(() => {

    fetchProduct();

    fetchReviews();

    // Razorpay
    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(
      script
    );

  }, []);

  // Fetch Product
  const fetchProduct =
    async () => {

      try {

        const res =
          await fetch(
            "/api/get-products"
          );

        const data =
          await res.json();

        const found =
          data.products.find(
            (p: Product) =>
              p._id === id
          );

        if (!found) {

          setLoading(false);

          return;

        }

        setProduct(found);

        // Related
        const related =
          data.products.filter(
            (p: Product) =>

              p.category ===
                found.category &&

              p._id !==
                found._id
          );

        setRelatedProducts(
          related
        );

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  // Fetch Reviews
  const fetchReviews =
    async () => {

      try {

        const res =
          await fetch(

            "/api/get-reviews",

            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                productId: id,
              }),
            }

          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          setReviews(
            data.reviews
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  // Add Review
  const addReview =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          toast.error(
            "Login first"
          );

          router.push(
            "/login"
          );

          return;

        }

        setReviewLoading(
          true
        );

        const res =
          await fetch(

            "/api/add-review",

            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify({

                productId: id,

                rating,

                comment,

              }),

            }

          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          toast.success(
            "Review added 😄"
          );

          setComment("");

          setRating(5);

          fetchReviews();

        } else {

          toast.error(
            data.message
          );

        }

        setReviewLoading(
          false
        );

      } catch (error) {

        console.log(error);

        setReviewLoading(
          false
        );

      }

    };

  // Add To Cart
  const addToCart =
    () => {

      if (!product)
        return;

      const oldCart =
        JSON.parse(

          localStorage.getItem(
            "cart"
          ) || "[]"

        );

      const exists =
        oldCart.find(
          (item: Product) =>
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
    () => {

      if (!product)
        return;

      const oldWishlist =
        JSON.parse(

          localStorage.getItem(
            "wishlist"
          ) || "[]"

        );

      let updated =
        [...oldWishlist];

      if (
        updated.includes(
          product._id
        )
      ) {

        updated =
          updated.filter(
            (id: string) =>
              id !==
              product._id
          );

        toast.success(
          "Removed from wishlist"
        );

      } else {

        updated.push(
          product._id
        );

        toast.success(
          "Added to wishlist ❤️"
        );

      }

      localStorage.setItem(

        "wishlist",

        JSON.stringify(
          updated
        )

      );

    };

  // Buy Now
  const handlePayment =
    async () => {

      try {

        if (!product)
          return;

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          toast.error(
            "Login first"
          );

          router.push(
            "/login"
          );

          return;

        }

        const res =
          await fetch(

            "/api/create-order",

            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                amount:
                  product.price *
                  100,

              }),

            }

          );

        const data =
          await res.json();

        const options = {

          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            data.order.amount,

          currency: "INR",

          name:
            "Store Material",

          description:
            product.title,

          order_id:
            data.order.id,

          handler:
            async function (
              response: any
            ) {

              // Save Order
              await fetch(

                "/api/save-order",

                {
                  method: "POST",

                  headers: {

                    "Content-Type":
                      "application/json",

                    authorization:
                      `Bearer ${token}`,

                  },

                  body: JSON.stringify({

                    productId:
                      product._id,

                    title:
                      product.title,

                    price:
                      product.price,

                    fileUrl:
                      product.fileUrl,

                    paymentId:
                      response.razorpay_payment_id,

                  }),

                }

              );

              toast.success(
                "Payment Successful 😄"
              );

              // Download
              const downloadRes =
                await fetch(

                  "/api/download",

                  {
                    method: "POST",

                    headers: {

                      "Content-Type":
                        "application/json",

                      authorization:
                        `Bearer ${token}`,

                    },

                    body: JSON.stringify({

                      productId:
                        product._id,

                    }),

                  }

                );

              const downloadData =
                await downloadRes.json();

              if (
                downloadData.success
              ) {

                window.open(

                  `${downloadData.fileUrl}?token=${downloadData.token}`,

                  "_blank"

                );

              }

            },

          theme: {
            color: "#2563eb",
          },

        };

        const razor =
          new window.Razorpay(
            options
          );

        razor.open();

      } catch (error) {

        console.log(error);

        toast.error(
          "Payment failed"
        );

      }

    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-black">

        Loading...

      </div>

    );

  }

  if (!product) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-black">

        Product Not Found

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">

      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">

        <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>

        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse"></div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Product */}
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left */}
          <div>

            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full rounded-[35px] border border-white/10 object-cover"
            />

            {product.previewVideo && (

              <video
                src={product.previewVideo}
                controls
                className="w-full rounded-[35px] border border-white/10 mt-8"
              />

            )}

          </div>

          {/* Right */}
          <div>

            <span className="px-5 py-2 rounded-full bg-blue-600 text-sm font-semibold">

              {product.category}

            </span>

            <h1 className="text-5xl lg:text-6xl font-black leading-tight mt-6 mb-6">

              {product.title}

            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">

              {product.description}

            </p>

            <h2 className="text-5xl font-black text-blue-400 mb-10">

              ₹{product.price}

            </h2>

            {/* Actions */}
            <div className="flex flex-col gap-5">

              <button
                onClick={handlePayment}
                className="w-full py-5 rounded-3xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-2xl font-black"
              >

                Buy Now 🚀

              </button>

              <button
                onClick={addToCart}
                className="w-full py-5 rounded-3xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200 text-2xl font-black border border-white/10"
              >

                Add To Cart 🛒

              </button>

              <button
                onClick={toggleWishlist}
                className="w-full py-5 rounded-3xl bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all duration-200 text-2xl font-black"
              >

                Wishlist ❤️

              </button>

            </div>

          </div>

        </div>

        {/* Reviews */}
        <div className="mt-24">

          <h2 className="text-4xl font-black mb-10">

            Customer Reviews ⭐

          </h2>

          {/* Add Review */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8 mb-10 backdrop-blur-xl">

            <h3 className="text-2xl font-black mb-6">

              Add Review ✍️

            </h3>

            <select
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(
                    e.target.value
                  )
                )
              }
              className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none mb-5"
            >

              <option value={5}>
                ⭐⭐⭐⭐⭐
              </option>

              <option value={4}>
                ⭐⭐⭐⭐
              </option>

              <option value={3}>
                ⭐⭐⭐
              </option>

              <option value={2}>
                ⭐⭐
              </option>

              <option value={1}>
                ⭐
              </option>

            </select>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="Write your review..."
              className="w-full h-36 p-4 rounded-2xl bg-black/30 border border-white/10 outline-none mb-6"
            />

            <button
              onClick={addReview}
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
            >

              {reviewLoading
                ? "Posting..."
                : "Post Review"}

            </button>

          </div>

          {/* Review List */}
          <div className="space-y-6">

            {reviews.map(
              (review) => (

                <div
                  key={review._id}
                  className="bg-white/5 border border-white/10 rounded-[35px] p-7 backdrop-blur-xl"
                >

                  <div className="flex justify-between items-center mb-4">

                    <h3 className="text-2xl font-black">

                      {review.name}

                    </h3>

                    <span className="text-yellow-400 text-xl">

                      {"⭐".repeat(
                        review.rating
                      )}

                    </span>

                  </div>

                  <p className="text-gray-300 leading-relaxed">

                    {review.comment}

                  </p>

                </div>

              )
            )}

          </div>

        </div>

        {/* Related */}
        <div className="mt-24">

          <h2 className="text-4xl font-black mb-10">

            Related Products 🔥

          </h2>

          {relatedProducts.length === 0 ? (

            <p className="text-gray-400">

              No related products

            </p>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {relatedProducts.map(
                (item) => (

                  <div
                    key={item._id}
                    className="bg-white/5 border border-white/10 rounded-[35px] overflow-hidden backdrop-blur-xl hover:scale-[1.02] transition-all duration-300"
                  >

                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-72 object-cover"
                    />

                    <div className="p-7">

                      <div className="flex justify-between items-center mb-4">

                        <span className="px-4 py-2 rounded-full bg-blue-600 text-sm font-semibold">

                          {item.category}

                        </span>

                        <span className="text-3xl font-black text-blue-400">

                          ₹{item.price}

                        </span>

                      </div>

                      <h3 className="text-3xl font-black mb-4 line-clamp-2">

                        {item.title}

                      </h3>

                      <p className="text-gray-300 line-clamp-3 mb-7">

                        {item.description}

                      </p>

                      <button
                        onClick={() =>
                          router.push(
                            `/product/${item._id}`
                          )
                        }
                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
                      >

                        View Product

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}