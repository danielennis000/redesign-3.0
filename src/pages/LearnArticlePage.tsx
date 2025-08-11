import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ARTICLES } from '../learn/articles';

export default function LearnArticlePage() {
  const { id } = useParams();
  const article = React.useMemo(() => ARTICLES.find(a => a.id === id), [id]);
  return (
    <div className="min-h-screen w-full bg-asu-gray-100 text-asu-black">
      <div className="mx-auto flex max-w-[1600px] gap-0 lg:gap-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-3xl">
            {!article ? (
              <div>
                <div className="text-lg font-semibold">Article not found</div>
                <Link to="/learn" className="text-asu-maroon">Back to Learn</Link>
              </div>
            ) : (
              <article className="prose prose-neutral max-w-none">
                <Link to="/learn" className="text-asu-maroon">← Back to Learn</Link>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{article.title}</h1>
                <div className="mt-1 text-asu-gray-700">{article.summary}</div>
                <div className="not-prose mt-4 rounded-xl border border-asu-gray-300 bg-white p-5">
                  {article.content}
                </div>
              </article>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


