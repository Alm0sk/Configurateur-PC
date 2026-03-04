import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { UserDetail } from "./pages/UserDetail";
import { Categories } from "./pages/Categories";
import { Components } from "./pages/Components";
import { ComponentDetail } from "./pages/ComponentDetail";
import { Partners } from "./pages/Partners";
import { Configurations } from "./pages/Configurations";
import { ConfigurationDetail } from "./pages/ConfigurationDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AdminOnlyRoute({ children }) {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return children;
  }

  const currentUserId = user?.id || user?._id;
  return (
    <Navigate to={currentUserId ? `/users/${currentUserId}` : "/"} replace />
  );
}

function UserDetailRoute() {
  const { id } = useParams();
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;

  if (user?.role === "admin" || id === currentUserId) {
    return <UserDetail />;
  }

  return (
    <Navigate to={currentUserId ? `/users/${currentUserId}` : "/"} replace />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/users"
                element={
                  <AdminOnlyRoute>
                    <Users />
                  </AdminOnlyRoute>
                }
              />
              <Route path="/users/:id" element={<UserDetailRoute />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/components" element={<Components />} />
              <Route path="/components/:id" element={<ComponentDetail />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/configurations" element={<Configurations />} />
              <Route
                path="/configurations/:id"
                element={<ConfigurationDetail />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
