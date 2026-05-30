import React, { useState, useEffect, useContext } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { UserContext } from "../../App";

function UserList() {
  const [users, setUsers] = useState([]);
  const { dataVersion } = useContext(UserContext);

  useEffect(() => {
    fetchModel("/api/user/list").then(setUsers).catch(console.error);
  }, [dataVersion]);

  return (
    <List component="nav">
      <Typography variant="h6" sx={{ p: 2 }}>
        Users
      </Typography>
      {users.map((u) => (
        <React.Fragment key={u._id}>
          <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link
              to={`/users/${u._id}`}
              style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
            >
              <ListItemText primary={`${u.first_name} ${u.last_name}`} />
            </Link>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={u.photoCount}
                size="small"
                sx={{ bgcolor: "green", color: "white" }}
              />
              <Link
                to={`/comments/${u._id}`}
                style={{ textDecoration: "none" }}
              >
                <Chip
                  label={u.commentCount}
                  size="small"
                  sx={{ bgcolor: "red", color: "white", cursor: "pointer" }}
                  clickable
                />
              </Link>
            </Box>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}
export default UserList;
