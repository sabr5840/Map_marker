# Map Marker App

## Introduction

This React Native application utilizes `react-native-maps` to display an interactive map with the capability to add markers and upload images associated with these markers to Firebase Storage.

## Functionality

- **Map Display:** The application renders an interactive map using `react-native-maps`.
- **Marker Addition:** Users can add markers to the map by long-pressing a location on the map.
- **Image Upload:** Upon adding a marker, users can choose an image from their device, which is then uploaded to Firebase Storage. The image is linked to the respective marker and can be displayed when the marker is clicked.
- **Marker Click Handling:** Clicking on a marker displays a message box with the marker's title.

## Used Technologies

- **React Native:** A framework for building native apps using React.
- **react-native-maps:** A React Native component providing access to native map functionality on iOS and Android.
- **Expo:** An open-source toolchain for building and deploying React Native apps.
- **Firebase:** A Google platform for developing mobile and web applications. Firebase Storage and Firestore are used here for image storage and database management, respectively.
- **Expo Location:** A set of APIs for accessing device location data using Expo.
- **Expo ImagePicker:** A set of APIs for selecting images from the device's gallery using Expo.
- **React Hooks:** `useState`, `useRef`, and `useEffect` are used to manage state and lifecycle in React components.
- **React Native Clear Cache:** A package for React Native that allows cache management on the device.

## Notes

- This app requires access to the device's location to function correctly. The user must grant permission to access location when the app starts.
- Be sure to thoroughly test the app on various devices and platforms to ensure everything works as expected.