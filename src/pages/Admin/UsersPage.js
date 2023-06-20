import { filter } from "lodash";
import { useState, useEffect, useCallback } from "react";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
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
  Modal,
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { MoreVert, Edit, Delete, Cancel, Update } from "@mui/icons-material";
import Loading from "../../Components/Loading";

// sections
import { ListHead, ListToolbar } from "../../Components/Admin/Users/user";
// mock
import axios from "axios";
import { auth } from "../../firebase";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "fullname", label: "Name", alignRight: false },
  { id: "emailadress", label: "E-mail address", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "userid", label: "User ID", alignRight: false },
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
      (_user) =>
        _user.fullname.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UsersPage() {
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
  const [selectedUser, setSelectedUser] = useState("");
  const [orderBy, setOrderBy] = useState("fullname");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loadedUsers, setLoadedUsers] = useState();

  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    role: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    fullname: null,
    email: null,
  });

  const userToken = auth.currentUser.accessToken;
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "/admin/users",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLoadedUsers(response.data.users);
    } catch (err) {
      setFetchError(true);
      setLoading(false);
      
    }
  }, [userToken]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (event) => {
    setUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    setErrorMessages((prevState) => ({
      ...prevState,
      [event.target.name]: "",
    }));
  };
  const handleEdit = async () => {
    const foundUser = loadedUsers.find((user) => user._id === selectedUser);
    setUserData({ ...foundUser });
  };

  const handleUpdate = async () => {
    const errorMessages = {
      fullname: !userData.fullname ? "Name cannot be empty." : "",
      email: !userData.email
        ? "Email cannot be empty."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)
        ? "Incorrect E-mail address"
        : "",
    };

    setErrorMessages(errorMessages);

    // state'lerin güncellendiği son hallerini kullanarak submit işlemini gerçekleştirin
    const isFormValid = Object.values(errorMessages).every(
      (errorMsg) => errorMsg === ""
    );

    if (isFormValid) {
      setEditModalOpen(false);
      setOpen(null);
      setLoading(true);
      try {
        const response = await axios.patch(
          process.env.REACT_APP_BACKEND_URL + `/admin/user/${selectedUser}`,
          {
            fullname: userData.fullname,
            email: userData.email,
            role: userData.role,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSelectedUser("");
        setTimeout(function () {
          // Since the database is not updated as soon as the update process is finished, we wait for one second and fetch the data.
          fetchUsers();
          setAlertState((prevState) => ({
            ...prevState,
            alertMessage: response.data.message,
            openAlert: true,
            severity: "success",
          }));
          setLoading(false);
        }, 1300);
      } catch (err) {
        setAlertState((prevState) => ({
          ...prevState,
          alertMessage: err.response.data.error,
          openAlert: true,
          severity: "error",
        }));
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setDeleteModalOpen(false);
    setOpen(null);
    setLoading(true);
    try {
      const response = await axios.delete(
        process.env.REACT_APP_BACKEND_URL + `/admin/user/${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedUser("");
      setAlertState((prevState) => ({
        ...prevState,
        alertMessage: response.data.message,
        openAlert: true,
        severity: "success",
      }));
      fetchUsers();
      setLoading(false);
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

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertState((prevState) => ({ ...prevState, openAlert: false }));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, _id) => {
    setSelectedUser(_id);
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - loadedUsers.length) : 0;

  if (!loadedUsers || loadedUsers.length === 0) {
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
          An error occurred while loading users. Please try again by refreshing
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

  const filteredUsers = applySortFilter(
    loadedUsers,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <title> Users</title>

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
                rowCount={loadedUsers.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { fullname, role, email, _id } = row;

                    return (
                      <TableRow hover key={_id} selected={selectedUser === _id}>
                        <TableCell component="th" scope="row" padding="normal">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar
                              alt={fullname}
                              src={fullname}
                              sx={{ bgcolor: "#5C8984" }}
                            />
                            <Typography
                              variant="subtitle2"
                              noWrap
                              sx={{ fontWeight: "bold" }}
                            >
                              {fullname}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{role}</TableCell>

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
            count={loadedUsers.length}
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
          setSelectedUser("");
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

        <MenuItem
          onClick={() => setDeleteModalOpen(true)}
          sx={{ color: "error.main" }}
        >
          <Delete />
          Delete
        </MenuItem>

        <Modal open={editModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "background.paper",
              borderRadius: 8,
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  error={errorMessages.fullname ? true : false}
                  helperText={errorMessages.fullname}
                  id="fullname"
                  name="fullname"
                  label="Name"
                  value={userData.fullname}
                  onChange={handleChange}
                  sx={{ paddingBottom: 1 }}
                  fullWidth
                />
                <TextField
                  error={errorMessages.email ? true : false}
                  helperText={errorMessages.email}
                  id="email"
                  name="email"
                  label="Email Address"
                  value={userData.email}
                  onChange={handleChange}
                  sx={{ paddingBottom: 1 }}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={userData.role}
                    name="role"
                    label="Role"
                    onChange={handleChange}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpdate}
                startIcon={<Update />}
                sx={{
                  mr: 3,
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
                    email: null,
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
              Are you sure you want to delete this user?
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
      </Popover>
    </>
  );
}
