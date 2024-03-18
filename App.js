import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { app, database, storage } from './firebase'; 
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { storge } from './firebase'
import { ref, uploadBytes } from 'firebase/storage'
import { getStorage, uploadString, getDownloadURL } from 'firebase/storage';
import ClearCache from 'react-native-clear-cache';



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

  async function selectImage(location) {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log("ImagePicker result:", result);
  
      if (result.cancelled) {
        console.log("Image selection cancelled.");
        return;
      }
  
      const selectedImage = result.assets[0];
      if (!selectedImage.uri) {
        throw new Error("Selected image URI is undefined.");
      }
  
      console.log("Selected image result:", selectedImage.uri);
  
      // Upload image to Firebase Storage
      uploadImage(selectedImage.uri, location);
    } catch (error) {
      console.error("Error selecting image:", error);
      alert("Der opstod en fejl under valg af billedet. Prøv igen senere.");
    }
  }
  
  async function uploadImage(imageUri, location) {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageName = new Date().getTime() + '.jpg';
      const storageRef = ref(storage, 'images/' + imageName);
    
      // Brug uploadBytes til at uploade blob-data
      await uploadBytes(storageRef, blob);
    
      // Få download URL'en for det uploaded billede
      const downloadURL = await getDownloadURL(storageRef);
    
      // Gem GPS-lokationen og download URL'en i Firestore
      const markersCollection = collection(database, 'markers');
      await addDoc(markersCollection, {
        latitude: location.latitude,
        longitude: location.longitude,
        imageURL: downloadURL
      });
    } catch (error) {
      console.error("Error uploading image: ", error);
      // Vis fejlmeddelelse til brugeren
      alert("Der opstod en fejl under upload af billedet. Prøv igen senere.");
    }
  }

  function addMarker(data) {
    const { latitude, longitude } = data.nativeEvent.coordinate;
    const newMarker = {
      coordinate: { latitude, longitude },
      key: data.nativeEvent.timestamp,
      title: "Great place"
    };
    setMarkers([...markers, newMarker]);
    
    // Kald selectImage med lokationen for den nye markør
    console.log("Marker location:", { latitude, longitude });
    selectImage({ latitude, longitude }); // Overfør lokationen som et objekt
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
