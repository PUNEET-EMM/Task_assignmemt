import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTask,
  editTask,
  toggleCompleted,
  deleteTask,
  reorderTasks,
} from '../features/tasks/tasksSlice';
import TaskFormModal from './TaskFormModal';
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  Modal,
  TextField,
} from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskDashboard = () => {
  const tasks = useSelector((state) => state.tasks.tasks || []);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null); // For delete confirmation

  // Filter tasks by search and filter criteria
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    switch (filter) {
      case 'completed':
        return task.completed && matchesSearch;
      case 'pending':
        return !task.completed && matchesSearch;
      case 'overdue':
        return new Date(task.dueDate) < new Date() && !task.completed && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setModalOpen(false);
  };

  const handleAddEditTask = (task) => {
    if (editingTask) {
      dispatch(editTask(task));
    } else {
      dispatch(addTask(task));
    }
    setModalOpen(false);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskView = () => {
    setSelectedTask(null);
  };

  const handleConfirmDelete = (taskId) => {
    setDeleteTaskId(taskId);
  };

  const handleCancelDelete = () => {
    setDeleteTaskId(null);
  };

  const handleDeleteTask = () => {
    if (deleteTaskId) {
      dispatch(deleteTask(deleteTaskId));
      setDeleteTaskId(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return; // Task was dropped outside the list

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      dispatch(reorderTasks({ sourceIndex, destinationIndex }));
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#121212',
        color: '#ffffff',
        borderRadius: 2,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          Task Dashboard
        </Typography>
        <Tooltip title="Add a new task">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
            sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}
          >
            Add Task
          </Button>
        </Tooltip>
      </Box>

      {/* Search Section */}
      <TextField
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{
          backgroundColor: '#1e1e1e',
          borderRadius: 2,
          marginBottom: 2,
          input: { color: '#ffffff' },
        }}
      />

      {/* Filter Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 2,
        }}
      >
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{
            minWidth: 150,
            backgroundColor: '#333',
            color: '#ffffff',
          }}
        >
          <MenuItem value="all">All Tasks</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
        </Select>
      </Box>

      <Divider sx={{ marginBottom: 2, backgroundColor: '#444' }} />

      {/* Task List Section */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 2,
                          backgroundColor: '#1e1e1e',
                          borderRadius: 2,
                          marginBottom: 1.5,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleViewTask(task)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <Checkbox
                            checked={task.completed}
                            onChange={() => dispatch(toggleCompleted(task.id))}
                            sx={{ color: '#ffffff' }}
                          />
                          <ListItemText
                            primary={task.title}
                            secondary={task.dueDate || 'No due date'}
                            sx={{
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: '#ffffff',
                              '& .MuiListItemText-secondary': {
                                color: '#bbbbbb',
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title="Edit Task">
                            <IconButton
                              sx={{ color: '#1976d2' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(task);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Task">
                            <IconButton
                              sx={{ color: '#d32f2f' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmDelete(task.id);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                    )}
                  </Draggable>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{ textAlign: 'center', marginTop: 2, color: '#888' }}
                >
                  No tasks found matching the criteria.
                </Typography>
              )}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      {/* Task Details Modal */}
      <Modal
        open={!!selectedTask}
        onClose={handleCloseTaskView}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '400px',
            backgroundColor: '#1e1e1e',
            color: '#ffffff',
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Task Details
            </Typography>
            <IconButton onClick={handleCloseTaskView} sx={{ color: '#ffffff' }}>
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ marginY: 2, backgroundColor: '#444' }} />
          {selectedTask && (
            <Box>
              <Typography variant="subtitle1">
                <strong>Title:</strong> {selectedTask.title}
              </Typography>
              <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                <strong>Description:</strong> {selectedTask.description || 'No description'}
              </Typography>
              <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                <strong>Due Date:</strong> {selectedTask.dueDate || 'No due date'}
              </Typography>
              <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                <strong>Status:</strong> {selectedTask.completed ? 'Completed' : 'Pending'}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Task Add/Edit Modal */}
      <TaskFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddEditTask}
        task={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTaskId}
        onClose={handleCancelDelete}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '300px',
            backgroundColor: '#1e1e1e',
            color: '#ffffff',
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Confirm Deletion
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1, marginBottom: 3 }}>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleCancelDelete}
              sx={{ color: '#ffffff', backgroundColor: '#333', marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTask}
              sx={{ color: '#ffffff', backgroundColor: '#d32f2f' }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskDashboard;



