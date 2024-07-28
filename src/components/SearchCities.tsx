import { useEffect, useState } from "react";

interface City {
    name: string;
    place_id: string;
    adm_area1: string;
    adm_area2: string;
    country: string;
    lat: string;
    lon: string;
    timezone: string;
    type: string;
  }
function SearchCities(){

    const [cities, setCities] = useState<City[]>([]);

// search and autocomplete cities by fetching the api and showing the results
    const searchCities = async (search: string) => {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const url = `https://www.meteosource.com/api/v1/free/find_places_prefix?text=${search}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        // Guardar la lista de ciudades en el estado
        setCities( data );
    }
    // Add event listener to the input element
    useEffect(() => {
        const input = document.getElementById('search') as HTMLInputElement;
        input.addEventListener('input', () => {
            searchCities(input.value);
        });
    }, []);
    return (
        <div className="search-cities">
            <h1>Search Cities</h1>
            <input id="search" type="text" placeholder="Search cities" />
            <select id="cities"> 
                {cities.map(city => (
                    <option key={city.place_id} value={city.place_id}>
                        {city.name}, {city.adm_area1}, {city.country}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SearchCities;