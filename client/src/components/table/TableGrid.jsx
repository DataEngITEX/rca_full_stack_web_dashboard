import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const TableGrid = ({
  rows,
  columns,
  rowCount,
  page,
  pageSize,
  sortModel,
  onPageChange,
  onPageSizeChange,
  onSortModelChange,
  onFilterModelChange,
  loading = false,
}) => {
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.terminal_id}
          onSortModelChange={onSortModelChange}
          rowCount={rowCount}
          page={page}
          pageSize={pageSize}
          sortModel={sortModel}
          loading={loading}
          onFilterModelChange={onFilterModelChange}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            onPageChange(model.page);
            onPageSizeChange(model.pageSize);
          }}
          pageSizeOptions={[5, 10, 20, 50, 100, 500]}
          pagination
          paginationMode="server"
          sortingMode="server"
          checkboxSelection
          showToolbar
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default TableGrid;
