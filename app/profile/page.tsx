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

  createdAt: string;

}

export default function ProfilePage() {

  const router =
    useRouter();

  const authLoading =
    useAuth();

  const [user,
    setUser] =
    useState<any>(null);

  const [orders,
    setOrders] =
    useState<Order[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  // Fetch Profile
  useEffect(() => {

    fetchProfile();

    fetchOrders();

  }, []);

  // Fetch User
  const fetchProfile =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(

            "/api/me",

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

          setUser(
            data.user
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  // Fetch Orders
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

        }

        setLoading(false);

      } catch (error) {

        console.log(error);

        setLoading(false);

      }

    };

  // Logout
  const handleLogout =
    async () => {

      try {

        await fetch(

          "/api/logout",

          {

            method:
              "POST",

          }

        );

        localStorage.removeItem(
          "token"
        );

        toast.success(
          "Logged out 😄"
        );

        router.push(
          "/login"
        );

      } catch (error) {

        console.log(error);

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

              My Profile 👤

            </h1>

            <p className="text-gray-400 text-lg">

              Manage your account and purchases

            </p>

          </div>

          <button
            onClick={
              handleLogout
            }
            className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-200 font-bold"
          >

            Logout

          </button>

        </div>

        {/* User Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[35px] p-8 mb-16">

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">

            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-black">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            {/* Info */}
            <div className="flex-1">

              <h2 className="text-4xl font-black mb-3">

                {user?.name}

              </h2>

              <p className="text-gray-300 text-lg mb-2">

                {user?.email}

              </p>

              <div className="flex flex-wrap gap-4 mt-5">

                <div className="px-5 py-2 rounded-full bg-blue-600 text-sm font-semibold">

                  Orders:
                  {" "}
                  {orders.length}

                </div>

                <div className="px-5 py-2 rounded-full bg-purple-600 text-sm font-semibold">

                  Premium User 🚀

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Orders */}
        <div>

          <div className="flex justify-between items-center mb-10">

            <h2 className="text-4xl font-black">

              My Orders 📦

            </h2>

            <button
              onClick={() =>
                router.push(
                  "/orders"
                )
              }
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
            >

              View All

            </button>

          </div>

          {orders.length === 0 ? (

            <div className="bg-white/5 border border-white/10 rounded-[35px] p-14 text-center">

              <h3 className="text-3xl font-black mb-4">

                No Orders Yet 😢

              </h3>

              <p className="text-gray-400 mb-8">

                Buy premium products to see them here

              </p>

              <button
                onClick={() =>
                  router.push("/")
                }
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 font-bold"
              >

                Explore Products

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

                    <div className="flex justify-between items-center mb-5">

                      <span className="px-4 py-2 rounded-full bg-green-600 text-sm font-semibold">

                        Purchased

                      </span>

                      <span className="text-gray-400 text-sm">

                        {new Date(

                          order.createdAt

                        ).toLocaleDateString()}

                      </span>

                    </div>

                    <h3 className="text-2xl font-black mb-4 line-clamp-2">

                      {order.title}

                    </h3>

                    <h4 className="text-3xl font-black text-blue-400 mb-7">

                      ₹
                      {order.price}

                    </h4>

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