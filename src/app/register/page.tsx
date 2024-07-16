"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import { TextField, Button, Container } from "@mui/material";
import Link from "next/link";
import { AvatarGenerator } from "random-avatar-generator";
import Image from "next/image";

interface RegisterData {
  email: string;
  password: string;
}

const signup = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const linkId = user.uid + Date.now().toString();
  await setDoc(doc(firestore, "users", user.uid), { linkId, email, password });
  return linkId;
};

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ name, email, password });
  const [loading, setLoading] = useState(false);
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

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = { name, email, password };
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterData) => {
      return signup(data.email, data.password);
    },
    onSuccess: (linkId) => {
      router.push(`/chats/${linkId}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  console.log(avatarUrl, "avatarUrl");

  return (
    // <Container>
    //   <h1>Signup</h1>
    //   <TextField
    //     label="Email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //   />
    //   <TextField
    //     label="Password"
    //     type="password"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //   />
    //   <Button onClick={() => mutate({ email, password })}>Signup</Button>
    // </Container>

    <Container className="flex justify-center items-center h-screen font-primary p-10 m-2">
      {/*form*/}
      <form
        onSubmit={() => mutate({ email, password })}
        className="space-y-4 w-full max-w-2xl shadow-lg p-10"
      >
        <h1 className="font-secondary text-xl text-center font-semibold text-[#0b3a65ff]">
          CHAT<span className="font-bold text-[#eeab63ff]">2</span>CHAT
        </h1>

        {/* Display the avatar and refresh button */}
        <div className="flex items-center space-y-2 justify-between border border-gray-200 p-2">
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full"
            width={50}
            height={50}
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleRefreshAvatar}
          >
            New Avatar
          </button>
        </div>

        {/*name*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="w-full input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>

        {/*email*/}
        <div>
          <label className="label">
            <span className="text-base label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email"
            className="w-full input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        {/*password*/}
        <div>
          <TextField
            type="password"
            placeholder="Enter Password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        {/*confirm password*/}

        <div>
          <button
            type="submit"
            className="btn btn-block bg-[#0b3a65ff] text-white"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign Up"
            )}
          </button>
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
