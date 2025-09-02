import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_WEB_BASE_URL,
});

const Process = () => {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Select a CSV file to begin.");

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
          className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full  ${
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
      valueFormatter: (params) =>
        params ? new Date(params).toLocaleDateString() : "",
    },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
    setStatus(
      selectedFile ? `File selected: ${selectedFile.name}` : "No file selected"
    );
  };

  const handleProcessFile = async () => {
    if (!file) {
      setStatus("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setStatus("Uploading file and processing...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosApi.post("/api/file/uploadFile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const processedRows = response.data.data || [];
      setRows(processedRows);
      setStatus("File processed successfully.");

      // 👇 Automatically trigger CSV download using response data
      if (processedRows.length > 0) {
        const csvHeader = Object.keys(processedRows[0]).join(",") + "\n";
        const csvRows = processedRows.map((row) =>
          Object.values(row)
            .map((v) => `"${v ?? ""}"`)
            .join(",")
        );
        const csvContent = csvHeader + csvRows.join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "processed_results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("Error processing file.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setRows([]);
    setStatus("Select a CSV file to begin.");
    document.querySelector('input[type="file"]').value = ""; // reset input field
  };

  return (
    <div className="flex flex-col items-center h-full bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Upload & Process CSV
      </h1>
      <p className="text-md text-gray-500 mb-6 text-center">
        Upload a CSV, let the server update Postgres, review results, and
        automatically download them.
      </p>

      {/* Upload + process + clear */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0 file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <button
          onClick={handleProcessFile}
          disabled={loading || !file}
          className="py-2 px-6 bg-indigo-600 text-white rounded-full font-semibold cursor-pointer shadow-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Process File"}
        </button>
        <button
          onClick={handleClear}
          className="py-2 px-6 bg-red-600 text-white rounded-full cursor-pointer font-semibold shadow-md hover:bg-red-700 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Status */}
      <div className="w-full text-center text-gray-600 mb-6 p-3 bg-gray-100 rounded-md">
        {status}
      </div>

      {/* Results Table */}
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4 ml-3">
          Processed Records
        </h2>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.terminal_id}
            pageSizeOptions={[5, 10, 20, 50, 100, 500]}
            pagination
            checkboxSelection
            showToolbar
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
};

export default Process;
