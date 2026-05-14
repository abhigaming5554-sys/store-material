"use client";

import {

  useEffect,

  useState,

} from "react";

import {

  useRouter,

} from "next/navigation";

import toast from "react-hot-toast";

import useAuth
from "@/hooks/useAuth";

interface Order {

  _id: string;

  title: string;

  price: number;

  fileUrl: string;

  paymentId: string;

  createdAt: string;

}

export default function OrdersPage() {

  const router =
    useRouter();

  const authLoading =
    useAuth();

  const [orders,
    setOrders] =
    useState<Order[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // Fetch Orders
  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(

            "/api/my-orders",

            {

              headers: {

                authorization:
                  `Bearer ${token}`,

              },

            }

          );

        const data =
          await res.json();

        if (
          data.success
        ) {

          setOrders(
            data.orders
          );

        } else {

          toast.error(
            data.message
          );

        }

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  if (
    loading ||
    authLoading
  ) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-14">

      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">

        <div className="absolute top-20 left-20 w-[350px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>

        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse"></div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-14">

          <div>

            <h1 className="text-5xl font-black mb-3">

              My Orders 📦

            </h1>

            <p className="text-gray-400 text-lg">

              All your premium purchases

            </p>

          </div>

          <button
            onClick={() =>
              router.push("/")
            }
            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
          >

            Explore Products

          </button>

        </div>

        {/* Empty */}
        {orders.length === 0 ? (

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] p-16 text-center">

            <h2 className="text-4xl font-black mb-5">

              No Orders Yet 😢

            </h2>

            <p className="text-gray-400 text-lg mb-10">

              Buy products to see them here

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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {orders.map(
              (order) => (

                <div
                  key={order._id}
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] p-7 hover:scale-[1.02] transition-all duration-300"
                >

                  {/* Top */}
                  <div className="flex justify-between items-center mb-6">

                    <span className="px-4 py-2 rounded-full bg-green-600 text-sm font-semibold">

                      Paid ✅

                    </span>

                    <span className="text-gray-400 text-sm">

                      {new Date(

                        order.createdAt

                      ).toLocaleDateString()}

                    </span>

                  </div>

                  {/* Product */}
                  <h2 className="text-2xl font-black mb-4 line-clamp-2">

                    {order.title}

                  </h2>

                  {/* Price */}
                  <h3 className="text-4xl font-black text-blue-400 mb-5">

                    ₹
                    {order.price}

                  </h3>

                  {/* Payment */}
                  <div className="bg-black/30 rounded-2xl p-4 mb-6 border border-white/5">

                    <p className="text-gray-400 text-sm mb-1">

                      Payment ID

                    </p>

                    <p className="text-sm break-all">

                      {
                        order.paymentId
                      }

                    </p>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-4">

                    <button
                      onClick={() =>
                        window.open(

                          order.fileUrl,

                          "_blank"

                        )
                      }
                      className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
                    >

                      Download 🚀

                    </button>

                    <button
                      onClick={() =>
                        router.push(
                          "/profile"
                        )
                      }
                      className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200 font-bold"
                    >

                      Back To Profile

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}