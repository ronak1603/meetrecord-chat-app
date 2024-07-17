"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import Link from "next/link";

import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import { validateEmail } from "@/utils/validations";

interface LoginData {
  email: string;
  password: string;
}

const Signin = () => {
  const router = useRouter();
  const { login } = useAuth();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: LoginData) => {
      return login(data.email, data.password);
    },
    onSuccess: () => {
      router.push(`/dashboard`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const loginForm = useForm<LoginData>({
    validateInputOnBlur: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        return validateEmail(value);
      },
      password: (value) => (value.length < 6 ? "Password is too short" : null),
    },
  });

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    mutate(loginForm.values);
  };
  return (
    <Box className="flex w-full justify-center items-center">
      <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-10">
        <Typography
          variant="h4"
          color="white"
          sx={{
            fontSize: "32px",
            fontWeight: 600,
            textAlign: "center",
            color: "#60a5fa",
          }}
        >
          Chat<span className="font-bold text-[#eeab63ff]">Hub</span>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", height: "80px" }}>
          <TextField
            {...loginForm.getInputProps("email")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
            className="w-96 h-12"
          />
          <Box>
            {loginForm.errors.email && (
              <Typography className="text-red-500">
                {loginForm.errors.email}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", height: "80px" }}>
          <TextField
            {...loginForm.getInputProps("password")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type="password"
            className="w-96 h-12"
          />
          <Box>
            {loginForm.errors.password && (
              <Typography className="text-red-500">
                {loginForm.errors.password}
              </Typography>
            )}
          </Box>
        </Box>
        <Box style={{ marginTop: "24px" }}>
          <Button
            type="submit"
            sx={{
              background: isLoading ? "#9ca3af" : "#60a5fa",
              color: "white",
              width: "384px",
              textTransform: "none",
              height: "48px",
              cursor: isLoading ? "not-allowed" : "pointer",
              "&:hover": {
                background: "#60a5fa",
              },
            }}
            onClick={() => handleSubmit()}
            endIcon={isLoading ? <CircularProgress size={20} /> : null}
            disabled={isLoading}
          >
            {isLoading ? "Login..." : "Login"}
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          Don&apos;t have an account?&nbsp;
          <Link href="/register" className="text-[#60a5fa] underline">
            Register
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Signin;
