import { useEffect, useState } from "react";
import Button from "./Button";
import styles from "./Form.module.css";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../hooks/useUlrPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { UseCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const [lat, lng] = useUrlPosition();
  const { CreateCity, isLoading } = UseCities();
  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function feetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log(data);

          if (!data.countryCode)
            throw new Error("thats not a city.click someWhere else");

          setCityName(data.city || data.locality || "");
          setEmoji(convertToEmoji(data.countryCode));
          setCountry(data.countryName);
        } catch (err) {
          setGeocodingError(err.message);
          console.error("Error fetching city data:", err);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      feetchCityData();
    },
    [lat, lng]
  );

  if (geocodingError) return <Message message={geocodingError} />;
  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng) return <Message message={"start by clicking on the map"} />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await CreateCity(newCity);
    navigate("/app/cities");
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">
          When did you go to{" "}
          <strong style={{ color: "#00c46a" }}>{cityName}</strong>?
        </label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={"yyyy/MM/dd"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
