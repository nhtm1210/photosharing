import React, { useState, useEffect } from "react";
import { Typography, Button, Paper } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [commentCount, setCommentCount] = useState(0); // State mới để lưu số đếm

  useEffect(() => {
    fetchModel(`/api/user/${userId}`)
      .then((data) => setUser(data))
      .catch((err) => console.error(err));

    fetchModel(`/api/comment/commentsOfUser/${userId}`)
      .then((data) => setCommentCount(data.length))
      .catch((err) => console.error(err));
  }, [userId]);

  if (!user) return <Typography>Loading user details...</Typography>;

  return (
    <Paper style={{ padding: "24px" }} elevation={2}>
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong> {user.location}
      </Typography>

      <Typography
        variant="body1"
        style={{ marginTop: "16px", marginBottom: "16px" }}
      >
        <strong>Hoạt động:</strong> Đã viết{" "}
        <Link
          to={`/comments/${userId}`}
          style={{ fontWeight: "bold", color: "#1976d2" }}
        >
          {commentCount} bình luận
        </Link>
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/photos/${userId}`}
      >
        View Photos
      </Button>
    </Paper>
  );
}

export default UserDetail;
