import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { UseCities } from "../contexts/CitiesContext";

function CountryList() {
  const {cities, isLoading} = UseCities();
  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message="add your first Country" />;

  const uniqueCountries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {uniqueCountries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
