import { CircularProgress, Slide, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cityName, setCityName] = useState("Rampur");
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=5cd8288ca2b9cacc5d140156424d53cb&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("Something Went Wrong");
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cityName, error]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      setInputText("");
    }
  };
  console.log(data);

  //background change

  const getBackground = () => {
    if (!data.weather) {
      return "bg_img"; // default background image
    }
    const temperature = data.main.temp;
    if (temperature < 0) {
      return "bg_snow";
    } else if (temperature < 10) {
      return "bg_thunderstorm";
    } else if (temperature < 20) {
      return "bg_clouds";
    } else if (temperature < 30) {
      return "bg_hot";
    } else {
      return "bg_hot";
    }
  };

  return (
    <div className={`bg_img ${getBackground()} `}>
      {!loading ? (
        <>
          <TextField
            variant="filled"
            label="search location"
            className="input"
            error={error}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearch}
          />
          <h1 className="city">{data.name}</h1>
          <div className="group">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt=""
            />
            <h1>{data.weather[0].main}</h1>
          </div>
          <h1 className="temp">{data.main.temp.toFixed()}??c</h1>
          <Slide direction="right" timeout={800} in={!loading}>
            <div className="box_container">
              <div className="box">
                <p>Humidity</p>
                <h1>{data.main.humidity.toFixed()}%</h1>
              </div>
              <div className="box">
                <p>Wind</p>
                <h1>{data.wind.speed.toFixed()}km/hr</h1>
              </div>
              <div className="box">
                <p>Feels</p>
                <h1>{data.main.feels_like.toFixed()}??c</h1>
              </div>
            </div>
          </Slide>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default App;
