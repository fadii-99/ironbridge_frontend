import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { HiOutlineUserGroup, HiOutlineSearch } from "react-icons/hi";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminAnalytics = () => {
  // Dummy Data
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Searches",
        data: [500, 700, 1200, 900, 1500, 1100],
        backgroundColor: "#facc15",
      },
    ],
  };

  const pieData = {
    labels: ["Mechanical", "Electrical", "Hydraulics", "Others"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#facc15", "#a855f7", "#3b82f6", "#ef4444"],
      },
    ],
  };

  return (
    <div className="space-y-8 md:mt-0 mt-16">
      {/* Page Heading */}
      <h1 className="text-2xl font-bold mb-12">Your Analytics</h1>

      {/* Top Stats */}
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
        <div className="bg-black/70 border border-white/20 p-6 rounded-lg flex items-center gap-4">
          <HiOutlineUserGroup className="text-yellow-400 text-3xl" />
          <div>
            <p className="text-gray-400 text-sm">Total Users</p>
            <h2 className="text-2xl font-bold">1,250</h2>
          </div>
        </div>
        <div className="bg-black/70 border border-white/20 p-6 rounded-lg flex items-center gap-4">
          <HiOutlineSearch className="text-yellow-400 text-3xl" />
          <div>
            <p className="text-gray-400 text-sm">Total Searches</p>
            <h2 className="text-2xl font-bold">8,430</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-black/70 border border-white/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-12">Monthly Searches</h3>
          <div className="h-[250px]">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-black/70 border border-white/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-12">Search Categories</h3>
          <div className="h-[250px] flex items-center justify-center">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#fff" },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
