"use client";
import { useNavigateReplace } from "@/hooks/useNavigate";
import { toastError } from "@/utils/toast";
import { Container } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

export const dynamic = "force-static";

type Inputs = {
  email: string;
  password: string;
};

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="">
        Credot Demo
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Login() {
  //IMPORTS
  const session = useSession();
  const searchParams = useSearchParams();
  const navigate = useNavigateReplace();

  //STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session.status == "authenticated") {
      const redirect_url = searchParams.get("redirect_url");
      if (redirect_url) {
        if (redirect_url.includes("https")) {
          setTimeout(() => {
            if (window) {
              window.location.href = redirect_url;
            }
          }, 300);
        } else {
          navigate(redirect_url);
        }
      } else {
        navigate("/");
      }
    }
  }, [session.status, navigate, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async () => {
    try {
      const obj = {
        email,
        password,
      };
      const res = await signIn("credentials", { ...obj, redirect: false });
      console.log(res);
      if (res?.error) {
        toastError(res.error);
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log-In
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={(e: any) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e: any) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Log-In
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 2 }} />
    </Container>
  );
}
