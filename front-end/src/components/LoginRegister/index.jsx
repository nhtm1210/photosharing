import React, { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { postModel, setToken } from "../../lib/fetchModelData";

function LoginRegister({ onLogin }) {
  const [tab, setTab] = useState(0);

  // login state
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // register state
  const [reg, setReg] = useState({
    login_name: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const updateReg = (field) => (e) =>
    setReg((prev) => ({ ...prev, [field]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const user = await postModel("/admin/login", {
        login_name: loginName,
        password: loginPassword,
      });
      if (user.token) setToken(user.token); // 💾 lưu JWT
      onLogin(user);
    } catch (err) {
      console.log(err);
      setLoginError(err.body || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!reg.login_name) return setRegError("login_name is required");
    if (!reg.first_name) return setRegError("first_name is required");
    if (!reg.last_name) return setRegError("last_name is required");
    if (!reg.password) return setRegError("password is required");
    if (reg.password !== reg.password2)
      return setRegError("Two passwords do not match");

    try {
      await postModel("/api/user", {
        login_name: reg.login_name,
        password: reg.password,
        first_name: reg.first_name,
        last_name: reg.last_name,
        location: reg.location,
        description: reg.description,
        occupation: reg.occupation,
      });
      setRegSuccess(
        `User "${reg.login_name}" registered successfully. Please switch to Login tab.`
      );
      setReg({
        login_name: "",
        password: "",
        password2: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (err) {
      setRegError(err.body || "Registration failed");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper sx={{ p: 4, width: 480 }} elevation={3}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {tab === 0 && (
          <Box component="form" onSubmit={handleLogin}>
            <Typography variant="h6" gutterBottom>
              Login
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Login name"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                fullWidth
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                fullWidth
              />
              {loginError && <Alert severity="error">{loginError}</Alert>}
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Stack>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={handleRegister}>
            <Typography variant="h6" gutterBottom>
              Register
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Login name *"
                value={reg.login_name}
                onChange={updateReg("login_name")}
                fullWidth
              />
              <TextField
                label="First name *"
                value={reg.first_name}
                onChange={updateReg("first_name")}
                fullWidth
              />
              <TextField
                label="Last name *"
                value={reg.last_name}
                onChange={updateReg("last_name")}
                fullWidth
              />
              <TextField
                label="Password *"
                type="password"
                value={reg.password}
                onChange={updateReg("password")}
                fullWidth
              />
              <TextField
                label="Re-enter password *"
                type="password"
                value={reg.password2}
                onChange={updateReg("password2")}
                fullWidth
              />
              <TextField
                label="Location"
                value={reg.location}
                onChange={updateReg("location")}
                fullWidth
              />
              <TextField
                label="Description"
                value={reg.description}
                onChange={updateReg("description")}
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="Occupation"
                value={reg.occupation}
                onChange={updateReg("occupation")}
                fullWidth
              />
              {regError && <Alert severity="error">{regError}</Alert>}
              {regSuccess && <Alert severity="success">{regSuccess}</Alert>}
              <Button type="submit" variant="contained" size="large">
                Register Me
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default LoginRegister;
