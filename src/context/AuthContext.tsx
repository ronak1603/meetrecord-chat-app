"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { deleteCookie, setCookie } from "cookies-next";
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { auth, firestore } from "@/services/firebase";
import useChatMessages from "@/services/useChatMessages";
import { AuthContextType, UserDetails } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const { deleteRoom } = useChatMessages(linkId as string);

  const generateLinkId = () => {
    return Math.random().toString(36).slice(2, 11);
  };

  const fetchUserDetails = async (uid: string) => {
    const userDoc = await getDoc(doc(firestore, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserDetails;
    }
    return null;
  };

  const saveUserDetails = async (
    uid: string,
    name: string,
    email: string,
    linkId: string,
    avatarUrl: string
  ) => {
    await setDoc(
      doc(firestore, "users", uid),
      { uid, name, email, linkId, avatarUrl },
      { merge: true }
    );
  };

  const updateLinkId = async (uid: string, newLinkId: string) => {
    await updateDoc(doc(firestore, "users", uid), { linkId: newLinkId });
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    const userDetails = await fetchUserDetails(uid);
    if (userDetails) {
      const token = await userCredential.user.getIdToken();
      setCookie("token", token, { path: "/", maxAge: 60 * 60 * 24 });
      const newLinkId = generateLinkId();
      await updateLinkId(uid, newLinkId);
      setLinkId(newLinkId);
      setUserDetails({ ...userDetails, linkId: newLinkId });
    }
    setUser(userCredential.user);
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    avatarUrl: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    const linkId = generateLinkId();
    await saveUserDetails(uid, name, email, linkId, avatarUrl);
    setLinkId(linkId);
    setUserDetails({ uid, name, email, linkId, avatarUrl });
    setUser(userCredential.user);
    const token = await userCredential.user.getIdToken();
    setCookie("token", token, { path: "/", maxAge: 60 * 60 * 24 });
  };

  const logout = async () => {
    try {
      if (linkId) {
        deleteRoom(linkId);
        await updateLinkId(user!.uid, "");
        await signOut(auth);
        setLinkId(null);
        setUser(null);
        setUserDetails(null);
        deleteCookie("token", { path: "/" });
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDetails = await fetchUserDetails(currentUser.uid);
        if (userDetails) {
          setLinkId(userDetails.linkId);
          setUserDetails(userDetails);
        }
      } else {
        setUser(null);
        setLinkId(null);
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userDetails, linkId, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
