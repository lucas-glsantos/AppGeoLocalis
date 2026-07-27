
export const post_categories = [
        {
                id: "tudo",
                name: "Tudo",
                color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        },
        {
                id: "startup",
                name: "Startup",
                color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        },
        {
                id: "tecnologia",
                name: "Tecnologia", 
                color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
        {
                id: "financas",
                name: "Finanças",
                color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        },
        {
                id: "lifestyle",
                name: "Lisfestyle",
                color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        },
        {
                id: "outro",
                name: "Outro",
                color: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        },
];

// Como usar post_categories?

/*
{post_categories.map(category => (
    <option
        key={category.id}
        value={category.name}
    >
        {category.name}
    </option>
))}

E o badge fica

const category = post_categories.find(
    c => c.name === post.category
);

<span className={category.color}>
    {category.name}
</span>

*/


export const business_categories = ["Tudo", "Tecnologia", "Startup", "Finanças", "Consultoria", "Lifestyle", "Educação", "Moda", "Saúde", "Serviços", "Outro"];
