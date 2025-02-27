# NUS-Orbital NUtriSync App

[Final Report](https://docs.google.com/document/d/1FRf3A0Skvn0mip7sL25c2SJGU1BjRECCW_7y1wJMBKk/edit?usp=drive_link)

This project showcases the development of NutriSync, a fitness and nutrition tracking application.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Cloning Repository

1. Using Git Clone

   ```bash
   git clone <repository link>
   ```

## Get started

1. Install Android Emulator or Expo-Go Mobile to test application locally

   [Download Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

   [Download Expo-Go Mobile](https://expo.dev/go)

2. Install Node.js (Ensure that the Node.js version has LTS, those are stable with npm)

   [Node.js Installer](https://nodejs.org/en/download/package-manager)

3. Open the cloned repository folder in an IDE and install dependencies

   ```bash
   npm install
   ```

4. Start the app

   ```bash
    npx expo start
   ```

## Launching NUtriSync Application

After the app has started, press 'A' to launch the Android Emulator

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


Technologies Used:
- React Native (TypeScript): For building the mobile application interface.
- Expo-Go & Android Emulator: For development, testing, and deployment.
- FastAPI & Flask (Python): To run the diet recommendation model and handle backend logic.
- Docker & Docker-Compose: To containerize multiple APIs for seamless deployment on Heroku.
- Supabase: For user authentication and managing SQL databases.
- FatSecretAPI: To retrieve nutritional data for calorie tracking and diet recommendations.
- Axios: To fetch real-time gym crowdedness data from NUS Pool and Gym Traffic websites.
