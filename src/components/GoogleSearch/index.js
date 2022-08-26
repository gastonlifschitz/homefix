import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import { GoogleMap, Marker } from '@react-google-maps/api';
import _ from 'lodash';
import React from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getZipCode
} from 'use-places-autocomplete';
import { roles } from '../../config.json';
import LoadGoogleMapAPI from '../../services/util';
/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBzETvM_OvTR3qSz7xuV2S5rB4_1izmNlQ&libraries=places"></script>; */

const libraries = ['places'];

const mapContainerStyle = {
  height: '300px'
};
const options = {
  disableDefaultUI: true,
  zoomControl: true
};

export default function GoogleSearch({ address, setAddress, role, create }) {
  const { isLoaded, loadError } = LoadGoogleMapAPI(libraries);
  //TODO:NO BORRAR, se deberia usar, pero tira error, sin eso no tira error
  // const { resp } = usePlacesAutocomplete({ callbackName: "initMap" });

  //TODO: set address to user location
  // const [address, setAddress] = React.useState({
  //   lat: -34.603832,
  //   lng: -58.381736,
  // })

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);

  if (loadError) return 'Error cargando Mapa';
  if (!isLoaded) return 'Cargando Mapa...';

  return (
    <div>
      {_.isEqual(role, roles.ADMIN) || create ? (
        <Search
          panTo={panTo}
          style={{ width: '80%' }}
          addressSelected={address}
          setAddressSelected={setAddress}
        />
      ) : null}

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={address}
        options={options}
        onLoad={onMapLoad}
      >
        <Marker position={{ lat: address.lat, lng: address.lng }} />
      </GoogleMap>
    </div>
  );
}

async function getPlusCode({ lat, lng }) {
  const url = `https://plus.codes/api?address=${lat},${lng}&ekey=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log('getPlusCode', data, data.plus_code.global_code);
    });
}

function Search({ panTo, addressSelected, setAddressSelected }) {
  usePlacesAutocomplete({ callbackName: 'initMap' });

  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => addressSelected.lat,
        lng: () => addressSelected.lng
      },
      radius: 100 * 1000
    }
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
    setAddressSelected({ ...addressSelected, address: e.target.value });
  };

  const searchForAdministrative_area_level_2 = (results) => {
    var filtered_array = results[0].address_components.filter(function (
      address_component
    ) {
      return address_component.types.includes('administrative_area_level_2');
    });
    //Hay barrios cerrados que no tienen el campo "route", por eso no lo validamos (ej:Los Pilares Barrio Cerrado)

    // var filtered_array_route = results[0].address_components.filter(function (
    //   address_component
    // ) {
    //   return address_component.types.includes('route');
    // });

    // var filtered_array_strNumber = results[0].address_components.filter(
    //   function (address_component) {
    //     return address_component.types.includes('street_number');
    //   }
    // );

    if (filtered_array.length > 0) {
      return filtered_array[0].long_name.toUpperCase();
    }
    return null;
  };

  const handleSelect = async (address) => {
    setValue(address /*, false*/);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const zipcode = await getZipCode(results[0], false);
      const plusCode = await getPlusCode({ lat, lng });
      console.log('google res', zipcode, results, plusCode, address);
      const administrative_area_level_2 =
        searchForAdministrative_area_level_2(results);
      setAddressSelected({
        lat: lat,
        lng: lng,
        address,
        administrative_area_level_2
      });

      panTo({ lat, lng });
    } catch (error) {
      console.log('😱 Error: ', error);
    }
  };

  return (
    <div className="search">
      {/* TODO: ver autocomplete */}
      <Combobox onSelect={handleSelect} autoComplete="off">
        <ComboboxInput
          value={addressSelected.address}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Direccion"
          style={{ width: '90%' }}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
