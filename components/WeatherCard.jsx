"use client";

import { useEffect, useState } from "react";
import Loading from "./Loading";

const WeatherCard = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const newLocation = searchLocation.replace(/\s/g, "");
  const apiKey = process.env.NEXT_PUBLIC_API;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    newLocation
  )}&appid=${apiKey}&units=metric`;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [latitude, longitude]);

  const fetchLocation = async () => {
    if (latitude && longitude) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const country = data.address.country || "";
        const state = data.address.state || "";
        const city =
          data.address.city || data.address.town || data.address.village || "";
        const postalCode = data.address.postcode || "";
        setLocation(`${city}, ${state}, ${postalCode}, ${country}`);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    } else {
      setLocation("Rajasthan");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (location) {
        try {
          const apiLocation = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            location
          )}&appid=${apiKey}&units=metric`;

          const response = await fetch(apiLocation);
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setError(error);
        }
      }
    };

    fetchData();
  }, [location]);

  const handleSearch = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        setError(null);
      } else {
        setError("Location not found");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("An error occurred while fetching weather data");
      setWeatherData(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-[90%] lg:w-[60%] xl:w-[40%] bg-opacity-25 bg-gray-500 rounded-lg shadow-lg backdrop-blur-6 border border-opacity-50 flex flex-col">
          <div className="flex items-center justify-center pt-10">
            <input
              type="search"
              placeholder="Search location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="p-2 px-3 w-[50%] sm:w-[30%] text-base border-none outline-none rounded-s-full"
            />
            <button
              disabled={!searchLocation}
              type="submit"
              onClick={handleSearch}
              className="py-2 px-3 text-base border-none outline-none rounded-e-full bg-black/30 text-white"
            >
              Search
            </button>
          </div>
          {weatherData ? (
            <>
              <div className="col-span-2 text-center pt-10 font-semibold">
                <p className="text-white sm:text-4xl text-2xl tracking-wider">
                  {weatherData.name}
                  <span className="font-normal sm:text-2xl text-xl px-2">
                    - {weatherData.sys.country}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
                <div className="flex flex-col text-center items-center justify-center pb-5">
                  <img
                    src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                    width={250}
                    height={250}
                    alt=""
                  />
                  <p className="sm:text-6xl text-5xl text-white font-medium">
                    {weatherData.main.temp}&#8451;
                  </p>
                </div>
                <div className="flex flex-col text-center items-center justify-center gap-4">
                  <p className="text-white sm:text-2xl text-lg  shadow-md bg-black/20 rounded-full flex items-center justify-center px-4 py-3 font-medium">
                    Humidity:
                    <span className="sm:text-3xl text-2xl px-2">
                      {weatherData.main.humidity}
                    </span>
                  </p>
                  <p className="text-white sm:text-2xl text-lg shadow-md bg-black/20 rounded-full flex items-center justify-center px-4 py-3 font-medium">
                    Wind Speed:
                    <span className="sm:text-3xl text-2xl px-2">
                      {weatherData.wind.speed}
                    </span>
                  </p>
                </div>
              </div>
            </>
          ) : !error ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-[100px] w-[100px] rounded-[200px] border-[3px] border-t-[#efefef] border-b-[#0b3142] animate-spin"></div>
            </div>
          ) : (
            ""
          )}
          {error && !weatherData && (
            <div className="text-center py-3">
              <p className="text-red-500 text-xl font-semibold">{error}</p>
            </div>
          )}
        </div>
        <div className="text-center bottom-0 fixed">
          <p className="text-white bg-black/10 font-medium">
            &copy; All right reserved & Created by
            <a
              href="http://CsCodeway.vercel.app"
              target="_blank"
              className="px-1"
            >
              CsCodeway
            </a>
          </p>
        </div>
      </div>
  );
};
export default WeatherCard;
