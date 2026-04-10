import React, { useEffect, useState, useRef } from 'react'
import geoIndo from '../../data/geoJsonNasional.json'
// import geoIndo from '../../data/geoJsonNasional.json'
import kabupatenData from '../../data/geoIndoKabupaten.json'
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css"


// const PolygonMaps = () => {
//     const [color, setColor] = useState("#ffff00");

//   const colors = ["green", "blue", "yellow", "orange", "grey"];

//   useEffect(() => {
//   }, []);

//   const countryStyle = {
//     fillColor: "green",
//     fillOpacity: 1,
//     color: "black",
//     weight: 2,
//   };

//   const printMessageToConsole = (event) => {
//     console.log("Clicked");
//   };

//   const getColorBasedOnDensity = (density) => {
//     return density > 500 ? '#800026' :
//            density > 300 ? '#BD0026' :
//            density > 200 ? '#E31A1C' :
//            density > 100 ? '#FC4E2A' :
//            density > 50  ? '#FD8D3C' :
//            density > 20  ? '#FEB24C' :
//                            '#FFEDA0'; // Warna berubah sesuai dengan tingkat kepadatan
//   };

//   const changeCountryColor = (event) => {
//     event.target.setStyle({
//       fillColor: getColorBasedOnDensity(feature.properties.populationDensity),
//       color: "green",
//       fillColor: color,
//       fillOpacity: 1,
//     });
    
//   };

//   const onEachCountry = (country, layer) => {
//     const countryName = country.properties.WADMPR;
//     // layer.bindPopup(countryName);
//     // layer.on({
//     //   click: changeCountryColor, // Mengubah warna saat diklik
//     // });
//     // layer.options.fillOpacity = Math.random();
    
//     // // Uncomment to apply random colors
//     // // const colorIndex = Math.floor(Math.random() * colors.length);
//     // // layer.options.fillColor = colors[colorIndex];

//     // layer.on({
//     //   click: changeCountryColor,
//     // });
//     const density = country.properties.populationDensity;
//     layer.bindPopup(`${countryName}<br>Kepadatan Penduduk: ${density}`);
//   };

//   const colorChange = (event) => {
//     setColor(event.target.value);
//   };
//   return (
//     <React.Fragment>
//         <MapContainer style={{height: "50vh"}} zoom={4} center={[0,120]}>
//             <GeoJSON style={countryStyle}
//             onEachFeature={onEachCountry} data={geoIndo.features} />
//           </MapContainer>
//             {/* <input
//           type="color"
//           value={color}
//           onChange={colorChange}
//             /> */}
//     </React.Fragment>
//   )
// }

// export default PolygonMaps

//ke 2
// const PolygonMaps = () => {
//   const [color, setColor] = useState("#ffff00");
//   const mapRef = useRef(); // Reference untuk MapContainer

//   // Fungsi untuk menentukan warna berdasarkan kepadatan penduduk
//   const getColorBasedOnDensity = (density) => {
//     return density > 500 ? '#006400' :  // Hijau tua untuk kepadatan tinggi
//            density > 300 ? '#228B22' :  // Forest green
//            density > 200 ? '#32CD32' :  // Lime green
//            density > 100 ? '#66CDAA' :  // Medium aquamarine
//            density > 50  ? '#98FB98' :  // Pale green
//            density > 20  ? '#ADFF2F' :  // Green yellow
//                            '#F0FFF0';   // Honeydew (hijau paling terang)
//   };

//   // Fungsi style yang akan diterapkan pada setiap wilayah
//   const countryStyle = (feature) => {
//     const density = feature.properties.populationDensity; // Ambil nilai kepadatan penduduk
//     return {
//       fillColor: getColorBasedOnDensity(density), // Sesuaikan warna dengan kepadatan
//       color: "black", // Warna border
//       weight: 2,
//       fillOpacity: 1,
//     };
//   };

//   // Fungsi zoom saat provinsi di klik
//   const zoomToFeature = (event) => {
//     const layer = event.target;
//     const map = mapRef.current; // Mengakses referensi MapContainer
//     if (map) {
//       map.setView(layer.getBounds().getCenter(), 6); // Zoom ke wilayah yang di klik
//     }
//   };

//   const onEachCountry = (country, layer) => {
//     const countryName = country.properties.WADMPR;
//     const density = country.properties.populationDensity;

//     layer.bindPopup(`${countryName}<br>Kepadatan Penduduk: ${density}`);

