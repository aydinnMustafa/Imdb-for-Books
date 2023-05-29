import { filter } from "lodash";
import { useState, useEffect } from "react";
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
} from "@mui/material";
import { MoreVert, Edit, Delete, Cancel } from "@mui/icons-material";
import Loading from "../../Components/Loading";

// sections
import { ListHead, ListToolbar } from "../../Components/Admin/Users/user";
// mock
import axios from "axios";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("fullname");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "/users/"
      );
      setLoadedUsers(response.data.users);
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleDelete = async () => {
    const selectedUser = selected[0];

    try {
      await axios.delete(
        process.env.REACT_APP_BACKEND_URL + `/users/${selectedUser}`
      );
      setModalOpen(false);
      setOpen(null);
      setSelected([]);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

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

  if (!loadedUsers || loadedUsers.length === 0) {
    return (
      <div style={{ marginLeft: 500 }}>
        <Loading />
      </div>
    );
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - loadedUsers.length) : 0;

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
                rowCount={loadedUsers.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { fullname, role, email, _id } = row;
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
                            <Avatar
                              alt={fullname}
                              src={fullname}
                              sx={{ bgcolor: "#5C8984" }}
                            />
                            <Typography variant="subtitle2" noWrap>
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

        <MenuItem
          onClick={() => setModalOpen(true)}
          sx={{ color: "error.main" }}
        >
          <Delete />
          Delete
        </MenuItem>

        <Modal
          open={modalOpen}
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
                onClick={() => setModalOpen(false)}
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
