import { Link } from 'wouter';
import { Suspense } from 'react';
import { useRoute } from 'wouter';
import Dashboard from './Dashboard';
import Movies from './Movies';
import Lists from './Lists';

export default function AdminLayout() {
  const [isRoot] = useRoute('/admin');
  const [isMovies] = useRoute('/admin/movies');
  const [isLists] = useRoute('/admin/lists');

  const linkClassName = (isActive: boolean) => 
    `${isActive ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500'} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`;

  return (
    <div className="bg-gray-100 w-full h-screen">
      <nav className="bg-white shadow-sm">
          <div className="flex justify-around h-16">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Movie Guesser Admin</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin"
                  className={linkClassName(isRoot)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/movies"
                  className={linkClassName(isMovies)}
                >
                  Movies
                </Link>
                <Link
                  href="/admin/lists"
                  className={`${isLists ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500'} hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Lists
                </Link>
              </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="mx-auto px-4">
          <Suspense fallback={<div>Loading...</div>}>
            {isMovies && <Movies />}
            {isRoot && <Dashboard />}
            {isLists && <Lists />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
