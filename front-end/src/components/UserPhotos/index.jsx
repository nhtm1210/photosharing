import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Box,
  TextField,
  Stack,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel, { postModel, BASE_URL } from "../../lib/fetchModelData";
import { UserContext } from "../../App";
import "./styles.css";

function UserPhotos(props) {
  const { userId } = useParams();
  const { dataVersion } = useContext(UserContext);
  const [photos, setPhotos] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const refetch = () => {
    fetchModel(`/api/photo/photosOfUser/${userId}`)
      .then((data) => {
        setPhotos(data);
      })
      .catch((error) => console.error("Error fetching photos:", error));
  };

  useEffect(() => {
    refetch();
    setStepIndex(0);
  }, [userId, dataVersion]);

  if (!photos) return <Typography variant="h6">Loading photos...</Typography>;
  if (photos.length === 0)
    return <Typography variant="h6">No photos available.</Typography>;

  const onCommentAdded = () => refetch();

  if (props.advancedMode) {
    const photo = photos[stepIndex];
    return (
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Button
            variant="contained"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex(stepIndex - 1)}
          >
            Previous
          </Button>
          <Typography variant="h6">
            Photo {stepIndex + 1} of {photos.length}
          </Typography>
          <Button
            variant="contained"
            disabled={stepIndex === photos.length - 1}
            onClick={() => setStepIndex(stepIndex + 1)}
          >
            Next
          </Button>
        </Box>
        <PhotoCard photo={photo} onCommentAdded={onCommentAdded} />
      </Box>
    );
  }

  return (
    <div>
      {photos.map((photo) => (
        <PhotoCard
          key={photo._id}
          photo={photo}
          onCommentAdded={onCommentAdded}
        />
      ))}
    </div>
  );
}

function PhotoCard({ photo, onCommentAdded }) {
  return (
    <Card style={{ marginBottom: "32px" }} elevation={3}>
      <CardMedia
        component="img"
        image={`${BASE_URL}/images/${photo.file_name}`}
        style={{
          maxHeight: "500px",
          objectFit: "contain",
          backgroundColor: "#f5f5f5",
        }}
      />
      <CardContent>
        <Typography variant="caption" color="textSecondary" display="block">
          Posted on: {new Date(photo.date_time).toLocaleString()}
        </Typography>
        {renderComments(photo)}
        <AddCommentForm photoId={photo._id} onAdded={onCommentAdded} />
      </CardContent>
    </Card>
  );
}

function AddCommentForm({ photoId, onAdded }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { bumpData } = useContext(UserContext);

  const submit = async () => {
    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await postModel(`/api/comment/commentsOfPhoto/${photoId}`, {
        comment: text.trim(),
      });
      setText("");
      // Bump tín hiệu để UserList re-fetch counts (số đỏ)
      bumpData();
      onAdded && onAdded();
    } catch (err) {
      setError(err.body || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box mt={2}>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          size="small"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          maxRows={4}
          fullWidth
          error={!!error}
          helperText={error}
        />
        <Button
          variant="contained"
          onClick={submit}
          disabled={submitting || !text.trim()}
        >
          Post
        </Button>
      </Stack>
    </Box>
  );
}

function renderComments(photo) {
  if (!photo.comments || photo.comments.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        No comments yet.
      </Typography>
    );
  }
  return (
    <List>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Comments
      </Typography>
      {photo.comments.map((comment) => (
        <React.Fragment key={comment._id}>
          <ListItem alignItems="flex-start" sx={{ pl: 0 }}>
            <ListItemText
              primary={
                comment.user ? (
                  <Link
                    to={`/users/${comment.user._id}`}
                    style={{ textDecoration: "none", fontWeight: "bold" }}
                  >
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                ) : (
                  <Typography component="span" fontWeight="bold">
                    Unknown user
                  </Typography>
                )
              }
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="caption"
                    color="textSecondary"
                    display="block"
                  >
                    {new Date(comment.date_time).toLocaleString()}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {comment.comment}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

export default UserPhotos;