//     layer.on({
//       click: zoomToFeature, // Zoom ketika di klik
//     });
//   };

//   return (
//     <React.Fragment>
//       <MapContainer
//         ref={mapRef}  // Tambahkan referensi ke MapContainer
//         style={{ height: "50vh" }} 
//         zoom={4} 
//         center={[0, 120]}
//       >
//         <GeoJSON 
//           style={countryStyle}  // Gunakan style dinamis berdasarkan kepadatan penduduk
//           onEachFeature={onEachCountry} 
//           data={geoIndo.features} 
//         />
//       </MapContainer>
//     </React.Fragment>
//   );
// }

// export default PolygonMaps;

// ke 3
// const PolygonMaps = () => {
//   const [displayData, setDisplayData] = useState(geoIndo);  // Default: data provinsi
//   const mapRef = useRef();  // Reference untuk MapContainer

//   // Fungsi untuk menentukan warna berdasarkan kepadatan penduduk
//   const getColorBasedOnDensity = (density) => {
//     return density > 500 ? '#006400' :
//            density > 300 ? '#228B22' :
//            density > 200 ? '#32CD32' :
//            density > 100 ? '#66CDAA' :
//            density > 50  ? '#98FB98' :
//            density > 20  ? '#ADFF2F' :
//                            '#F0FFF0';
//   };

//   // Fungsi style yang diterapkan pada setiap wilayah
//   const countryStyle = (feature) => {
//     const density = feature.properties.populationDensity || 0;  // Ambil nilai kepadatan penduduk
//     return {
//       fillColor: getColorBasedOnDensity(density),  // Sesuaikan warna dengan kepadatan
//       color: "black",  // Warna border
//       weight: 2,
//       fillOpacity: 1,
//     };
//   };

//   // Fungsi zoom dan menampilkan kabupaten saat provinsi di klik
//   const zoomToFeature = (event) => {
//     const layer = event.target;
//     console.log("Clicked layer:", layer.feature); 
//     const map = mapRef.current;  // Mengakses referensi MapContainer
//     const provinceName = layer.feature.properties.WADMPR;  // Nama provinsi yang di klik
//     console.log("Provinsi yang diklik:", provinceName);

//     if (map) {
//       map.fitBounds(layer.getBounds());  // Zoom ke wilayah yang di klik

//       // Filter data kabupaten yang sesuai dengan provinsi yang di klik
//       const filteredKabupaten = kabupatenData.features.filter(kabupaten => {
//         return kabupaten.properties.WADMPR === provinceName;  // Sesuaikan properti provinsi
//       });

//       console.log("Kabupaten yang difilter:", filteredKabupaten);

//       if (filteredKabupaten.length > 0) {
//         // Tampilkan data kabupaten yang sudah difilter
//         setDisplayData({
//           type: "FeatureCollection",
//           features: filteredKabupaten,
//         });
//       } else {
//         console.log("Kabupaten tidak ditemukan untuk provinsi ini.");
//       }
//     }
//   };

//   // Fungsi untuk setiap elemen GeoJSON
//   const onEachCountry = (country, layer) => {
//     const countryName = country.properties.WADMPR || country.properties.WADMKK;
//     const density = country.properties.populationDensity || "N/A";

//     layer.bindPopup(`${countryName}<br>Kepadatan Penduduk: ${density}`);

//     layer.on({
//       click: zoomToFeature,  // Zoom dan ganti layer saat provinsi di klik
//     });
//   };

//   return (
//     <React.Fragment>
//       <MapContainer
//         ref={mapRef}  // Tambahkan referensi ke MapContainer
//         style={{ height: "50vh" }} 
//         zoom={4} 
//         center={[0, 115]}
//         dragging={false}  // Nonaktifkan dragging
//         zoomControl={false}  // Nonaktifkan kontrol zoom
//         scrollWheelZoom={false}  // Nonaktifkan zoom dengan scroll
//         doubleClickZoom={false}  // Nonaktifkan zoom dengan double-click
//         boxZoom={false}  // Nonaktifkan zoom dengan box
//         touchZoom={false}  // Nonaktifkan zoom dengan sentuhan (pada perangkat mobile)
//       >
//         <GeoJSON 
//           style={countryStyle}  // Gunakan style dinamis berdasarkan kepadatan penduduk
//           onEachFeature={onEachCountry} 
//           data={displayData.features}  // Gunakan state displayData
//         />
//       </MapContainer>
//     </React.Fragment>
//   );
// }

