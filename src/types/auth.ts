import { User } from "firebase/auth";

export interface UserDetails {
  uid: string;
  name: string;
  email: string;
  linkId: string;
  avatarUrl: string;
}

export interface AuthContextType {
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
