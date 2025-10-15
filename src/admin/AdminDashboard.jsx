// src/admin/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineOfficeBuilding,
  HiOutlineCube,
  HiOutlineSearchCircle,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
} from "react-icons/hi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import SmallLoader from "./../components/SmallLoader";
import UnauthorizedAdminModal from "./../components/UnauthorizedAdminModal";

const serverUrl = import.meta.env.VITE_SERVER_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("daily"); // 'daily' | 'weekly' | 'monthly'

  const token = localStorage.getItem("AdminToken");
  if (!token) {
    return <UnauthorizedAdminModal />;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch(`${serverUrl}/admin/dashboard/`, {
          method: "POST",
          headers,
        });

        const data = await res.json();
        // Expecting data?.data with shape:
        // { overview: {...}, searches: { series: { day:[{date,count}], week:[{week_start,count}], month:[{month,count}] }, ... }, subscriptions: {...} }
        setDashboardData(data?.data || null);
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const overview = dashboardData?.overview || {};
  const subscriptions = dashboardData?.subscriptions || {};
  const searches = dashboardData?.searches || {};
  const series = searches?.series || {};

  const safeValue = (val) =>
    typeof val === "number" || typeof val === "string" ? val : null;

  // Cards based on available numbers only (no hardcoding)
  const cards = [
    {
      title: "Total Users",
      value: safeValue(overview.total_users),
      icon: <HiOutlineUserGroup className="text-3xl text-yellow-400" />,
    },
    {
      title: "Verified Users",
      value: safeValue(overview.verified_users),
      icon: <HiOutlineCheckCircle className="text-3xl text-yellow-400" />,
    },
    {
      title: "Active Subscriptions",
      value: safeValue(overview.active_subscriptions),
      icon: <HiOutlineCreditCard className="text-3xl text-yellow-400" />,
    },
    {
      title: "Total Subscribers",
      value: safeValue(subscriptions.total_subscribers),
      icon: <HiOutlineCreditCard className="text-3xl text-yellow-400" />,
    },
    {
      title: "Manufacturers Count",
      value: safeValue(overview.manufacturers_count),
      icon: <HiOutlineOfficeBuilding className="text-3xl text-yellow-400" />,
    },
    {
      title: "Total Catalog Items",
      value: safeValue(overview.total_catalog_items),
      icon: <HiOutlineCube className="text-3xl text-yellow-400" />,
    },
    {
      title: "Total Searches",
      value: safeValue(searches.total_searches),
      icon: <HiOutlineSearchCircle className="text-3xl text-yellow-400" />,
    },
    {
      title: "Weekly Searches",
      value: safeValue(searches.weekly_searches),
      icon: <HiOutlineTrendingUp className="text-3xl text-yellow-400" />,
    },
    {
      title: "Monthly Searches",
      value: safeValue(searches.monthly_searches),
      icon: <HiOutlineCalendar className="text-3xl text-yellow-400" />,
    },
  ].filter((c) => c.value !== null && c.value !== undefined);

  // ---- Helpers to format labels ----
  const fmtDate = (iso) => {
    // '2025-10-15' -> 'Oct 15'
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(d);
    } catch {
      return iso;
    }
  };

  const fmtWeek = (weekStartIso) => {
    // '2025-10-13' -> 'Week of Oct 13'
    try {
      const d = new Date(weekStartIso);
      const label = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(d);
      return `Week of ${label}`;
    } catch {
      return weekStartIso;
    }
  };

  const fmtMonth = (yyyyMm) => {
    // '2025-10' -> 'Oct 2025'
    try {
      const [y, m] = yyyyMm.split("-").map((v) => parseInt(v, 10));
      const d = new Date(y, (m || 1) - 1, 1);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(d);
    } catch {
      return yyyyMm;
    }
  };

  // ---- Build chart data based on selected chartType ----
  const chartData = useMemo(() => {
    let labels = [];
    let values = [];

    if (chartType === "daily") {
      const rows = Array.isArray(series?.day) ? series.day : [];
      labels = rows.map((r) => fmtDate(r?.date));
      values = rows.map((r) => Number(r?.count || 0));
    } else if (chartType === "weekly") {
      const rows = Array.isArray(series?.week) ? series.week : [];
      labels = rows.map((r) => fmtWeek(r?.week_start));
      values = rows.map((r) => Number(r?.count || 0));
    } else if (chartType === "monthly") {
      const rows = Array.isArray(series?.month) ? series.month : [];
      labels = rows.map((r) => fmtMonth(r?.month));
      values = rows.map((r) => Number(r?.count || 0));
    }

    // Compute a y-axis max that’s *greater* than the data (so bars/line aren’t hugging the top).
    const maxVal = values.length ? Math.max(...values) : 0;
    const sumVal = values.reduce((a, b) => a + b, 0);
    const base = Math.max(maxVal, sumVal); // if total searches are small, use total too
    const buffer = Math.max(2, Math.ceil(base * 0.25)); // 25% buffer, at least 2
    const suggestedMax = base + buffer;

    return {
      labels,
      datasets: [
        {
          label:
            chartType.charAt(0).toUpperCase() +
            chartType.slice(1) +
            " Searches",
          data: values,
          borderColor: "#facc15",
          backgroundColor: "rgba(250, 204, 21, 0.2)",
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#facc15",
          pointBorderColor: "#facc15",
        },
      ],
      suggestedMax,
      maxVal,
    };
  }, [chartType, series]);

 const chartOptions = useMemo(
  () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } },
      title: {
        display: true,
        text:
          chartType.charAt(0).toUpperCase() +
          chartType.slice(1) +
          " Search Activity",
        color: "white",
      },
      tooltip: {
        callbacks: { label: (ctx) => ` Searches: ${ctx.parsed.y}` },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: {
          display: false,         // ❌ vertical lines OFF
        },
        border: { display: false },
      },
      y: {
        ticks: { color: "white", precision: 0 },
        grid: {
          display: true,          // ✅ horizontal lines ON
          color: "rgba(255,255,255,0.12)",
          lineWidth: 1,
        },
        border: { display: false },
        suggestedMax: chartData.suggestedMax,
        beginAtZero: true,
      },
    },
  }),
  [chartType, chartData.suggestedMax]
);


  return (
    <div className="space-y-8  md:mt-0 mt-16 max-w-[95%] mx-auto">
      <h1 className="text-2xl font-bold mb-8">Welcome to Admin Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <SmallLoader />
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          {cards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((c, i) => (
                <div
                  key={i}
                  className="bg-black/60 border border-white/20 rounded-xl p-6 flex items-center gap-4 shadow hover:bg-black/70 transition"
                >
                  {c.icon}
                  <div>
                    <div className="text-sm text-gray-400">{c.title}</div>
                    <div className="text-xl font-bold text-white">
                      {c.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-10">
              No dashboard data available.
            </div>
          )}

          {/* Chart + Filter */}
          <div className="bg-black/60 border border-white/20 rounded-xl p-6 shadow h-[45vh] sm:h-[55vh] md:h-[60vh]">
            {/* Filter Buttons */}
            <div className="flex justify-end gap-3 mb-6">
              {["daily", "weekly", "monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
                    chartType === t
                      ? "bg-yellow-400 text-black border-yellow-500"
                      : "border-white/20 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <Line data={{ labels: chartData.labels, datasets: chartData.datasets }} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
