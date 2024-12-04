import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const Calendar = () => {
  const tasks = useSelector((state) => state.tasks.tasks || []);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Filter tasks for the selected date
  const filteredTasks = tasks.filter(
    (task) => dayjs(task.date).format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "flex-start",
          padding: 3,
          backgroundColor: "#121212", // Dark background
          color: "#ffffff", // Light text color
          minHeight: "100vh",
        }}
      >
        {/* Calendar Section */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#1e1e1e", // Calendar container background
            padding: 2,
            borderRadius: 2,
            flex: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              marginBottom: 2,
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Task Calendar
          </Typography>
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#333",
                    color: "#fff",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#ccc",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                }}
              />
            )}
            sx={{
              "& .MuiPickersDay-root": {
                color: "#cfcfcf",
                backgroundColor: "transparent",
              },
              "& .Mui-selected": {
                backgroundColor: "#1976d2 !important", // Selected date
                color: "#fff !important",
              },
              "& .MuiPickersModal-dialogRoot": {
                backgroundColor: "#1e1e1e", // Modal dark background
                color: "#fff", // Modal text color
              },
              "& .MuiCalendarPicker-root": {
                backgroundColor: "#1e1e1e", // Calendar background
              },
              "& .MuiPickersCalendarHeader-root": {
                backgroundColor: "#1e1e1e", // Header background
                color: "#ffffff",
              },
            }}
          />
        </Paper>

        {/* Task List Section */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#1e1e1e",
            padding: 2,
            borderRadius: 2,
            flex: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: 2, color: "#fff" }}
          >
            Tasks for {selectedDate.format("MMMM DD, YYYY")}
          </Typography>
          {filteredTasks.length > 0 ? (
            <List>
              {filteredTasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{
                    backgroundColor: "#2e2e2e",
                    marginBottom: 1,
                    borderRadius: 1,
                  }}
                >
                  <ListItemText
                    primary={task.title}
                    secondary={task.description || "No description"}
                    sx={{
                      color: "#fff",
                      "& .MuiListItemText-primary": {
                        fontWeight: "bold",
                      },
                      "& .MuiListItemText-secondary": {
                        color: "#ccc",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              sx={{ color: "#888", textAlign: "center" }}
            >
              No tasks for this date.
            </Typography>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Calendar;



