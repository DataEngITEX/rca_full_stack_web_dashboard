import React, { useState, useEffect } from "react";
import axios from "axios";
import MetricCard from "../components/card/MetricCard";
import { Users, CircleDot, CircleSlash, Link, Circle } from "lucide-react";
import TableGrid from "../components/table/TableGrid";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_WEB_BASE_URL,
});
const Home = () => {
  const [merchantStats, setMerchantStats] = useState({});
  const [merchantData, setMerchantData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortModel, setSortModel] = useState([
    { field: "merchant_name", sort: "asc" },
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(null);
  const columns = [
    { field: "terminal_id", headerName: "Terminal ID", width: 130 },
    { field: "merchant_id", headerName: "Merchant ID", width: 130 },
    { field: "merchant_name", headerName: "Merchant Name", width: 200 },
    { field: "bank", headerName: "Bank", width: 160 },
    { field: "ptsp", headerName: "PTSP", width: 180 },
    { field: "ptsp_code", headerName: "PTSP CODE", width: 100 },
    { field: "state", headerName: "State", width: 100 },
    { field: "address", headerName: "Address", width: 120 },
    {
      field: "connected",
      headerName: "Connected",
      width: 180,
      renderCell: (params) => (
        <span
          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
            params.value
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      width: 140,
      renderCell: (params) => (
        <span
          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
            params.value
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "inactive",
      headerName: "Inactive",
      width: 180,
      renderCell: (params) => (
        <span
          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
            params.value
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "last_transaction_time",
      headerName: "Last Transaction Time",
      width: 200,
      valueFormatter: (params) => {
        return params ? new Date(params).toLocaleDateString() : "";
      },
    },
  ];
  useEffect(() => {
    const fetchMerchantStatsData = async () => {
      try {
        const response = await axiosApi.get("/api/merchants/getMerchantStats");
        console.log(response.data);
        setMerchantStats(response.data);
      } catch (error) {
        console.error("Error fetching merchant stats:", error);
      }
    };
    const fetchMerchantData = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get("/api/merchants/getAllMerchants", {
          params: {
            page,
            pageSize,
            sortField: sortModel[0]?.field || "merchant_name",
            sortOrder: sortModel[0]?.sort || "asc",
            filter: filter,
          },
        });
        console.log(response.data);
        setLoading(false);
        setMerchantData(response.data.rows);
      } catch (error) {
        console.error("Error fetching merchant data:", error);
      }
    };
    fetchMerchantData();
    fetchMerchantStatsData();
  }, [page, pageSize, sortModel, filter]);
  return (
    <div>
      <header className="mb-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Terminal RCA Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Overview of terminal registration, connectivity, and activity.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Terminals"
          value={merchantStats.total_merchants || 0}
          percentage={null}
          color="border-blue-500"
          icon={<Users className="w-6 h-6 text-blue-500" />}
        />

        <MetricCard
          title="Active Terminals"
          value={merchantStats.active_merchants || 0}
          percentage={null}
          color="border-green-500"
          icon={<CircleDot className="w-6 h-6 text-green-500" />}
        />

        <MetricCard
          title="Inactive Terminals"
          value={merchantStats.inactive_merchants || 0}
          percentage={null}
          color="border-gray-500"
          icon={<CircleSlash className="w-6 h-6 text-gray-500" />}
        />

        <MetricCard
          title="Connected Terminals"
          value={merchantStats.connected_merchants || 0}
          percentage={null}
          color="border-purple-500"
          icon={<Link className="w-6 h-6 text-purple-500" />}
        />
      </div>
      <TableGrid
        rows={merchantData}
        columns={columns}
        rowCount={merchantStats.total_merchants || 0}
        page={page}
        pageSize={pageSize}
        sortModel={sortModel}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        onSortModelChange={(model) => setSortModel(model)}
        onFilterModelChange={(filter) =>
          setFilter(filter["quickFilterValues"]?.[0] || null)
        }
        loading={loading}
      />
    </div>
  );
};

export default Home;
