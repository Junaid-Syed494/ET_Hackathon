import React from 'react';

// Define the shape of data we might receive from the API/Database
export interface ArticleData {
    title?: string;
    excerpt?: string;
    summary?: string;
    imageUrl?: string;
    urlToImage?: string;
    author?: string;
    source?: { name: string } | string;
    date?: string;
    publishedAt?: string;
    readTime?: string;
    articleUrl?: string;
    url?: string;
}

interface ArticleCardProps {
    article: ArticleData;
    index?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    // 1. Safely extract data with fallbacks
    const title = article.title || "Untitled Article";
    const excerpt = article.excerpt || article.summary || "No description available for this article.";
    const articleUrl = article.articleUrl || article.url || "#";
    const readTime = article.readTime || "3 min";

    // Provide a default ET cover image if none is provided
    const imageUrl = article.imageUrl || article.urlToImage || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800";

    // 2. Safely handle the author field to prevent crashes
    let authorName = "ET Intelligence"; // Default fallback

    if (typeof article.author === 'string' && article.author.trim() !== '') {
        authorName = article.author;
    } else if (typeof article.source === 'object' && article.source?.name) {
        authorName = article.source.name;
    } else if (typeof article.source === 'string') {
        authorName = article.source;
    }

    // Safely get the first letter for the avatar
    const avatarInitial = authorName.charAt(0).toUpperCase();

    // 3. Safely handle dates
    let displayDate = "Recently";
    if (article.date) {
        displayDate = article.date;
    } else if (article.publishedAt) {
        displayDate = new Date(article.publishedAt).toLocaleDateString();
    }

    return (
        <article className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-200 w-full group">
            {/* Image Section */}
            <a href={articleUrl} className="block overflow-hidden relative w-full md:w-1/3 h-48 md:h-auto shrink-0">
                <img
                    src={imageUrl}
                    alt={`Cover image for ${title}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    loading="lazy"
                />
            </a>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Title */}
                <a href={articleUrl} className="block">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 mb-3">
                        {title}
                    </h3>
                </a>

                {/* Excerpt */}
                <p className="text-slate-600 text-sm line-clamp-3 flex-grow leading-relaxed">
                    {excerpt}
                </p>

                {/* Metadata Footer */}
                <div className="mt-6 pt-4 flex items-center border-t border-slate-100">

                    {/* Safe Avatar Render */}
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm ring-2 ring-slate-50 shrink-0">
                        {avatarInitial}
                    </div>

                    {/* Author Details & Date */}
                    <div className="ml-3 flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {authorName}
                        </span>
                        <div className="flex items-center text-xs text-slate-500 mt-0.5 space-x-1.5">
                            <span>{displayDate}</span>
                            <span aria-hidden="true">&middot;</span>
                            <span>{readTime} read</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;