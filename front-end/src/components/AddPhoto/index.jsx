import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { postFormData } from "../../lib/fetchModelData";

function AddPhotoDialog({ open, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const reset = () => {
    setFile(null);
    setError("");
    setUploading(false);
  };

  const handleClose = () => {
    if (uploading) return;
    reset();
    onClose && onClose();
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please choose a file");
      return;
    }
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("uploadedphoto", file);
    try {
      await postFormData("/api/photo/new", fd);
      reset();
      onUploaded && onUploaded();
    } catch (err) {
      setError(err.body || "Upload failed");
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add a new photo</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </Typography>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPhotoDialog;
