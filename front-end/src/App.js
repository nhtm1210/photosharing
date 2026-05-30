import "./App.css";

import React, { useState, useEffect, createContext } from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UserComments from "./components/UserComments";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import fetchModel from "./lib/fetchModelData";

export const UserContext = createContext(null);

const App = () => {
  const [advancedMode, setAdvancedMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  const toggleAdvancedMode = () => setAdvancedMode(!advancedMode);
  // Tín hiệu dùng chung cho mọi component cần re-fetch khi data đổi
  // (upload ảnh, thêm comment, đăng ký user mới, v.v.)
  const bumpData = () => setDataVersion((v) => v + 1);

  // Khôi phục session khi reload trang
  useEffect(() => {
    fetchModel("/admin/current")
      .then((u) => setCurrentUser(u))
      .catch(() => setCurrentUser(null))
      .finally(() => setLoadingSession(false));
  }, []);

  if (loadingSession) return null;

  const isLoggedIn = !!currentUser;

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, bumpData, dataVersion }}
    >
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar
                advancedMode={advancedMode}
                toggleAdvancedMode={toggleAdvancedMode}
              />
            </Grid>
            <div className="main-topbar-buffer" />

            {isLoggedIn ? (
              <>
                <Grid item sm={3}>
                  <Paper className="main-grid-item">
                    <UserList />
                  </Paper>
                </Grid>
                <Grid item sm={9}>
                  <Paper className="main-grid-item">
                    <Routes>
                      <Route path="/users/:userId" element={<UserDetail />} />
                      <Route
                        path="/photos/:userId"
                        element={<UserPhotos advancedMode={advancedMode} />}
                      />
                      <Route path="/users" element={<UserList />} />
                      <Route
                        path="/comments/:userId"
                        element={<UserComments />}
                      />
                      <Route
                        path="*"
                        element={
                          <Navigate to={`/users/${currentUser._id}`} replace />
                        }
                      />
                    </Routes>
                  </Paper>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Routes>
                  <Route
                    path="*"
                    element={<LoginRegister onLogin={setCurrentUser} />}
                  />
                </Routes>
              </Grid>
            )}
          </Grid>
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
