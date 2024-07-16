"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import { TextField, Button, Container } from "@mui/material";
import Link from "next/link";
import { useForm } from "@mantine/form";
import { validateEmail } from "@/utils/validations";

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

  const { mutate, isPending } = useMutation({
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
    <Container maxWidth="sm">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-2xl shadow-lg p-10"
      >
        <h1 className="font-secondary text-xl text-center font-semibold text-[#0b3a65ff]">
          Chat<span className="font-bold text-[#eeab63ff]">Hub</span>
        </h1>

        <div>
          <TextField
            {...loginForm.getInputProps("email")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
          />
          {loginForm.errors.email && (
            <span className="text-red-500">{loginForm.errors.email}</span>
          )}
        </div>

        <div>
          <TextField
            {...loginForm.getInputProps("password")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type="password"
          />
          {loginForm.errors.password && (
            <span className="text-red-500">{loginForm.errors.password}</span>
          )}
        </div>

        <div>
          <Button
            type="submit"
            onClick={() => handleSubmit}
            className="bg-[#0b3a65ff] text-white"
          >
            Login
          </Button>
        </div>

        <span>
          Not have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            sign up
          </Link>
        </span>
      </form>
    </Container>
  );
};

export default LoginPage;
