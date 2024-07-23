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
import Image from "next/image";
import chatlogo from "@/assets/images/chatlogo.svg";

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

  const isButtonDisabled = isLoading || !loginForm.isValid();

  return (
    <Box className="flex w-full justify-center items-center">
      <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-10">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Image src={chatlogo} alt="logo" width={50} height={50} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: "36px",
            fontWeight: 600,
            // fontFamily: "initial",
            textAlign: "center",
            color: "#1E3A8A",
          }}
        >
          CHATHUB
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", height: "75px" }}>
          <TextField
            {...loginForm.getInputProps("email")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
            sx={{
              width: "384px",
            }}
          />
          <Box>
            {loginForm.errors.email && (
              <Typography
                className="text-red-500"
                sx={{ fontSize: "12px", lineHeight: "20px", padding: "0px" }}
              >
                {loginForm.errors.email}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", height: "75px" }}>
          <TextField
            {...loginForm.getInputProps("password")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type="password"
            sx={{
              width: "384px",
            }}
          />
          <Box>
            {loginForm.errors.password && (
              <Typography
                className="text-red-500"
                sx={{ fontSize: "12px", lineHeight: "20px", padding: "0px" }}
              >
                {loginForm.errors.password}
              </Typography>
            )}
          </Box>
        </Box>
        <Box style={{ marginTop: "30px" }}>
          <Button
            type="submit"
            sx={{
              background: isButtonDisabled ? "#9ca3af" : "#1E3A8A",
              color: "white",
              width: "384px",
              textTransform: "none",
              height: "48px",
              cursor: isButtonDisabled ? "not-allowed" : "pointer",
              "&:hover": {
                background: "#1E3A8A",
              },
            }}
            endIcon={
              isLoading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : null
            }
            disabled={isButtonDisabled}
          >
            {isLoading ? "Login..." : "Login"}
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          Don&apos;t have an account?&nbsp;
          <Link href="/register" className="text-[#1E3A8A] underline">
            Register
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Signin;
