# Firebase Setup Guide for Avengers Mission Log

## Overview

This guide will help you set up Firebase for the Avengers Mission Log application. The application uses Firebase Firestore to store and manage data, replacing the previous localStorage implementation.

## Firebase Collection Structure

The application uses the following Firestore collections:

1. **avengers** - Stores information about all available heroes
   - Document ID: Hero ID (e.g., "spiderman", "ironman")
   - Fields:
     - `id`: String - Unique identifier for the hero
     - `name`: String - Hero's name (e.g., "Spider-Man")
     - `alias`: String - Hero's alias (e.g., "Peter Parker")
     - `image1`, `image2`, `image3`: String - URLs to hero images
     - `quote`: String - Hero's quote
     - `basicInfo`: Object - Basic information about the hero
       - `realName`: String - Hero's real name
       - `powers`: String - Hero's powers
       - `location`: String - Hero's location
     - `detailedInfo`: Object - Detailed information about the hero
       - `biography`: String - Hero's biography
       - `abilities`: Array - List of hero's abilities
       - `equipment`: Array - List of hero's equipment
       - `affiliation`: String - Hero's affiliations
       - `status`: String - Hero's current status

2. **missions** - Stores all mission data
   - Document ID: Auto-generated
   - Fields:
     - `id`: String - Unique identifier for the mission (Firestore document ID)
     - `title`: String - Mission title
     - `location`: String - Mission location
     - `date`: String - Mission date
     - `priority`: String - Mission priority ("Low", "Medium", "High")
     - `description`: String - Mission description
     - `threat`: String - Threat level ("Low", "Medium", "High", "Critical")
     - `duration`: String - Mission duration
     - `hero`: String - Hero's name
     - `heroId`: String - Hero's ID
     - `heroImage`: String - URL to hero's image
     - `timestamp`: String - Timestamp when the mission was created

3. **userPreferences** - Stores user preferences
   - Document ID: "selectedAvenger"
   - Fields:
     - `avenger`: Object - The currently selected avenger

## Setup Instructions

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Give your project a name (e.g., "Avengers Mission Log")
   - Enable Google Analytics if desired
   - Click "Create project"

2. **Set up Firestore Database**:
   - In your Firebase project, go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" for development (you can change this later)
   - Select a location for your database
   - Click "Enable"

3. **Register your Web App**:
   - In your Firebase project, click on the gear icon next to "Project Overview" and select "Project settings"
   - Scroll down to "Your apps" and click the web icon (</>) to add a web app
   - Register your app with a nickname (e.g., "Avengers Mission Log Web")
   - Click "Register app"
   - Copy the Firebase configuration object

4. **Update Firebase Configuration**:
   - Open `src/config/firebase.js` in your project
   - Replace the existing `firebaseConfig` object with your own configuration

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

5. **Install Firebase SDK**:
   - Run the following command in your project directory:
   ```
   npm install firebase
   ```

## Data Migration

When you first run the application after setting up Firebase, it will automatically:

1. Initialize the `avengers` collection with the default heroes if it doesn't exist
2. Migrate any existing data from localStorage to Firestore
3. Clear localStorage after successful migration

This migration happens in the `App.jsx` component using functions from `src/utils/initializeFirebase.js`.

## Firebase Service Functions

The application uses the following Firebase service functions defined in `src/services/firebaseService.js`:

### Avenger Functions

- `getAvengers()` - Retrieves all avengers from Firestore
- `getAvengerById(id)` - Retrieves a specific avenger by ID
- `saveSelectedAvenger(avenger)` - Saves the selected avenger to Firestore
- `getSelectedAvenger()` - Retrieves the selected avenger from Firestore

### Mission Functions

- `getMissions()` - Retrieves all missions from Firestore
- `getMissionsByHeroId(heroId)` - Retrieves missions for a specific hero
- `addMission(mission)` - Adds a new mission to Firestore
- `updateMission(mission)` - Updates an existing mission in Firestore
- `deleteMission(id)` - Deletes a mission from Firestore

## Security Rules

For production, you should update your Firestore security rules. Here's a basic example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Base rule - deny all by default
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Allow read access to avengers collection for all authenticated users
    match /avengers/{avengerId} {
      allow read: if request.auth != null;
      allow write: if false; // Only allow admin to write to avengers collection
    }
    
    // User-specific data
    match /users/{userId} {
      // Allow users to read and write only their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Mission data - users can only access their own missions
    match /missions/{missionId} {
      allow read: if request.auth != null && resource.data.uid == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
  }
}

// These rules have been updated to enforce user-specific access control.
// Copy these rules to your Firebase console's Firestore Rules section.
```

## Troubleshooting

- If you encounter CORS issues, make sure your Firebase project has the correct domain whitelisted
- If data isn't loading, check the browser console for errors and verify your Firebase configuration
- If you need to reset your data, you can manually delete documents in the Firebase Console

## Next Steps

- Add user authentication to secure the application
- Implement real-time updates using Firestore listeners
- Add cloud functions for advanced features