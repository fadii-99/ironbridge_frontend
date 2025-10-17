// src/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
  HiChevronLeft,
  HiChevronRight,
  HiSearch,
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW: local UI state for the Usage table
  const [usageQuery, setUsageQuery] = useState("");
  const [usageSortKey, setUsageSortKey] = useState("search_count"); // 'search_count' | 'user__full_name' | 'user__email'
  const [usageSortDir, setUsageSortDir] = useState("desc"); // 'asc' | 'desc'
  const [usagePage, setUsagePage] = useState(1);
  const [usagePageSize, setUsagePageSize] = useState(10);

  const token = localStorage.getItem("AdminToken");
  if (!token) return <UnauthorizedAdminModal />;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${serverUrl}/admin/dashboard/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setData(json?.data || null);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------- Cards --------
  const cards = useMemo(() => {
    if (!data) return [];
    const items = [
      {
        title: "Total Users",
        value: data.total_users,
        icon: <HiOutlineUserGroup className="text-3xl text-yellow-400" />,
      },
      {
        title: "Verified Users",
        value: data.verified_users,
        icon: <HiOutlineCheckCircle className="text-3xl text-yellow-400" />,
      },
      {
        title: "Active Subscriptions",
        value: data.active_subscriptions,
        icon: <HiOutlineCreditCard className="text-3xl text-yellow-400" />,
      },
      {
        title: "Weekly Searches",
        value: data.weekly_searches,
        icon: <HiOutlineTrendingUp className="text-3xl text-yellow-400" />,
      },
      {
        title: "Monthly Searches",
        value: data.monthly_searches,
        icon: <HiOutlineCalendar className="text-3xl text-yellow-400" />,
      },
    ];
    return items.filter(
      (c) => typeof c.value === "number" && !Number.isNaN(c.value)
    );
  }, [data]);

  // ------- Graph (success vs failed, last 30 days) --------
  const { chartData, chartOptions } = useMemo(() => {
    const successRows = Array.isArray(data?.graph?.success_searches)
      ? data.graph.success_searches
      : [];
    const failedRows = Array.isArray(data?.graph?.failed_searcher)
      ? data.graph.failed_searcher
      : [];

    const mapFrom = (rows) =>
      rows.reduce((acc, r) => {
        if (r?.date) acc[r.date] = Number(r.count || 0);
        return acc;
      }, {});
    const mSuccess = mapFrom(successRows);
    const mFailed = mapFrom(failedRows);

    const allDates = Array.from(
      new Set([...Object.keys(mSuccess), ...Object.keys(mFailed)])
    ).sort();

    const successValues = allDates.map((d) => mSuccess[d] ?? 0);
    const failedValues = allDates.map((d) => mFailed[d] ?? 0);

    const maxVal = Math.max(
      0,
      successValues.length ? Math.max(...successValues) : 0,
      failedValues.length ? Math.max(...failedValues) : 0
    );
    const sumVal =
      successValues.reduce((a, b) => a + b, 0) +
      failedValues.reduce((a, b) => a + b, 0);
    const base = Math.max(maxVal, sumVal);
    const buffer = Math.max(2, Math.ceil(base * 0.15));

    return {
      chartData: {
        labels: allDates,
        datasets: [
          {
            label: "Success Searches",
            data: successValues,
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96,165,250,0.20)",
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: "#60a5fa",
            pointBorderColor: "#60a5fa",
          },
          {
            label: "Failed Searches",
            data: failedValues,
            borderColor: "#f87171",
            backgroundColor: "rgba(248,113,113,0.20)",
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: "#f87171",
            pointBorderColor: "#f87171",
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "white" } },
          title: {
            display: true,
            text: "Success vs Failed Searches (Last 30 Days)",
            color: "white",
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const iso = items?.[0]?.label;
                if (!iso) return "";
                const d = new Date(iso);
                return new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(d);
              },
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "white",
              callback: function (val) {
                const iso = this.getLabelForValue(val);
                const d = new Date(iso);
                return new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                }).format(d);
              },
              autoSkip: true,
              maxTicksLimit: 10,
            },
            grid: { display: false },
            border: { display: false },
          },
          y: {
            ticks: { color: "white", precision: 0 },
            grid: { display: true, color: "rgba(255,255,255,0.12)" },
            border: { display: false },
            beginAtZero: true,
            suggestedMax: base + buffer,
          },
        },
      },
    };
  }, [data]);

  // ------- Tables (top searches + failed searches) --------
  const topSearches = Array.isArray(data?.top_searches_list)
    ? data.top_searches_list
    : [];
  const failedSearchers = Array.isArray(data?.failed_searcher_list)
    ? data.failed_searcher_list
    : [];

  // ------- NEW: Usage per User (30d) — searchable, sortable, paginated -------
  const usageRowsRaw = Array.isArray(data?.usage_pr_user)
    ? data.usage_pr_user
    : [];

  const usageTotal = useMemo(
    () => usageRowsRaw.reduce((acc, r) => acc + Number(r.search_count || 0), 0),
    [usageRowsRaw]
  );

  // filter by query
  const usageFiltered = useMemo(() => {
    const q = usageQuery.trim().toLowerCase();
    if (!q) return usageRowsRaw;
    return usageRowsRaw.filter((r) => {
      const name = (r.user__full_name || "").toLowerCase();
      const email = (r.user__email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [usageQuery, usageRowsRaw]);

  // sort by selected column
  const usageSorted = useMemo(() => {
    const rows = [...usageFiltered];
    rows.sort((a, b) => {
      const av =
        usageSortKey === "search_count"
          ? Number(a.search_count || 0)
          : String(a[usageSortKey] || "").toLowerCase();
      const bv =
        usageSortKey === "search_count"
          ? Number(b.search_count || 0)
          : String(b[usageSortKey] || "").toLowerCase();
      if (av < bv) return usageSortDir === "asc" ? -1 : 1;
      if (av > bv) return usageSortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [usageFiltered, usageSortKey, usageSortDir]);

  // paginate
  const usageTotalPages = Math.max(
    1,
    Math.ceil(usageSorted.length / Math.max(1, usagePageSize))
  );
  const usagePageSafe = Math.min(Math.max(1, usagePage), usageTotalPages);
  const usageSliceStart = (usagePageSafe - 1) * usagePageSize;
  const usageSliceEnd = usageSliceStart + usagePageSize;
  const usagePageRows = usageSorted.slice(usageSliceStart, usageSliceEnd);

  const toggleSort = (key) => {
    if (usageSortKey === key) {
      setUsageSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setUsageSortKey(key);
      setUsageSortDir("desc");
    }
    setUsagePage(1);
  };

  return (
    <div className="space-y-8 md:mt-0 mt-16 max-w-[95%] mx-auto">
      <h1 className="text-2xl font-bold mb-8">Welcome to Admin Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <SmallLoader />
        </div>
      ) : !data ? (
        <div className="text-gray-400 text-center py-10">
          No dashboard data available.
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          {cards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {cards.map((c, i) => (
                <div
                  key={i}
                  className="bg-black/60 border border-white/20 rounded-xl p-6 flex items-center gap-4 shadow hover:bg-black/70 transition"
                >
                  {c.icon}
                  <div>
                    <div className="text-sm text-gray-400">{c.title}</div>
                    <div className="text-xl font-bold text-white">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Line Chart: Success vs Failed */}
          <div className="bg-black/60 border border-white/20 rounded-xl p-6 shadow h-[45vh] sm:h-[55vh] md:h-[60vh]">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Searches */}
            <div className="bg-black/60 border border-white/20 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Top Searches (30d)</h2>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-300">
                    <tr>
                      <th className="py-2 pr-3">#</th>
                      <th className="py-2 pr-3">Query</th>
                      <th className="py-2 pr-3">Type</th>
                      <th className="py-2 pr-3 text-right">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSearches.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-gray-400 py-4 text-center">
                          No data
                        </td>
                      </tr>
                    ) : (
                      topSearches.map((row, idx) => (
                        <tr
                          key={`${row.search_query}-${idx}`}
                          className="border-t border-white/10"
                        >
                          <td className="py-2 pr-3 text-gray-400">{idx + 1}</td>
                          <td className="py-2 pr-3">{row.search_query}</td>
                          <td className="py-2 pr-3 uppercase text-gray-300">
                            {row.search_type}
                          </td>
                          <td className="py-2 pr-3 text-right font-semibold">
                            {row.count}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Failed Searches */}
            <div className="bg-black/60 border border-white/20 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Failed Searches (30d)</h2>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-300">
                    <tr>
                      <th className="py-2 pr-3">#</th>
                      <th className="py-2 pr-3">Query</th>
                      <th className="py-2 pr-3">Type</th>
                      <th className="py-2 pr-3 text-right">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedSearchers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-gray-400 py-4 text-center">
                          No data
                        </td>
                      </tr>
                    ) : (
                      failedSearchers.map((row, idx) => (
                        <tr
                          key={`${row.search_query}-${idx}`}
                          className="border-t border-white/10"
                        >
                          <td className="py-2 pr-3 text-gray-400">{idx + 1}</td>
                          <td className="py-2 pr-3">{row.search_query}</td>
                          <td className="py-2 pr-3 uppercase text-gray-300">
                            {row.search_type}
                          </td>
                          <td className="py-2 pr-3 text-right font-semibold">
                            {row.count}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ===== NEW: Usage per User (bottom section) ===== */}
          <div className="bg-black/60 border border-white/20 rounded-xl p-6 shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold">Usage per User</h2>

              <div className="flex items-center gap-3">
                {/* Search box */}
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={usageQuery}
                    onChange={(e) => {
                      setUsageQuery(e.target.value);
                      setUsagePage(1);
                    }}
                    placeholder="Filter by name or email"
                    className="pl-10 pr-3 py-2 rounded-lg bg-black/50 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  />
                </div>

                {/* Page size */}
                <select
                  value={usagePageSize}
                  onChange={(e) => {
                    setUsagePageSize(Number(e.target.value));
                    setUsagePage(1);
                  }}
                  className="py-2 px-3 rounded-lg bg-black/50 border border-white/20 text-sm focus:outline-none"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-300">
                  <tr>
                    <th className="py-2 pr-3">#</th>

                    <th
                      className="py-2 pr-3 cursor-pointer select-none"
                      onClick={() => toggleSort("user__full_name")}
                      title="Sort by user name"
                    >
                      User{" "}
                      <span className="text-gray-500">
                        {usageSortKey === "user__full_name"
                          ? usageSortDir === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </span>
                    </th>

                    <th
                      className="py-2 pr-3 cursor-pointer select-none"
                      onClick={() => toggleSort("user__email")}
                      title="Sort by email"
                    >
                      Email{" "}
                      <span className="text-gray-500">
                        {usageSortKey === "user__email"
                          ? usageSortDir === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </span>
                    </th>

                    <th
                      className="py-2 pr-3 text-right cursor-pointer select-none"
                      onClick={() => toggleSort("search_count")}
                      title="Sort by searches"
                    >
                      Searches{" "}
                      <span className="text-gray-500">
                        {usageSortKey === "search_count"
                          ? usageSortDir === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </span>
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {usagePageRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-gray-400 py-4 text-center">
                        No data
                      </td>
                    </tr>
                  ) : (
                    usagePageRows.map((row, idx) => {
                      const absoluteIndex =
                        (usagePageSafe - 1) * usagePageSize + idx + 1;
                      const count = Number(row.search_count || 0);
                      const pct =
                        usageTotal > 0 ? ((count / usageTotal) * 100).toFixed(1) : "0.0";
                      return (
                        <tr key={`${row.user__email}-${absoluteIndex}`} className="border-t border-white/10">
                          <td className="py-2 pr-3 text-gray-400">{absoluteIndex}</td>
                          <td className="py-2 pr-3 capitalize">
                            {row.user__full_name || "-"}
                          </td>
                          <td className="py-2 pr-3">{row.user__email}</td>
                          <td className="py-2 pr-3 text-right font-semibold">
                            {count}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-gray-400 text-sm">
                Showing{" "}
                <span className="text-white">
                  {usagePageRows.length > 0
                    ? usageSliceStart + 1
                    : 0}
                  {" - "}
                  {usageSliceStart + usagePageRows.length}
                </span>{" "}
                of{" "}
                <span className="text-white">{usageSorted.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUsagePage((p) => Math.max(1, p - 1))}
                  disabled={usagePageSafe === 1}
                  className={`px-3 py-1.5 rounded-lg border ${
                    usagePageSafe === 1
                      ? "border-white/10 text-gray-500 cursor-not-allowed"
                      : "border-white/20 text-gray-200 hover:bg-white/10"
                  }`}
                >
                  <HiChevronLeft />
                </button>
                <span className="text-gray-300 text-sm">
                  Page {usagePageSafe} / {usageTotalPages}
                </span>
                <button
                  onClick={() =>
                    setUsagePage((p) => Math.min(usageTotalPages, p + 1))
                  }
                  disabled={usagePageSafe >= usageTotalPages}
                  className={`px-3 py-1.5 rounded-lg border ${
                    usagePageSafe >= usageTotalPages
                      ? "border-white/10 text-gray-500 cursor-not-allowed"
                      : "border-white/20 text-gray-200 hover:bg-white/10"
                  }`}
                >
                  <HiChevronRight />
                </button>
              </div>
            </div>
          </div>
          {/* ===== END Usage per User ===== */}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
