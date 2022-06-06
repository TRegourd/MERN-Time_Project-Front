import React from "react";
import { useEffect, useState } from "react";
import services from "../services";
import {
  Button,
  Select,
  Grid,
  Box,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers/";

import "../components/timesheet.css";
import Charts from "../components/Charts";
import { CSVLink } from "react-csv";

export default function Timesheets() {
  const [timeList, setList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [projectList, setProjectList] = useState([]);
  const [showTimesheet, setShowTimesheet] = useState(false);

  const [dateValue, setDateValue] = useState(null);
  const [projectValue, setProjectValue] = useState("");
  const [userValue, setUserValue] = useState("");

  function fetchAndSetTimesheet() {
    services
      .getAllTimesheetList()
      .then((list) => {
        setList(list);
        // setShowTimesheet(!showTimesheet);
      })
      .catch(() => alert("erreur"));
    // setShowTimesheet(!showTimesheet);
  }

  useEffect(fetchAndSetTimesheet, []);

  function deleteTimesheet(id) {
    services
      .deleteTimesheetById(id)
      .then(() => {
        fetchAndSetTimesheet();
        alert("Timesheet Deleted from DB");
      })
      .catch(() => alert("erreur"));
  }

  function fetchAndSetUserList() {
    services
      .getCurrentUser()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => alert("erreur"));
  }

  function fetchAndSetProjectList() {
    services
      .getProjectsList()
      .then((list) => {
        setProjectList(list);
      })
      .catch(() => alert("erreur"));
  }

  function handleShowButton() {
    setShowTimesheet((currentState) => !currentState);
  }

  // envoi du formulaire

  const [form, setForm] = useState({
    desc: "",
    duration: "",
  });

  const body = {
    desc: form.desc,
    date: dateValue,
    duration: form.duration,
    project: projectValue,
    user: userValue,
  };

  function updateForm(key, value) {
    setForm({ ...form, [key]: value });
  }

  function handleChangeInput(e) {
    const { name, value } = e.target;
    updateForm(name, value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    services.createNewTimesheet(body).then(() => {
      fetchAndSetChartData();
      fetchAndSetTimesheet();
    });
  }

  // envoi du formulaire

  const [data, setData] = useState([]);

  function fetchAndSetChartData() {
    services.getTotalTimebyProject().then((result) => {
      setData(result);
    });
  }

  useEffect(() => {
    fetchAndSetUserList();
    //fetchAndSetTimesheet();
    fetchAndSetProjectList();
    fetchAndSetTimesheet();
    fetchAndSetChartData();
  }, []);

  // Export CSV

  const headers = [
    { label: "Created At", key: "createdAt" },
    { label: "Date", key: "date" },
    { label: "Description", key: "desc" },
    { label: "Duration", key: "duration" },
    { label: "Project", key: "project" },
    { label: "user", key: "user" },
    { ID: "ID", key: "_id" },
  ];

  // createdAt: "2022-04-29T06:44:18.392Z"
  // date: "2022-04-27T06:43:56.000Z"
  // desc: "Construction du projet"
  // duration: 120
  // project: {color: {…}, _id: '626a37278dad8a8f3af6fb90', name: 'Appli Mobile Météo', user: '626794e6495c3d16a04b4fde', __v: 0}
  // updatedAt: "2022-04-29T06:44:18.392Z"
  // user: {adress: 'Adresse de Paul', position: 'Responsable Dev', profilePicture: '', _id: '626794e6495c3d16a04b4fde', first_name: 'Paul', …}
  // __v: 0
  // _id: "626b89420896c47fe3d89d60"

  return (
    <div style={{ marginTop: "100px" }}>
      <h2>New Timesheet</h2>
      {/* <pre>{JSON.stringify(body, null, 2)}</pre> */}

      <Box
        component="form"
        onSubmit={handleSubmit}
        onChange={handleChangeInput}
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date"
            name="date"
            value={dateValue}
            onChange={(newValue) => {
              setDateValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <TextField
          id="filled-basic"
          name="desc"
          label="Description"
          variant="filled"
        />
        <TextField
          id="filled-basic"
          name="duration"
          label="Duration (min)"
          variant="filled"
        />
        <FormControl>
          <InputLabel id="projectLabel">Project</InputLabel>
          <Select
            labelId="projectLabel"
            name="project"
            value={projectValue}
            onChange={(newValue) => {
              setProjectValue(newValue.target.value);
            }}
          >
            <MenuItem value={""}>Chose Project</MenuItem>
            {projectList.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="userLabel">User</InputLabel>
          <Select
            labelId="userLabel"
            name="user"
            value={userValue}
            onChange={(newValue) => {
              setUserValue(newValue.target.value);
            }}
          >
            <MenuItem value={""}>Chose User</MenuItem>
            <MenuItem key={currentUser._id} value={currentUser._id}>
              {currentUser.first_name} {currentUser.last_name}
            </MenuItem>
          </Select>
        </FormControl>

        <Button type="sumbit" variant="contained">
          Submit
        </Button>
      </Box>
      <Box>
        <Charts data={data}></Charts>
      </Box>
      <h2>
        Timesheets of {currentUser.first_name} {currentUser.last_name}{" "}
      </h2>

      <CSVLink data={timeList} headers={headers}>
        <Button variant="outlined">Download CSV</Button>
      </CSVLink>

      <Button onClick={handleShowButton} variant="contained">
        Show/Hide
      </Button>
      <Grid
        className="timesheets"
        container
        direction="row"
        spacing={2}
        justifyContent="Center"
      >
        {showTimesheet && (
          <Grid item xs={10}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Project</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Duration</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeList.map((time) => (
                    <TableRow
                      key={time._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {time.desc}
                      </TableCell>
                      <TableCell align="center">{time.project.name}</TableCell>
                      <TableCell align="center">
                        {dayjs(time.date).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell align="center">{time.duration}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          className="deleteButton"
                          onClick={() => {
                            deleteTimesheet(time._id);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
