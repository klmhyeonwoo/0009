import { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AuthContext } from "./hooks/api/useAuth";
import { api } from "./api/index";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (!isLoggedIn) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(
    Cookies.get("accessToken") ?? null,
  );

  const signIn = useCallback((token: string, _refreshToken?: string) => {
    Cookies.set("accessToken", token);
    setAccessToken(token);
  }, []);

  const signOut = useCallback(() => {
    Cookies.remove("accessToken");
    setAccessToken(null);
    queryClient.clear();
  }, []);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(undefined, (error) => {
      if ((error as { status?: number }).status === 401) {
        signOut();
        window.location.href = "/sign-in";
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(interceptorId);
  }, [signOut]);

  const isLoggedIn = !!accessToken;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          isLoggedIn,
          accessToken,
          signIn,
          signOut,
          setAccessToken: signIn,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/task" element={<TaskList />} />
                <Route path="/task/:id" element={<TaskDetail />} />
                <Route path="/user" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
