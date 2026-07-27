import { lazy, Suspense, memo } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

import { useApp } from "./controllers/AppContext";
import LoadingScreen from "./components/shared/loader/LoadingScreen";

// Rotas públicas
const Home = lazy(() => import("./pages/HomePage"));
const PostPage = lazy(() => import("./components/shared/PostPage"));
const Login = lazy(() => import("./pages/auth/Login"));
const Nearby = lazy(() => import("./pages/NearbyBusinesPage"));

// Rotas do autor
const Layout = lazy(() => import("./components/layout/Layout"));
const Dashboard = lazy(() => import("./components/layout/Dashboard"));
const AddPost = lazy(() => import("./pages/dashboard/customer/UserAddPost"));
const ListPost = lazy(() => import("./pages/dashboard/customer/UserListPost"));
const EditPost = lazy(() => import("./pages/dashboard/customer/UserEditPost"));
const Comments = lazy(() => import("./pages/dashboard/comments/Comments"));
const AddBusiness = lazy(() => import("./pages/dashboard/busines/UserAddBusiness"));
const ListBusiness = lazy(() => import("./pages/dashboard/busines/UserListBusiness"));
const EditBusiness = lazy(() => import("./pages/dashboard/busines/UserEditBusiness"));
const Metrics = lazy(() => import("./pages/dashboard/metrics/Metrics"));

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
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/post/:id" element={<PostPage />} />
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
