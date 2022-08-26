import { GoogleMap, Polygon } from '@react-google-maps/api';
import React from 'react';
import { isWidthUp } from '@material-ui/core/withWidth';
import geoFile from '../../maps/buenosAires.json';
import LoadGoogleMapAPI from '../../services/util';
//info: el id de las islas del delta (que pertenecen a sanfer) es 999

//for the container
const mapContainerProfileStyle = {
  height: '350px',
  width: '100%'
};

const mapContainerStyle = {
  height: '500px'
};

const mapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: false,
  mapTypeControl: false
};

//where to start map. (BSAS por ahora)
const center = {
  lat: -34.603832,
  lng: -58.381736
};

//del geoJson agarro las coordenadas para luego graficar los poligonos
async function getPolygonsProps() {
  let res = [];
  let geojson = geoFile;
  geojson.features.map((regionJ) => {
    let coordinates = regionJ.geometry.coordinates[0];
    let coorArr = [];
    coordinates.map((coordinate) =>
      coorArr.push({ lat: coordinate[1], lng: coordinate[0] })
    );
    res.push({ coorArr: coorArr, props: regionJ.properties });
  });
  return res;
}
//polsId: id de los polygonos clickeados, cuando no estamos seleccionando del mapa
export default function Map({
  clickedPoligonos,
  polsId,
  profilePage,
  clickableMap,
  width
}) {
  //si recibo polsId, voy a buscar sus coordenadas al json para dibujarlos
  //los agrego a clicked pols
  const searchPolsFromId = () => {
    let geojson = geoFile;
    geojson.features.forEach((element) => {
      if (polsId.includes(element.properties.id)) {
        let coordinates = element.geometry.coordinates[0];
        let coorArr = [];
        coordinates.map((coordinate) =>
          coorArr.push({ lat: coordinate[1], lng: coordinate[0] })
        );
        var addPol = {
          coorArr: coorArr,
          props: element.properties
        };
        setClickedPols((clickedPols) => [...clickedPols, addPol]);
      }
    });
  };

  // API key y load erros
  const { isLoaded, loadError } = LoadGoogleMapAPI();

  //array con objeto {coordenadasPoligono,propiedades poligono} con las coordinadas de cada distrito para graficar los distintos poligonos y las propiedades de los mismos
  const [polygonProps, setpolygonProps] = React.useState([]);
  React.useEffect(() => {
    async function getData() {
      const resp = await getPolygonsProps();
      setpolygonProps(resp);
      // !! chequea null, undefiened y empty
    }
    getData();
  }, []);

  //poligonos clickeados
  const [clickedPols, setClickedPols] = React.useState([]);
  React.useEffect(() => {
    if (!!polsId) {
      searchPolsFromId();
    }
  }, [polsId]);
  React.useEffect(() => {
    if (!!clickedPoligonos) {
      clickedPoligonos(clickedPols);
    }
  }, [clickedPols, polsId]);

  if (loadError) return 'Error cargando mapa';
  if (!isLoaded) return 'Cargando...';

  const onPolygonClick = (e) => {
    if (clickedPols.some((elem) => elem.props.id === e.props.id)) {
      setClickedPols(
        clickedPols.filter((item) => item.props.id !== e.props.id)
      );
    } else {
      setClickedPols((clickedPols) => [...clickedPols, e]);
    }
  };

  // render cada poligono
  const renderRegions = () => {
    if (polygonProps !== []) {
      return polygonProps.map((arr) => {
        return clickedPols.some((elem) => elem.props.id === arr.props.id) ? (
          <Polygon
            path={arr.coorArr}
            key={arr.props.id}
            options={{
              fillColor: '#e2545457',
              fillOpacity: 0.9,
              strokeColor: '#000',
              strokeOpacity: 1,
              strokeWeight: 1
            }}
            onClick={clickableMap ? () => onPolygonClick(arr) : false}
          ></Polygon>
        ) : (
          <Polygon
            path={arr.coorArr}
            key={arr.props.id}
            options={{
              fillColor: '#000',
              fillOpacity: 0.1,
              strokeColor: '#000',
              strokeOpacity: 1,
              strokeWeight: 1
            }}
            onClick={clickableMap ? () => onPolygonClick(arr) : false}
          ></Polygon>
        );
      });
    }
  };

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={
        isWidthUp('md', width) ? mapContainerStyle : mapContainerProfileStyle
      }
      zoom={10}
      center={center}
      options={mapOptions}
    >
      {/* render cada poligono por nombre de ciudad */}
      {polygonProps !== [] ? renderRegions() : null}
    </GoogleMap>
  );
}
