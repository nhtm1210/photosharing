import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Divider,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel, { BASE_URL } from "../../lib/fetchModelData";

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Gọi API lấy toàn bộ bình luận của user này
    fetchModel(`/api/comment/commentsOfUser/${userId}`)
      .then((data) => setComments(data))
      .catch((error) =>
        console.error("Lỗi khi kéo danh sách bình luận:", error)
      );
  }, [userId]);

  return (
    <Paper style={{ padding: "24px", marginTop: "16px" }} elevation={3}>
      <Typography variant="h5" gutterBottom>
        Bình luận của người dùng
      </Typography>

      {comments.length === 0 ? (
        <Typography>Người dùng này chưa có bình luận nào.</Typography>
      ) : (
        <List>
          {comments.map((comment) => (
            <React.Fragment key={comment._id}>
              {/* Bấm vào ListItem này sẽ dẫn thẳng đến trang chứa bức ảnh */}
              <ListItem
                button
                component={Link}
                to={`/photos/${userId}`}
                alignItems="flex-start"
              >
                {/* Thumbnail ảnh */}
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={`${BASE_URL}/images/${comment.file_name}`}
                    style={{ width: 60, height: 60, marginRight: 16 }}
                  />
                </ListItemAvatar>

                {/* Nội dung bình luận */}
                <ListItemText
                  primary={comment.comment}
                  secondary={new Date(comment.date_time).toLocaleString()}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default UserComments;
