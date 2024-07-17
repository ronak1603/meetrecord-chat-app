import { ReactNode } from "react";
import QueryProviderClient from "../components/QueryProviderClient";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/system";
import theme from "@/services/theme";

export const metadata = {
  title: "Chat App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <QueryProviderClient>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AppRouterCacheProvider>
          </QueryProviderClient>
        </AuthProvider>
      </body>
    </html>
  );
}
