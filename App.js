import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { app, database } from './firebase'; 
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
    latitudeDelta: 20,
    longitudeDelta: 20
  });

  const mapRef = useRef(null); 
  const locationSub = useRef(null);

  useEffect(() => {
    async function startListening() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert("No access to location");
        return;
      }
      locationSub.current = await Location.watchPositionAsync({
        distanceInterval: 100,
        accuracy: Location.Accuracy.High
      }, (location) => {
        const newRegion = {
          latitude: location.coords.latitude, 
          longitude: location.coords.longitude,
          latitudeDelta: 20,
          longitudeDelta: 20
        };
        setRegion(newRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion);
        }
      });
    }
    startListening();
    return () => {
      if (locationSub.current) {
        locationSub.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    const markersCollection = collection(database, 'markers');
    const unsubscribe = onSnapshot(markersCollection, (snapshot) => {
      const updatedMarkers = [];
      snapshot.forEach((doc) => {
        const markerData = doc.data();
        updatedMarkers.push({
          coordinate: { latitude: markerData.latitude, longitude: markerData.longitude },
          key: doc.id,
          title: "Great place"
        });
      });
      setMarkers(updatedMarkers);
    });
    return () => unsubscribe();
  }, []);

  async function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    const markersCollection = collection(database, 'markers');
    try {
      const newMarkerRef = await addDoc(markersCollection, {
        latitude: latitude,
        longitude: longitude
      });
      console.log("Marker added with ID: ", newMarkerRef.id);
    } catch (error) {
      console.error("Error adding marker: ", error);
      alert("An error occurred while adding the marker. Please try again later.");
    }
  }

  function onMarkerPressed(text) {
    alert("You pressed " + text);
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onLongPress={addMarker}
      >
        {markers.map((marker, index) => (
          <Marker
            coordinate={marker.coordinate}
            key={index}
            title={marker.title}
            onPress={() => onMarkerPressed(marker.title)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
