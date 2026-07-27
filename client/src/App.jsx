import { lazy, Suspense, memo } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

import { useApp } from "@/controllers/AppContext";
import LoadingScreen from "@/components/shared/loader/LoadingScreen";

// Rotas públicas
const HomePage = lazy(() => import("@/pages/HomePage"));
const PostPage = lazy(() => import("@/components/shared/PostPage"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Nearby = lazy(() => import("@/pages/NearbyBusinesPage"));

// Rotas do autor
const Layout = lazy(() => import("@/components/layout/Layout"));
const Dashboard = lazy(() => import("@/components/layout/Dashboard"));
const UserAddPost = lazy(() => import("@/pages/dashboard/customer/AddPost"));
const UserListPost = lazy(() => import("@/pages/dashboard/customer/ListPost"));
const UserEditPost = lazy(() => import("@/pages/dashboard/customer/EditPost"));
const Comments = lazy(() => import("@/pages/dashboard/comments/Comments"));
const UserAddBusiness = lazy(() => import("@/pages/dashboard/busines/UserAddBusiness"));
const UserListBusiness = lazy(() => import("@/pages/dashboard/busines/UserListBusiness"));
const UserEditBusiness = lazy(() => import("@/pages/dashboard/busines/UserEditBusiness"));
const Metrics = lazy(() => import("@/pages/dashboard/metrics/Metrics"));

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
			<Suspense fallback={<LoadingScreen />}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/post/:id" element={<PostPage />} />
					<Route path="/nearby" element={<Nearby />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/dashboard" element={<Layout />}>
							<Route index element={<Dashboard />} />
							<Route path="add-post" element={<UserAddPost />} />
							<Route path="list-post" element={<UserListPost />} />
							<Route path="edit-post/:postId" element={<UserEditPost />} />
							<Route path="list-comment" element={<Comments />} />
							<Route path="add-business" element={<UserAddBusiness />} />
							<Route path="list-business" element={<UserListBusiness />} />
							<Route path="edit-business/:businessId" element={<UserEditBusiness />} />
							<Route path="metrics" element={<Metrics />} />
						</Route>
					</Route>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Suspense>
		</>
	);
};

export default App;
