"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {

  const [stats,
    setStats] =
    useState<any>(null);

  const [loading,
    setLoading] =
    useState(true);

  // Fetch Stats
  useEffect(() => {

    fetch(
      "/api/admin-stats"
    )
      .then((res) =>
        res.json()
      )
      .then((data) => {

        setStats(data);

        setLoading(false);

      });

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Loading Dashboard...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">

        <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl animate-pulse top-10 left-10"></div>

        <div className="absolute w-[400px] h-[400px] bg-purple-500 rounded-full blur-3xl animate-pulse bottom-10 right-10"></div>

      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-5 border-b border-white/10 backdrop-blur-md">

        <h1 className="text-3xl font-bold">

          Admin Dashboard 📊

        </h1>

        <a
          href="/admin"
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl"
        >

          Back Admin

        </a>

      </nav>

      {/* Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Users */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <p className="text-gray-400 mb-3">

              Total Users

            </p>

            <h2 className="text-5xl font-bold text-blue-400">

              {
                stats.totalUsers
              }

            </h2>

          </div>

          {/* Products */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <p className="text-gray-400 mb-3">

              Total Products

            </p>

            <h2 className="text-5xl font-bold text-purple-400">

              {
                stats.totalProducts
              }

            </h2>

          </div>

          {/* Orders */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <p className="text-gray-400 mb-3">

              Total Orders

            </p>

            <h2 className="text-5xl font-bold text-pink-400">

              {
                stats.totalOrders
              }

            </h2>

          </div>

          {/* Revenue */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <p className="text-gray-400 mb-3">

              Total Revenue

            </p>

            <h2 className="text-5xl font-bold text-green-400">

              ₹
              {
                stats.totalRevenue
              }

            </h2>

          </div>

        </div>

      </div>

    </div>

  );

}