// export default PolygonMaps;

const PolygonMaps = () => {
  const [displayData, setDisplayData] = useState(geoIndo);  // Default: data provinsi
  const mapRef = useRef();  // Reference untuk MapContainer
  const initialZoom = 4;  // Simpan zoom awal
  const initialCenter = [0, 115];  // Simpan center awal

  // Validasi data kabupaten
  const geoKabupatenData = kabupatenData && kabupatenData.features ? kabupatenData : { type: "FeatureCollection", features: [] };

  console.log("Kabupaten data loaded:", geoKabupatenData.features.length);
  
  // Fungsi untuk menentukan warna berdasarkan kepadatan penduduk
  const getColorBasedOnDensity = (density) => {
    return density > 500 ? '#006400' :
           density > 300 ? '#228B22' :
           density > 200 ? '#32CD32' :
           density > 100 ? '#66CDAA' :
           density > 50  ? '#98FB98' :
           density > 20  ? '#ADFF2F' :
                           '#F0FFF0';
  };

  // Fungsi style yang diterapkan pada setiap wilayah
  const countryStyle = (feature) => {
    const density = feature.properties.populationDensity || 0;  // Ambil nilai kepadatan penduduk
    return {
      fillColor: getColorBasedOnDensity(density),  // Sesuaikan warna dengan kepadatan
      color: "black",  // Warna border
      weight: 2,
      fillOpacity: 1,
    };
  };

  // Fungsi zoom dan menampilkan kabupaten saat provinsi di klik
  const zoomToFeature = (event) => {
    const layer = event.target;
    const map = mapRef.current;  // Mengakses referensi MapContainer
    const provinceName = layer.feature.properties.WADMPR;  // Nama provinsi yang di klik

    console.log("Provinsi diklik:", provinceName);

    if (map) {
      map.fitBounds(layer.getBounds());  // Zoom ke wilayah yang di klik

      // Filter data kabupaten yang sesuai dengan provinsi yang di klik
      const filteredKabupaten = geoKabupatenData.features.filter(kabupaten => {
        return kabupaten.properties.WADMPR === provinceName;  // Sesuaikan properti provinsi
      });

      console.log("Kabupaten yang ditemukan:", filteredKabupaten.length);

      if (filteredKabupaten.length > 0) {
        // Tampilkan data kabupaten yang sudah difilter
        setDisplayData({
          type: "FeatureCollection",
          features: filteredKabupaten,
        });
      } else {
        console.log("Kabupaten tidak ditemukan untuk provinsi:", provinceName);
      }
    }
  };

  // Fungsi untuk mengembalikan zoom ke semula saat tooltip ditutup
  const resetZoom = () => {
    const map = mapRef.current;
    if (map) {
      map.setView(initialCenter, initialZoom);  // Reset ke zoom dan pusat semula
      setDisplayData(geoIndo);  // Reset data kembali ke provinsi
    }
  };

  // Fungsi untuk setiap elemen GeoJSON
  const onEachCountry = (country, layer) => {
    const countryName = country.properties.WADMPR || country.properties.WADMKK;
    const density = country.properties.populationDensity || "N/A";

    layer.bindPopup(`${countryName}<br>Kepadatan Penduduk: ${density}`);

    layer.on({
      click: zoomToFeature,  // Zoom dan ganti layer saat provinsi di klik
      popupclose: resetZoom  // Kembali ke zoom semula saat tooltip ditutup
    });
  };

  return (
    <React.Fragment>
      <MapContainer
        ref={mapRef}  // Tambahkan referensi ke MapContainer
        style={{ height: "50vh" }} 
        zoom={initialZoom}  // Gunakan zoom awal
        center={initialCenter}  // Gunakan center awal
        dragging={false}  // Nonaktifkan dragging
        zoomControl={false}  // Nonaktifkan kontrol zoom
        scrollWheelZoom={false}  // Nonaktifkan zoom dengan scroll
        doubleClickZoom={false}  // Nonaktifkan zoom dengan double-click
        boxZoom={false}  // Nonaktifkan zoom dengan box
        touchZoom={false}  // Nonaktifkan zoom dengan sentuhan (pada perangkat mobile)
      >
        <GeoJSON 
          style={countryStyle}  // Gunakan style dinamis berdasarkan kepadatan penduduk
          onEachFeature={onEachCountry} 
          data={displayData.features}  // Gunakan state displayData
        />
      </MapContainer>
    </React.Fragment>
  );
}

export default PolygonMaps;