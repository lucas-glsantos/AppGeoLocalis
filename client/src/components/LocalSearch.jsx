import { useEffect, useState } from "react";

const normalize = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const LocalSearch = ({ userRegion, setCenter }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    // Ranking
    const rankResults = (data) => {
        return data
            .map((item) => {
                const stateMatch = item.address?.state === userRegion?.state;
                const cityMatch = item.address?.city === userRegion?.city || item.address?.town === userRegion?.city;

                let score = item.importance || 0;

                if (stateMatch) score += 5;
                if (cityMatch) score += 10;

                return { ...item, score };
            })
            .sort((a, b) => b.score - a.score);
    };
    
    // Busca com debounce
    useEffect(() => {
        if (!query || query.trim().length < 2) return;

        const timer = setTimeout(() => {
            fetchLocations(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const fetchLocations = async (search) => {
        const normalized = normalize(search);

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${normalized},brasil&format=json&addressdetails=1&countrycodes=br&limit=10`,
                { signal: controller.signal }
            );

            clearTimeout(timeout);

            if (!res.ok) return;

            const data = await res.json();
            const ranked = rankResults(data);
            setResults(ranked);
        } catch {
            setResults([]);
        }
    };

    // Seleção
    const handleSelect = (item) => {
        setCenter([parseFloat(item.lat), parseFloat(item.lon)]);
        setQuery(item.display_name);
        setResults([]);
    };

    return (
        <div className="w-full max-w-md mx-auto" role="combobox" aria-expanded={results.length > 0}>
            <label htmlFor="location-search" className="sr-only">Buscar cidade</label>
            <input
                id="location-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar cidade..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                aria-label="Buscar cidade"
                aria-autocomplete="list"
                autoComplete="off"
            />

            {results.length > 0 && (
                <ul
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-xl mt-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700"
                    role="listbox"
                    aria-label="Resultados da busca"
                >
                    {results.map((item) => (
                        <li
                            key={item.place_id}
                            onClick={() => handleSelect(item)}
                            onKeyDown={(e) => e.key === "Enter" && handleSelect(item)}
                            role="option"
                            aria-selected={false}
                            tabIndex={0}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 transition"
                        >
                            <span className="text-gray-900 dark:text-gray-100">{item.display_name}</span>

                            {item.address?.state === userRegion?.state && (
                                <span className="ml-2 text-xs text-green-500 font-medium">
                                    Próximo
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default LocalSearch;