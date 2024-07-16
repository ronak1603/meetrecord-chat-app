"use client";
import { MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import { TextField, Button, Container } from "@mui/material";
import Link from "next/link";
import { AvatarGenerator } from "random-avatar-generator";
import Image from "next/image";
import { useForm } from "@mantine/form";
import { validateEmail } from "@/utils/validations";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const signup = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const linkId = user.uid + Date.now().toString();
  await setDoc(doc(firestore, "users", user.uid), {
    linkId,
    name,
    email,
    password,
  });
  return linkId;
};

const SignupPage = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();

  const generateRandomAvatar = () => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  };

  const handleRefreshAvatar = () => {
    setAvatarUrl(generateRandomAvatar());
  };

  useEffect(() => {
    setAvatarUrl(generateRandomAvatar());
  }, []);

  const registerForm = useForm<RegisterData>({
    validateInputOnBlur: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      name: (value) => (value.length == 0 ? "Name is required" : null),
      email: (value) => {
        return validateEmail(value);
      },
      password: (value) => (value.length < 6 ? "Password is too short" : null),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterData) => {
      return signup(data.email, data.password, data.name);
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
    <Container maxWidth="sm">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-2xl shadow-lg p-10"
      >
        <h1 className="font-secondary text-xl text-center font-semibold text-[#0b3a65ff]">
          Chat<span className="font-bold text-[#eeab63ff]">Hub</span>
        </h1>

        <div className="flex items-center space-y-2 justify-between border border-gray-200 p-2">
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full"
            width={50}
            height={50}
          />
          <Button
            type="button"
            className="bg-[#0b3a65ff] text-white"
            onClick={handleRefreshAvatar}
          >
            New Avatar
          </Button>
        </div>

        <div>
          <TextField
            {...registerForm.getInputProps("name")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Name"
          />
          {registerForm.errors.name && (
            <span className="text-red-500">{registerForm.errors.name}</span>
          )}
        </div>

        <div>
          <TextField
            {...registerForm.getInputProps("email")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
          />
          {registerForm.errors.email && (
            <span className="text-red-500">{registerForm.errors.email}</span>
          )}
        </div>

        <div>
          <TextField
            {...registerForm.getInputProps("password")}
            fullWidth
            margin="normal"
            variant="outlined"
            label="Password"
            type="password"
          />
          {registerForm.errors.password && (
            <span className="text-red-500">{registerForm.errors.password}</span>
          )}
        </div>

        <div>
          <Button
            type="submit"
            onClick={() => handleSubmit()}
            className="bg-[#0b3a65ff] text-white"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>

        <span>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Login
          </Link>
        </span>
      </form>
    </Container>
  );
};

export default SignupPage;
