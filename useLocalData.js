import React from "react";
import WEATHER_API_EXAMPLE from "./weatherApiExample";
import { fromUnixTime } from "date-fns";

function getCoordinates() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        //console.log("position", latitude, longitude);
        resolve({ latitude, longitude });
      },
      (error) => {
        switch (error.code) {
          case error.TIMEOUT:
            console.error("The user didn't accept the callout");
            reject();
            break;
        }
      }
    );
  });
}

export default function useLocalData() {
  const [localData, setLocalData] = React.useState({});
  React.useEffect(() => {
    async function update() {
      console.log("UPDATE LOCAL DATA");
      const { latitude, longitude } = await getCoordinates();
      // I can only do a call to the "one call API" for the hourly weather forecast
      // https://openweathermap.org/api/one-call-api
      // const weather = await fetch(
      //   `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_APIKEY}`
      // ).then((response) => response.json());

      const weather = WEATHER_API_EXAMPLE;
      // Other stuff that would be practical to visualise is
      // the weather today, and maybe the weather in the comming hour specially?
      // I don't know, consider that maybe that info is noise
      setLocalData({
        sunrise: fromUnixTime(weather.current.sunrise),
        sunset: fromUnixTime(weather.current.sunset),
      });
    }
    update();
    const handle = setInterval(update, 30 * 30 * 1000);
    return () => clearInterval(handle);
  }, []);

  return localData;
}
