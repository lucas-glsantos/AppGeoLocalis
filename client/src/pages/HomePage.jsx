import Header from "@/components/shared/Header";
import SearchPost from "@/components/SearchPost";
import PostList from "./PostListPage";
import Footer from "@/components/shared/Footer";
import PublicLayout, { mainNavItems } from "@/components/layout/PublicLayout";
import { useApp } from "@/controllers/AppContext";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Home = () => {
    const { input } = useApp();
    const hasSearch = input && input.trim() !== "";

    return (
        <PublicLayout items={mainNavItems}>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <main>
                    <Header />
                    {!hasSearch && <PostList />}
                    <SearchPost />
                    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Comércios Locais
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Encontre négocios e produtos próximos a Você
                            </p>
                        </div>

                        <div className="max-w-7xl mx-auto px-6">
                            <Link
                                to="/nearby"
                                className="block max-w-2xl mx-auto p-8 bg-gradient-to-r from-sky-500 to-blue-700 dark:from-blue-700 dark:to-sky-500 rounded-2xl text-white text-center shadow-lg hover:scale-[1.02] transition-transform"
                            >
                                <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-700 dark:bg-blue-900/20 mb-4">
                                    <MapPin className="w-12 h-12 mx-auto" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Descubra Comércios Próximos</h3>
                                <p className="opacity-90">Encontre négocios e produtos perto de você</p>
                            </Link>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </PublicLayout>
    );
    
};

export default Home;