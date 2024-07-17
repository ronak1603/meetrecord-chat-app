"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { validateEmail } from "@/utils/validations";
import Image from "next/image";
import authImage from "@/assets/images/authImage.svg";

interface LoginData {
  email: string;
  password: string;
}

const login = async (email: string, password: string): Promise<string> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const linkId = user.uid + Date.now().toString();
  console.log(linkId, "linkId");
  await setDoc(doc(firestore, "users", user.uid), {
    linkId,
    email,
    password,
  });
  return linkId;
};

const LoginPage = () => {
  const router = useRouter();

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
    <Container
      sx={{
        display: "flex",
        justifyContent: "space-between",
        height: "100vh",
        width: "100vw",
      }}
      style={{ padding: "0px" }}
      maxWidth="xl"
    >
      <Box
        className="flex w-full justify-center items-center bg-blue-400"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          justifyContent: "center",
          alignItems: "center",
          background: "#60a5fa",
          padding: "0px",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          sx={{ fontSize: "32px", fontWeight: 600, textAlign: "center" }}
        >
          Connect Instantly, Chat Seamlessly,
        </Typography>
        <Typography
          variant="h4"
          color="white"
          sx={{ fontSize: "32px", fontWeight: 600, textAlign: "center" }}
        >
          Anytime, Anywhere.
        </Typography>
        <Image src={authImage} alt="authImage" />
      </Box>
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

          <Box
            sx={{ display: "flex", flexDirection: "column", height: "80px" }}
          >
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
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "80px" }}
          >
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
    </Container>
  );
};

export default LoginPage;
