import { filter } from "lodash";
import { useState, useEffect } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { MoreVert, Edit, Delete, Update, Cancel } from "@mui/icons-material";
import Loading from "../../Components/Loading";
// sections
import { ListHead, ListToolbar } from "../../Components/Admin/Users/user";
// mock
import axios from "axios";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "author", label: "Author", alignRight: false },
  { id: "pages", label: "Page", alignRight: false },
  { id: "bookid", label: "Book ID", alignRight: false },
  { id: "" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_book) => _book.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UsersPage() {
  const [open, setOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loadedBooks, setLoadedBooks] = useState();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/books"
        );
        setLoadedBooks(response.data.books);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  if (!loadedBooks || loadedBooks.length === 0) {
    return (
      <div style={{ marginLeft: 500 }}>
        <Loading />
      </div>
    );
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - loadedBooks.length) : 0;

  const filteredUsers = applySortFilter(
    loadedBooks,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <title> Books</title>

      <Container style={{ marginTop: "13vh" }}>
        <Card>
          <ListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={loadedBooks.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { name, pages, author, _id } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedUser}
                      >
                        <TableCell component="th" scope="row" padding="normal">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{author}</TableCell>

                        <TableCell align="left">{pages}</TableCell>

                        <TableCell align="left">{_id}</TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              handleOpenMenu(event);
                              handleClick(event, _id);
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={loadedBooks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => {
          handleCloseMenu();
          setSelected([]);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Edit />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }}>
          <Delete />
          Delete
        </MenuItem>
      </Popover>

      <Modal open={modalOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            maxWidth: "90vw",
            bgcolor: "background.paper",
            borderRadius: 8,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <TextField label="Name" sx={{ paddingBottom: 1 }} fullWidth />
              <TextField label="Author" sx={{ paddingBottom: 1 }} fullWidth />
              <TextField
                label="Publisher"
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
              <TextField
                label="Star"
                type="number"
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
              <TextField label="Image" sx={{ paddingBottom: 1 }} fullWidth />
              <TextField label="Language" sx={{ paddingBottom: 1 }} fullWidth />
              <TextField label="Pages" sx={{ paddingBottom: 1 }} fullWidth />
            </Box>
            <Box sx={{ flex: "3 1" }}>
              <TextField
                label="Description"
                multiline
                rows={17.7}
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Update />}
              sx={{
                mr: 2,
                backgroundColor: "red",
                "&:hover": { backgroundColor: "#dd3333" },
              }}
            >
              UPDATE
            </Button>
            <Button
              variant="contained"
              onClick={() => setModalOpen(false)}
              startIcon={<Cancel />}
              sx={{
                backgroundColor: "grey.600",
                "&:hover": { backgroundColor: "grey.700" },
              }}
            >
              CANCEL
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
