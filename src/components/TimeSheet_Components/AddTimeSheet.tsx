import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  SelectChangeEvent,
} from "@mui/material";

import { AuthContext, AuthContextType } from "../../AuthProvider";
import services from "../../services";
import { useSnackbar } from "notistack";
import { BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { GridContextType, GridDataContext } from "../../GridDataProvider";

export default function AddTimeSheet() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [projectValue, setProjectValue] = useState("");
  const { currentProjects, getCurrentTimesheets } = useContext(
    GridDataContext
  ) as GridContextType;
  const { currentUser } = useContext(AuthContext) as AuthContextType;
  const [form, setForm] = useState({
    desc: "",
    duration: "",
    date: "",
    project: "",
    user: "",
  });

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    setProjectValue(event.target.value);
    handleFormChange(event as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    services
      .createNewTimesheet({ ...form, user: currentUser._id })
      .then(() => {
        getCurrentTimesheets();
        enqueueSnackbar("TimeSheet Successfully Created", {
          variant: "success",
        });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Incorrect Entry", { variant: "error" });
      });
  };

  const updateForm = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateForm(name, value);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    getCurrentTimesheets();
  }, []);

  return (
    <div>
      <Button
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
          margin: "auto",
        }}
        variant="contained"
        onClick={handleClickOpen}
      >
        <BsFillFileEarmarkPlusFill size={30} />
        <span>Create TimeSheet</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        onChange={handleFormChange}
        sx={{
          "& .MuiTextField-root": { m: 1, width: 250 },
        }}
      >
        <DialogContent>
          {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
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
          <TextField
            type="date"
            id="filled-basic"
            name="date"
            label="Date"
            variant="filled"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl sx={{ m: 1, width: "100%", maxWidth: 250 }}>
            <InputLabel id="select-project-label">Project</InputLabel>
            <Select
              labelId="select-project-label"
              id="select-project"
              value={projectValue}
              label="Project"
              onChange={handleProjectChange}
              name="project"
            >
              {currentProjects &&
                currentProjects.map((value: any) => {
                  return (
                    <MenuItem key={value._id} value={value._id}>
                      {value.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="outlined">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
