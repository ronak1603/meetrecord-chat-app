"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import { TextField, Button, Container } from "@mui/material";

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
  await setDoc(doc(firestore, "link-ids", user.uid), { linkId });
  return linkId;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginData) => {
      return login(data.email, data.password);
    },
    onSuccess: (linkId) => {
      router.push(`/chats/${linkId}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Container className="flex flex-col w-full h-screen justify-center max-w-fit bg-red-300 p-6 rounded">
      <h1>Login</h1>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={() => mutate({ email, password })}>Login</Button>
    </Container>
  );
};

export default LoginPage;
