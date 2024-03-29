import { filter } from "lodash";
import { useState, useEffect, useCallback, useContext } from "react";
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
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import { MoreVert, Edit, Delete, Update, Cancel } from "@mui/icons-material";
import Loading from "../../Components/Loading";
// sections
import { ListHead, ListToolbar } from "../../Components/Admin/Users/user";
// mock
import { AbilityContext } from "../../features/can";
import { auth } from "../../firebase";
import { https } from "../../features/http-common";
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

export default function BooksPage() {
  const ability = useContext(AbilityContext);
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [alertState, setAlertState] = useState({
    severity: null,
    openAlert: false,
    alertMessage: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loadedBooks, setLoadedBooks] = useState();

  const [bookData, setBookData] = useState({
    name: "",
    author: "",
    publisher: "",
    star: 1,
    image: "",
    language: "",
    pages: "",
    description: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    name: null,
    author: null,
    publisher: null,
    star: null,
    image: null,
    language: null,
    pages: null,
    description: null,
  });
  const userToken = auth.currentUser.accessToken;
  const fetchBooks = useCallback(async () => {
    try {
      const response = await https(userToken).get("/admin/books");

      setLoadedBooks(response.data.books);
    } catch (err) {
      setFetchError(true);
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setBookData({
      name: "",
      author: "",
      publisher: "",
      star: 1,
      image: "",
      language: "",
      pages: "",
      description: "",
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleUpdate = async () => {
    const errorMessages = {
      name: !bookData.name ? "Name cannot be empty" : "",
      author: !bookData.author ? "Author cannot be empty" : "",
      publisher: !bookData.publisher ? "Publisher cannot be empty." : "",
      image: !bookData.image ? "Image cannot be empty." : "",
      language: !bookData.language ? "Language cannot be empty." : "",
      pages: !bookData.pages ? "Number of pages cannot be empty" : "",
      description:
        bookData.description.length < 100
          ? "Description must be at least 100 characters."
          : "",
    };

    setErrorMessages(errorMessages);

    const isFormValid = Object.values(errorMessages).every(
      (errorMsg) => errorMsg === ""
    );
    if (isFormValid) {
      setEditModalOpen(false);
      setOpen(null);
      setLoading(true);
      try {
        const response = await https(userToken).patch(
          `/admin/book/${selectedBook}`,
          {
            name: bookData.name,
            author: bookData.author,
            publisher: bookData.publisher,
            star: bookData.star,
            description: bookData.description,
            image: bookData.image,
            language: bookData.language,
            pages: bookData.pages,
          }
        );
        setSelectedBook("");
        setTimeout(function () {
          // Since the database is not updated as soon as the update process is finished, we wait for one second and fetch the data.
          fetchBooks();
          setLoading(false);
          setAlertState((prevState) => ({
            ...prevState,
            alertMessage: response.data.message,
            openAlert: true,
            severity: "success",
          }));
        }, 1000);
      } catch (err) {
        setLoading(false);
        setAlertState((prevState) => ({
          ...prevState,
          alertMessage: err.response.data.error,
          openAlert: true,
          severity: "error",
        }));
      }
    } else {
      console.log("Form inputs incorrect.");
    }
  };

  const handleEdit = async () => {
    const foundBook = loadedBooks.find((book) => book._id === selectedBook);
    setBookData({ ...foundBook });
  };
  const handleChange = (event) => {
    setBookData((prevState) => ({
      ...prevState,
      [event.target.name]:
        event.target.name === "star"
          ? parseInt(event.target.value)
          : event.target.value, // Since [event.target.name] takes all values as strings, we convert the star value to number.
    }));
    setErrorMessages((prevState) => ({
      ...prevState,
      [event.target.name]: "",
    }));
  };
  const handleDelete = async () => {
    setDeleteModalOpen(false);
    setOpen(null);
    setLoading(true);
    try {
      const response = await https(userToken).delete(
        `/admin/book/${selectedBook}`
      );
      setSelectedBook("");
      fetchBooks();
      setLoading(false);
      setAlertState((prevState) => ({
        ...prevState,
        alertMessage: response.data.message,
        openAlert: true,
        severity: "success",
      }));
    } catch (err) {
      setAlertState((prevState) => ({
        ...prevState,
        alertMessage: err.response.data.error,
        openAlert: true,
        severity: "error",
      }));
      setLoading(false);
    }

  };

  const handleClick = (event, _id) => {
    setSelectedBook(_id);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertState((prevState) => ({ ...prevState, openAlert: false }));
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
    if (fetchError) {
      return (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          An error occurred while loading books. Please try again by refreshing
          the page.
        </div>
      );
    } else {
      return (
        <div style={{ marginLeft: 500 }}>
          <Loading />
        </div>
      );
    }
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - loadedBooks.length) : 0;

  const filteredBooks = applySortFilter(
    loadedBooks,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredBooks.length && !!filterName;

  return (
    <>
      <title> Books</title>

      <Container style={{ marginTop: "13vh" }}>
        {loading && <Loading asOverlay />}
        <Snackbar
          open={alertState.openAlert}
          autoHideDuration={2000}
          onClose={handleAlertClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ marginTop: "60px" }}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alertState.severity}
            sx={{ width: "100%" }}
          >
            {alertState.alertMessage}
          </Alert>
        </Snackbar>
        <Card>
          <ListToolbar
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
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredBooks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { name, pages, author, _id } = row;

                    return (
                      <TableRow hover key={_id} selected={selectedBook === _id}>
                        <TableCell component="th" scope="row" padding="normal">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                              noWrap
                            >
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
          setSelectedBook("");
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
        <MenuItem
          onClick={() => {
            setEditModalOpen(true);
            handleEdit();
          }}
        >
          <Edit />
          Edit
        </MenuItem>
        {ability.can("delete", "Book") && (
          <MenuItem
            onClick={() => setDeleteModalOpen(true)}
            sx={{ color: "error.main" }}
          >
            <Delete />
            Delete
          </MenuItem>
        )}
      </Popover>

      <Modal open={editModalOpen}>
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
              <TextField
                error={errorMessages.name ? true : false}
                helperText={errorMessages.name}
                id="name"
                name="name"
                label="Name"
                value={bookData.name}
                onChange={handleChange}
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
              <TextField
                error={errorMessages.author ? true : false}
                helperText={errorMessages.author}
                id="author"
                name="author"
                label="Author"
                value={bookData.author}
                onChange={handleChange}
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
              <TextField
                error={errorMessages.publisher ? true : false}
                helperText={errorMessages.publisher}
                id="publisher"
                name="publisher"
                value={bookData.publisher}
                onChange={handleChange}
                label="Publisher"
                sx={{ paddingBottom: 1 }}
                fullWidth
              />

              <TextField
                error={errorMessages.image ? true : false}
                helperText={errorMessages.image}
                id="image"
                name="image"
                label="Image"
                value={bookData.image}
                onChange={handleChange}
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
              <TextField
                error={errorMessages.language ? true : false}
                helperText={errorMessages.language}
                id="language"
                name="language"
                label="Language"
                value={bookData.language}
                onChange={handleChange}
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
              <TextField
                error={errorMessages.pages ? true : false}
                helperText={errorMessages.pages}
                id="pages"
                name="pages"
                label="Pages"
                value={bookData.pages}
                onChange={handleChange}
                type="number"
                sx={{ paddingBottom: 1 }}
                fullWidth
              />
              <Typography
                variant="body1"
                display="inline"
                sx={{ marginLeft: "4px" }}
              >
                Star:
                <Rating
                  id="star"
                  name="star"
                  value={bookData.star}
                  onChange={handleChange}
                  style={{ verticalAlign: "top", marginLeft: 2 }}
                />
              </Typography>
            </Box>
            <Box sx={{ flex: "3 1" }}>
              <TextField
                error={errorMessages.description ? true : false}
                helperText={errorMessages.description}
                id="description"
                name="description"
                label="Description"
                value={bookData.description}
                onChange={handleChange}
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
              onClick={handleUpdate}
              startIcon={<Update />}
              sx={{
                mr: 2,
                backgroundColor: "green",
                "&:hover": { backgroundColor: "#18691c" },
              }}
            >
              UPDATE
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setErrorMessages({
                  //Clear all old error messages when clicking Cancel.
                  name: null,
                  author: null,
                  publisher: null,
                  star: null,
                  image: null,
                  language: null,
                  pages: null,
                  description: null,
                });
                setEditModalOpen(false);
              }}
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

      <Modal
        open={deleteModalOpen}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 8,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="delete-modal-title" style={{ marginTop: -8 }}>
            Are you sure you want to delete this book?
          </h2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "auto",
            }}
          >
            <Button
              onClick={handleDelete}
              variant="contained"
              startIcon={<Delete />}
              sx={{
                mr: 10,
                backgroundColor: "red",
                "&:hover": { backgroundColor: "#dd3333" },
              }}
            >
              DELETE
            </Button>
            <Button
              onClick={() => setDeleteModalOpen(false)}
              variant="contained"
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
