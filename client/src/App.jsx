import { lazy, Suspense, memo } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useApp } from "./controllers/AppContext";
import { Loader2 } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

// Rotas públicas 
const Home = lazy(() => import("./pages/Home"));
const Post = lazy(() => import("./pages/Post"));
const Login = lazy(() => import("./pages/Login"));
const Nearby = lazy(() => import("./pages/Nearby"));

// Rotas do autor
const Layout = lazy(() => import("./pages/dashboard/Layout"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const AddPost = lazy(() => import("./pages/dashboard/painel/UserAddPost"));
const ListPost = lazy(() => import("./pages/dashboard/painel/UserListPost"));
const EditPost = lazy(() => import("./pages/dashboard/painel/UserEditPost"));
const Comments = lazy(() => import("./pages/dashboard/painel/Comments"));
const AddBusiness = lazy(() => import("./pages/dashboard/painel/busines/UserAddBusiness"));
const ListBusiness = lazy(() => import("./pages/dashboard/painel/busines/UserListBusiness"));
const EditBusiness = lazy(() => import("./pages/dashboard/painel/busines/UserEditBusiness"));


const ProtectedRoute = memo(() => {
    const { isAuthenticated, isLoading } = useApp();
    if (isLoading) return null;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
});

const App = () => {
    return (
        <>
            <Analytics />
            <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
            <Suspense fallback={
                <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Carregando...
                    </span>
                </div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/post/:id" element={<Post />} />
                    <Route path="/nearby" element={<Nearby />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="add-post" element={<AddPost />} />
                            <Route path="list-post" element={<ListPost />} />
                            <Route path="edit-post/:postId" element={<EditPost />} />
                            <Route path="list-comment" element={<Comments />} />
                            <Route path="add-business" element={<AddBusiness />} />
                            <Route path="list-business" element={<ListBusiness />} />
                            <Route path="edit-business/:businessId" element={<EditBusiness />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default App;