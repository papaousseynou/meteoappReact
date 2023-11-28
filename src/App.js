import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// import { config } from "dotenv";
// import { v4 as uuidv4 } from "uuid";
import "./css/app.css";
// import Meteo from "./pages/Meteo";
import Ville from "./pages/Ville";

// config(); // Chargez les variables d'environnement depuis le fichier .env

function App() {
  //State
  const [apiData, setApiData] = useState({}); // Pour stocker la reponse

  const [getState, setGetState] = useState("Dakar"); // Pour stocker le nom de l'emplacement à partir du champ de saisie
  const [state, setState] = useState("Dakar"); // Pour stocker une copie de getState pour mettre à jour l'etat
  // API KEY  URL

  const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}&lang=fr`;
  // const oneCallUrl = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid=${apiKey}&lang=fr`;
  // `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=fr`
  // Utilisation de fetch et useEffect
  // ...

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "404") {
          // Gestion des erreurs pour les emplacements invalides
          console.error("Invalid location");
        } else {
          // setApiData(data);
          // Extraire les données de la reponse

          const lat = data.coord.lat;
          const lon = data.coord.lon;
          // Utilisées les coordonnées pour la requete one Call
          const oneCallURLWithCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=fr`;
          // Faire la requete oncall
          fetch(oneCallURLWithCoords)
            .then((response) => response.json())
            .then((oneCallData) => {
              //Utiliser les données de la requete One Call comme nécessaire
              setApiData(oneCallData);
            })
            .catch((error) =>
              console.log("Erreur lors de la requete One Call :", error)
            );
        }
      });
  }, [apiUrl]);



  // fonction pour gerer l'entrée

  // pour gérer le champ de saisie
  const inputHandler = (event) => {
    setGetState(event.target.value);
  };
  // cette fonction est utilisée pour copier l'état de getState vers l'état.
  const submitHandler = () => {
    setState(getState);
  };
  // cette fonction est utilisée pour convertir kelvin en farenheit,
  // const kelvinToFarenheit = (k) => {
  //   return ((k - 32) * 5/9).toFixed(2);
  // };
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Ville
              apiData={apiData}
              getState={getState}
              inputHandler={inputHandler}
              submitHandler={submitHandler}
              // kelvinToFarenheit={kelvinToFarenheit}
            />
          }
        />
      </Routes>
    </>
  );
}
export default App;
