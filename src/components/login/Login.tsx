import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import "./Login.css";
import icon from "../../assets/icon.png";
export interface LoginFormProps {
  onSubmit: (name: string, email: string) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.length > 0 && email.length > 0) {
      setFormFade("fade-out");
      setTimeout(() => {
        onSubmit(name, email);
      }, 1500);
    }
  };

  const [titleFade, setTitleFade] = useState<string>();
  const [formFade, setFormFade] = useState<string>();

  useEffect(() => {
    setTitleFade("fade-in");
    const titleTimer = setTimeout(() => {
      setTitleFade("fade-out");
    }, 2000);

    // After the original timeout and length of transition
    const formTimer = setTimeout(() => {
      setFormFade("fade-in");
    }, 2500);

    return () => {
      setFormFade("fade-out");
      setTitleFade("fade-out");
      clearTimeout(titleTimer);
      clearTimeout(formTimer);
    };
  }, []);

  return (
    <Box>
      <div className={`welcome-screen ${titleFade}`}>
        <Typography variant="h3">Hello there.</Typography>
      </div>
      <div className={`welcome-screen ${formFade}`}>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            top: 0,
            left: 0,
            margin: 4,
          }}
        >
          <img
            alt={"icon"}
            src={icon}
            style={{ marginRight: 16, width: "48px", height: "48px" }}
          />

          <Typography variant="h6">GoFetch!</Typography>
        </div>
        <form name="login-form" onSubmit={handleSubmit}>
          <TextField
            id="login-username-id"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            id="login-email-id"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" type="submit" fullWidth>
            Log In
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default LoginForm;
