"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

import { useForm } from "@mantine/form";
import { AvatarGenerator } from "random-avatar-generator";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

import { validateEmail } from "@/utils/validations";
import { useAuth } from "@/context/AuthContext";
import chatlogo from "@/assets/images/chatlogo.svg";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}

const Signup = () => {
  const [avatarUrl, setAvatarUrl] = useState("");

  const router = useRouter();
  const { register } = useAuth();

  const generateRandomAvatar = () => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  };

  const handleRefreshAvatar = () => {
    const newAvatarUrl = generateRandomAvatar();
    setAvatarUrl(newAvatarUrl);
    registerForm.setFieldValue("avatarUrl", newAvatarUrl);
  };

  useEffect(() => {
    handleRefreshAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerForm = useForm<RegisterData>({
    validateInputOnBlur: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      avatarUrl,
    },
    validate: {
      name: (value) => (value.length == 0 ? "Name is required" : null),
      email: (value) => validateEmail(value),
      password: (value) => (value.length < 6 ? "Password is too short" : null),
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: RegisterData) => {
      return register(data.email, data.password, data.name, data.avatarUrl);
    },
    onSuccess: () => {
      router.push(`/dashboard`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    mutate(registerForm.values);
  };

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

        <div className="flex items-center space-y-2 justify-between border rounded border-gray-200 p-2">
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full"
            width={50}
            height={50}
          />
          <Button
            type="button"
            sx={{
              background: "#eeab63ff",
              color: "white",
              textTransform: "none",
              "&:hover": {
                background: "#eeab63ff",
              },
            }}
            onClick={handleRefreshAvatar}
          >
            Shuffle Avatar
          </Button>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", height: "75px" }}>
          <TextField
            {...registerForm.getInputProps("name")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Name"
            sx={{
              width: "384px",
              "& .MuiInputBase-root": {
                height: "48px",
              },
            }}
          />
          <Box>
            {registerForm.errors.name && (
              <Typography className="text-red-500">
                {registerForm.errors.name}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", height: "75px" }}>
          <TextField
            {...registerForm.getInputProps("email")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
            sx={{
              width: "384px",
              "& .MuiInputBase-root": {
                height: "48px",
              },
            }}
          />
          <Box>
            {registerForm.errors.email && (
              <Typography className="text-red-500">
                {registerForm.errors.email}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", height: "75px" }}>
          <TextField
            {...registerForm.getInputProps("password")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type="password"
            sx={{
              width: "384px",
              "& .MuiInputBase-root": {
                height: "48px",
              },
            }}
          />
          <Box>
            {registerForm.errors.password && (
              <Typography className="text-red-500">
                {registerForm.errors.password}
              </Typography>
            )}
          </Box>
        </Box>

        <Box style={{ marginTop: "24px" }}>
          <Button
            type="submit"
            sx={{
              background: isLoading ? "#9ca3af" : "#1E3A8A",
              color: "white",
              width: "384px",
              textTransform: "none",
              height: "48px",
              cursor: isLoading ? "not-allowed" : "pointer",
              "&:hover": {
                background: "#1E3A8A",
              },
            }}
            onClick={() => handleSubmit()}
            endIcon={
              isLoading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : null
            }
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          Already have an account?&nbsp;
          <Link href="/login" className="text-[#1E3A8A] underline">
            Login
          </Link>
        </Box>
      </form>
    </Box>
  );
};

export default Signup;
