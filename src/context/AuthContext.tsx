"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";

interface UserDetails {
  uid: string;
  name: string;
  email: string;
  linkId: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  linkId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    avatarUrl: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

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

  const generateLinkId = () => {
    return Math.random().toString(36).substr(2, 9);
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
    password: string,
    avatarUrl: string
  ) => {
    await setDoc(
      doc(firestore, "users", uid),
      { uid, name, email, linkId, password, avatarUrl },
      { merge: true }
    );
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
      setLinkId(userDetails.linkId);
      setUserDetails(userDetails);
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
    await saveUserDetails(uid, name, email, linkId, password, avatarUrl);
    setLinkId(linkId);
    setUserDetails({ uid, name, email, linkId, avatarUrl });
    setUser(userCredential.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setLinkId(null);
    setUserDetails(null);
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
