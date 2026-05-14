"use client";

import {

  useEffect,

  useState,

} from "react";

import {

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

  fileUrl: string;

}

declare global {

  interface Window {

    Razorpay: any;

  }

}

export default function CartPage() {

  const router =
    useRouter();

  const [cart,
    setCart] =
    useState<Product[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // Load Cart
  useEffect(() => {

    const savedCart =

      JSON.parse(

        localStorage.getItem(
          "cart"
        ) || "[]"

      );

    setCart(savedCart);

    setLoading(false);

    // Razorpay Script
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

  // Remove From Cart
  const removeFromCart =
    (
      productId: string
    ) => {

      const updatedCart =

        cart.filter(
          (item) =>

            item._id !==
            productId
        );

      setCart(
        updatedCart
      );

      localStorage.setItem(

        "cart",

        JSON.stringify(
          updatedCart
        )

      );

      toast.success(
        "Removed from cart 😄"
      );

    };

  // Total Price
  const totalPrice =

    cart.reduce(

      (acc, item) =>

        acc + item.price,

      0

    );

  // Buy All
  const handleBuyAll =
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

        const res =
          await fetch(

            "/api/create-order",

            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                amount:
                  totalPrice *
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

          currency:
            "INR",

          name:
            "Store Material",

          description:
            "Cart Purchase",

          order_id:
            data.order.id,

          handler:
            async function (
              response: any
            ) {

              for (
                const product of cart
              ) {

                // Save Order
                await fetch(

                  "/api/save-order",

                  {

                    method:
                      "POST",

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

              }

              toast.success(
                "Payment Successful 😄"
              );

              localStorage.removeItem(
                "cart"
              );

              setCart([]);

              router.push(
                "/orders"
              );

            },

          theme: {

            color:
              "#2563eb",

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

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-14">

      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">

        <div className="absolute top-20 left-20 w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>

        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse"></div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-14">

          <div>

            <h1 className="text-5xl font-black mb-3">

              My Cart 🛒

            </h1>

            <p className="text-gray-400 text-lg">

              Complete your premium purchase

            </p>

          </div>

          <button
            onClick={() =>
              router.push("/")
            }
            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
          >

            Continue Shopping

          </button>

        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] p-16 text-center">

            <h2 className="text-4xl font-black mb-5">

              Cart is Empty 😢

            </h2>

            <p className="text-gray-400 text-lg mb-10">

              Add premium products to your cart

            </p>

            <button
              onClick={() =>
                router.push("/")
              }
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
            >

              Browse Products

            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Products */}
            <div className="lg:col-span-2 space-y-8">

              {cart.map(
                (item) => (

                  <div
                    key={item._id}
                    className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] overflow-hidden hover:scale-[1.01] transition-all duration-300"
                  >

                    <div className="grid md:grid-cols-3 gap-6">

                      {/* Image */}
                      <img
                        src={
                          item.thumbnail
                        }
                        alt={
                          item.title
                        }
                        className="w-full h-full object-cover md:h-[260px]"
                      />

                      {/* Content */}
                      <div className="md:col-span-2 p-7">

                        <div className="flex justify-between items-start gap-5 mb-5">

                          <div>

                            <span className="px-4 py-2 rounded-full bg-blue-600 text-sm font-semibold">

                              {
                                item.category
                              }

                            </span>

                            <h2 className="text-3xl font-black mt-5 mb-4">

                              {
                                item.title
                              }

                            </h2>

                          </div>

                          <h3 className="text-3xl font-black text-blue-400">

                            ₹
                            {
                              item.price
                            }

                          </h3>

                        </div>

                        <p className="text-gray-300 leading-relaxed mb-8 line-clamp-3">

                          {
                            item.description
                          }

                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4">

                          <button
                            onClick={() =>
                              router.push(

                                `/product/${item._id}`

                              )
                            }
                            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
                          >

                            View Product

                          </button>

                          <button
                            onClick={() =>
                              removeFromCart(

                                item._id

                              )
                            }
                            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-200 font-bold"
                          >

                            Remove

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* Summary */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] p-8 h-fit sticky top-10">

              <h2 className="text-3xl font-black mb-8">

                Order Summary 💳

              </h2>

              <div className="space-y-5 mb-8">

                <div className="flex justify-between text-lg">

                  <span className="text-gray-400">

                    Products

                  </span>

                  <span>

                    {cart.length}

                  </span>

                </div>

                <div className="flex justify-between text-lg">

                  <span className="text-gray-400">

                    Subtotal

                  </span>

                  <span>

                    ₹
                    {totalPrice}

                  </span>

                </div>

                <div className="flex justify-between text-lg">

                  <span className="text-gray-400">

                    Delivery

                  </span>

                  <span className="text-green-400">

                    Free

                  </span>

                </div>

              </div>

              <div className="border-t border-white/10 pt-6 mb-8">

                <div className="flex justify-between items-center">

                  <span className="text-2xl font-black">

                    Total

                  </span>

                  <span className="text-4xl font-black text-blue-400">

                    ₹
                    {totalPrice}

                  </span>

                </div>

              </div>

              <button
                onClick={
                  handleBuyAll
                }
                className="w-full py-5 rounded-3xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-2xl font-black"
              >

                Buy Now 🚀

              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}