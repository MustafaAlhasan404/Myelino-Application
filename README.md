# Myelino Technical Test

This repository contains the base project for the Myelino technical test in React Native. Follow the instructions below to clone the project, install dependencies, initialize the project, and review the pre-installed packages.

---

## Table of Contents

1. [Project Cloning](#project-cloning)
2. [Dependency Installation](#dependency-installation)
3. [Project Initialization](#project-initialization)
4. [Pre-installed Packages](#pre-installed-packages)
5. [Developer Instructions](#developer-instructions)

---

## Project Cloning

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/Myelino-MVP/myelino-technical-test
```

Navigate to the project directory:

```bash
cd myelino-technical-test
```

---

## Dependency Installation

Run the following command to install the required dependencies:

```bash
npm install
```

This will install all necessary packages for the project, including both core dependencies and any pre-installed packages.

---

## Project Initialization

To start the project in development mode, use the following command:

```bash
npx react-native run-android
```

or

```bash
npx react-native run-ios
```

> **Note:** Make sure to have an Android or iOS emulator running, or connect a physical device.

For easier debugging and live reloading, you can also use:

```bash
npx expo start
```

---

## Pre-installed Packages

This project includes the following pre-installed packages:

1. **Expo Router**: For seamless navigation between screens.

   - Installed with core dependencies for navigation structure.
   - Ensure to follow [Expo Router setup instructions](https://docs.expo.dev/router/introduction/) if additional configuration is required.

2. **Axios**: For handling HTTP requests and interactions with external APIs.
   - Used for calling endpoints and managing API responses.
   - Basic setup is included for quickly making API requests.

---

## Developer Instructions

1. **State Management**: Use a global state management solution of your choice (e.g., Redux, Zustand, or Context API) to handle application-wide data, such as user sessions, API responses, and any other shared data.
2. **TypeScript**: Use TypeScript to define types based on the structure of API responses, ensuring type safety across the app.

3. **Project Structure**: Follow modular and organized folder structures for easier maintenance:

   - `components/`: Reusable UI components.
   - `app/screens/`: Separate file for each screen in the app.

4. **Figma Design Reference**: Implement screen layouts as specified in the provided Figma file.

---

For any issues or questions, refer to the documentation of the pre-installed packages or contact the project maintainer.
