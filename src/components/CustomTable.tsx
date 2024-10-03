import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Grid, TableHead, styled } from "@mui/material";
import {
  PaginationState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6d3481",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const CustomTable = ({
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  data,
  columns,
  totalCount,
  serverPagination,
  loading,
}: any) => {
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = pageIndex > 0 ? Math.max(0, (1 + pageIndex) * pageSize - data.length) : 0;

  const final_columns = React.useMemo(() => columns, [columns]);
  const final_data = React.useMemo(() => data, [data]);

  let reactTableObj = React.useMemo(() => {
    let finalObj: TableOptions<unknown> = {
      data: final_data?.length ? final_data : [],
      columns: final_columns,
      getCoreRowModel: getCoreRowModel(),
      pageCount: Math.ceil(totalCount / pageSize),
      state: {
        pagination: { pageIndex, pageSize },
      },
      // onPaginationChange: onChangePagination,
      manualPagination: true,
    };
    return finalObj;
  }, [final_data, final_columns, serverPagination, totalCount]);

  const table = useReactTable(reactTableObj);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    table.setPageSize(Number(event.target.value));
    setPageSize(parseInt(event.target.value, 10));
    setPageIndex(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <StyledTableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {
                      {
                        asc: " 🔼",
                        desc: " 🔽",
                      }[(header.column.getIsSorted() as string) ?? null]
                    }
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {table.getRowModel().rows.length !== 0 && !loading && serverPagination && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: 100000 }]}
                  colSpan={12}
                  count={totalCount}
                  rowsPerPage={pageSize}
                  page={pageIndex}
                  slotProps={{
                    select: {
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {loading && (
        <Grid sx={{ p: 2, border: "1px solid white", borderRadius: "5px" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <h4>loading...</h4>
          </Box>
        </Grid>
      )}
      {table.getRowModel().rows.length === 0 && !loading && (
        <Grid sx={{ p: 2, border: "1px solid white", borderRadius: "5px" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <h4>No Data</h4>
          </Box>
        </Grid>
      )}
    </>
  );
};
