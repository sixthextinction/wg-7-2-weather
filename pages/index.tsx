import { NextPage } from "next";
import React, { useState } from "react";
import { useQuery, withWunderGraph } from "../components/generated/nextjs";

const Home: NextPage = () => {
  const [query, setQuery] = useState<string>("Portland");
  const [searchInput, setSearchInput] = useState<string>("Portland");
  const { data, isLoading } = useQuery({
    operationName: "weather/get",
    input: {
      city: query,
    },
  });

  // event handlers
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // essentially "submit" a query
    setQuery(searchInput);
  };

  return (
    <div className="text-cyan-400 dark:text-white overflow-x-clip overflow-y-auto">
      <form onSubmit={handleSubmit} className="w-full ml-3 max-w-3xl px-4 py-2">
        <div className="flex border-b border-teal-500 py-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="appearance-none bg-transparent border-none w-full dark:text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      ) : (
        <div className="items-left ml-4 p-4 text-slate-900 max-w-3xl bg-gradient-to-r from-green-300 to-purple-400 rounded-xl ">
          <h1 className="mb-2 text-2xl font-medium">{data?.city}</h1>
          <img
            src={`${data?.weather.icon}`}
            alt={data?.weather.forecast}
            className="w-32 h-32 rounded-lg"
          />
          <p className="text-5xl text-slate-800 font-bold mt-2 mb-2">
            {data?.weather.temperature}°{data?.weather.temperatureUnit}
          </p>
          <p className="text-sm font-medium mt-2 mb-2">
            Wind Speed: {data?.weather.windSpeed} {data?.weather.windDirection}°
          </p>
          <hr className="border-white"></hr>
          
          <p className="text-lg font-medium mt-2">
            {data?.weather.forecast}
          </p>
        </div>
      )}
    </div>
  );
};

export default withWunderGraph(Home);
