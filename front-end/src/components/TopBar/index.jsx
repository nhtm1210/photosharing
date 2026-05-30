import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel, { postModel, clearToken } from "../../lib/fetchModelData";
import { UserContext } from "../../App";
import AddPhotoDialog from "../AddPhoto";
import "./styles.css";

function TopBar(props) {
  const location = useLocation();
  const { currentUser, setCurrentUser, bumpData } = useContext(UserContext);
  const [contextText, setContextText] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setContextText("");
      return;
    }
    const parts = location.pathname.split("/");
    if (parts.length === 3 && (parts[1] === "users" || parts[1] === "photos")) {
      const userId = parts[2];
      fetchModel(`/api/user/${userId}`)
        .then((user) => {
          if (parts[1] === "users") {
            setContextText(`${user.first_name} ${user.last_name}`);
          } else {
            setContextText(`Photos of ${user.first_name} ${user.last_name}`);
          }
        })
        .catch(() => setContextText(""));
    } else {
      setContextText("");
    }
  }, [location.pathname, currentUser]);

  const handleLogout = async () => {
    try {
      await postModel("/admin/logout", {});
    } catch (e) {
      // ignore
    }
    clearToken(); // 🗑️ xoá JWT khỏi localStorage
    setCurrentUser(null);
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          Nguyễn Hữu Tuấn Minh - B23DCVT279
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {currentUser ? (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.advancedMode}
                    onChange={props.toggleAdvancedMode}
                    style={{ color: "white" }}
                  />
                }
                label={
                  <Typography variant="body2">Advanced Features</Typography>
                }
              />
              <Typography variant="h6">{contextText}</Typography>
              <Typography variant="body1">
                Hi {currentUser.first_name || currentUser.login_name}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpenAdd(true)}
              >
                Add Photo
              </Button>
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="h6">Please Login</Typography>
          )}
        </Box>
      </Toolbar>

      <AddPhotoDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onUploaded={() => {
          setOpenAdd(false);
          // Bump signal -> UserList refresh số xanh, UserPhotos refresh ảnh
          bumpData();
        }}
      />
    </AppBar>
  );
}

export default TopBar;
