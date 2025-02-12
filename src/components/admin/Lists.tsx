import { useState } from 'react';
import { useQuery, useZero } from '@rocicorp/zero/react';
import { Schema } from '../../schema';
import { randID } from '../../utils/rand';
import Input from '../Input';

export default function Lists() {
  const z = useZero<Schema>();
  const listQuery = z.query.list;
  const [lists] = useQuery(listQuery);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState<string>(lists[0]?.id ?? '');

  const movieListQuery = z.query.list.related('movies').where('id', selectedList);
  const [list] = useQuery(movieListQuery);

  const moviesInList = list[0].movies ?? [];

  function createList() {
    z.mutate.list.insert({
      id: randID(),
      name: newListName,
      description: '',
    });
    setNewListName('');
  }

  function deleteList(listId: string) {
    z.mutate.list.delete({id: listId});
    if (selectedList === listId) {
      setSelectedList("");
    }
  }

  function removeFromList(movieId: string | undefined) {
    if (!movieId) return;
    z.mutate.movie_list.delete({movieId: movieId, listId: selectedList});
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create New List</h2>
        <div className="flex gap-4">
          <Input
            type="text"
            value={newListName}
            onChange={(e: any) => setNewListName(e.target.value)}
            placeholder="Enter list name..."
            className="flex-1 shadow-xs focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={() => createList()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Movie Lists</h2>
          <div className="space-y-2">
            {lists?.map((list) => (
              <div
                key={list.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => setSelectedList(list.id)}
              >
                <span className={selectedList === list.id ? 'font-semibold text-gray-900' : 'text-gray-500'}>
                  {list.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white shadow-sm sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedList ? 
              `Movies in ${lists?.find(l => l.id === selectedList)?.name}` : 
              'Select a list to view its movies'}
          </h2>
          {selectedList && (
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
              {moviesInList.map((movie) => (
                <div key={movie?.id} className="border rounded-lg p-4 flex">
                  {movie?.posterPath && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie?.posterPath}`}
                      alt={movie?.title}
                      className="w-24 h-auto rounded-lg mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{movie?.title}</h3>
                    <p className="text-sm text-gray-600">{movie?.releaseDate}</p>
                    <button
                      onClick={() => removeFromList(movie?.id)}
                      className="mt-2 text-red-600 text-sm hover:text-red-800"
                    >
                      Remove from list
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
