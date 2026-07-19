import Header from "../components/Header";
import SearchPost from "../components/SearchPost";
import PostList from "../components/PostList";
import Footer from "../components/Footer";
import SourceMap from "../components/LocalMap";
import PublicLayout from "./dashboard/PublicLayout";
import { mainNavItems } from "./dashboard/PublicLayout";
import { useApp } from "../controllers/AppContext";

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
                            <SourceMap />
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </PublicLayout>
    );
    
};

export default Home;