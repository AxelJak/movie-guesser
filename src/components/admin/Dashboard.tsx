import { useQuery, useZero } from "@rocicorp/zero/react";
import { Schema } from "../../schema";

export default function Dashboard() {
  const z = useZero<Schema>();
  const movieQuery = z.query.movie;
  const listQuery = z.query.list;
  const [movies] = useQuery(movieQuery);
  const [lists] = useQuery(listQuery);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Movies
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {movies.length}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Lists
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {lists.length}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
