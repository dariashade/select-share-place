import { GOOGLE_API_KEY, GOOGLE_URL } from './config';
import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

// declare var google: any;

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // send this to google API
  axios
    .get<GoogleGeocodingResponse>(
      `${GOOGLE_URL}?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
    )
    .then(response => {
      if (response.data.status != 'OK')
        throw new Error('Could not fetch location');

      const coords = response.data.results[0].geometry.location;
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: coords,
          zoom: 16,
        }
      );
      new google.maps.Marker({ position: coords, map });
    })
    .catch((err: Error) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);
