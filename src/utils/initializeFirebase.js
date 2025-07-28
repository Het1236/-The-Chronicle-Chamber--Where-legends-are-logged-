import { db, auth } from '../config/firebase';
import { collection, doc, setDoc, getDocs, getDoc, updateDoc } from 'firebase/firestore';

// Avengers data from HeroSelection.jsx
const avengers = [
  {
    id: "spiderman",
    name: "Spider-Man",
    alias: "Peter Parker",
    image1: "/src/assets/Spidy3.jpeg",
    image2: "/src/assets/Spidy4.jpg",
    image3: "/src/assets/Spidy2.jpg",
    quote: "With great power comes great responsibility.",
    basicInfo: {
      realName: "Peter Parker",
      powers: "Spider Powers",
      location: "New York City",
    },
    detailedInfo: {
      biography:
        "Bitten by a radioactive spider, Peter Parker gained incredible powers and uses them to protect New York City.",
      abilities: [
        "Wall-crawling",
        "Spider-sense",
        "Super strength",
        "Web-slinging",
        "Enhanced agility",
      ],
      equipment: ["Web-shooters", "Spider-suit", "Various gadgets"],
      affiliation: "Avengers, Daily Bugle",
      status: "Active Hero",
    },
  },
  {
    id: "ironman",
    name: "Iron Man",
    alias: "Tony Stark",
    image1: "/src/assets/IronMan2.jpg",
    image2: "/src/assets/IronMan6.jpg",
    image3: "/src/assets/IronMan3.jpg",
    quote: "I am Iron Man.",
    basicInfo: {
      realName: "Tony Stark",
      powers: "Powered Armor",
      location: "Malibu, California",
    },
    detailedInfo: {
      biography:
        "Genius billionaire inventor who created the Iron Man armor to become one of the world's greatest heroes.",
      abilities: [
        "Genius intellect",
        "Master engineer",
        "Strategic planning",
        "Leadership",
      ],
      equipment: [
        "Iron Man suits",
        "Arc reactor",
        "FRIDAY AI",
        "Stark Industries tech",
      ],
      affiliation: "Avengers, Stark Industries",
      status: "Active Hero",
    },
  },
  {
    id: "thor",
    name: "Thor",
    alias: "God of Thunder",
    image1: "/src/assets/Thor3.jpg",
    image2: "/src/assets/Thor4.jpg",
    image3: "/src/assets/Thor2.jpg",
    quote: "I am Thor, God of Thunder!",
    basicInfo: {
      realName: "Thor Odinson",
      powers: "Asgardian God",
      location: "Asgard/Earth",
    },
    detailedInfo: {
      biography:
        "The God of Thunder from Asgard, wielding the enchanted hammer Mjolnir to protect both Earth and the Nine Realms.",
      abilities: [
        "Weather control",
        "Superhuman strength",
        "Flight",
        "Immortality",
        "Combat mastery",
      ],
      equipment: ["Mjolnir", "Stormbreaker", "Asgardian armor"],
      affiliation: "Avengers, Asgard",
      status: "Active Hero",
    },
  },
  {
    id: "doctorstrange",
    name: "Doctor Strange",
    alias: "Stephen Strange",
    image1: "/src/assets/DrStrange2.jpg",
    image2: "/src/assets/DrStrange4.jpg",
    image3: "/src/assets/DrStrange3.jpg",
    quote: "The bill comes due. Always.",
    basicInfo: {
      realName: "Stephen Strange",
      powers: "Master of Mystic Arts",
      location: "Sanctum Sanctorum",
    },
    detailedInfo: {
      biography:
        "Former neurosurgeon turned Master of the Mystic Arts, protecting Earth from mystical and interdimensional threats.",
      abilities: [
        "Magic mastery",
        "Time manipulation",
        "Astral projection",
        "Portal creation",
        "Reality alteration",
      ],
      equipment: ["Cloak of Levitation", "Eye of Agamotto", "Sling Ring"],
      affiliation: "Avengers, Masters of the Mystic Arts",
      status: "Active Hero",
    },
  },
  {
    id: "scarletwitch",
    name: "Scarlet Witch",
    alias: "Wanda Maximoff",
    image1: "/src/assets/Wanda3.jpg",
    image2: "/src/assets/Wanda4.jpg",
    image3: "/src/assets/Wanda2.jpg",
    quote: "You took everything from me.",
    basicInfo: {
      realName: "Wanda Maximoff",
      powers: "Chaos Magic",
      location: "Westview/Mobile",
    },
    detailedInfo: {
      biography:
        "Powerful sorceress with reality-altering abilities, using chaos magic to protect those she loves.",
      abilities: [
        "Chaos magic",
        "Reality manipulation",
        "Telekinesis",
        "Mind control",
        "Energy projection",
      ],
      equipment: ["Darkhold knowledge", "Mystical artifacts"],
      affiliation: "Avengers, X-Men",
      status: "Active Hero",
    },
  },
];

// Function to initialize Firestore with avengers data
export const initializeAvengersInFirestore = async () => {
  try {
    // Check if avengers collection already has data
    const querySnapshot = await getDocs(collection(db, 'avengers'));
    if (querySnapshot.size > 0) {
      // console.log('Avengers collection already initialized');
      return;
    }

    // If no data exists, add the avengers
    // console.log('Initializing Avengers collection...');
    for (const avenger of avengers) {
      await setDoc(doc(db, 'avengers', avenger.id), avenger);
    }
    // console.log('Avengers collection initialized successfully');
  } catch (error) {
    console.error('Error initializing Avengers collection:', error);
  }
};

// Function to migrate existing localStorage data to Firestore
export const migrateLocalStorageToFirestore = async () => {
  try {
    // Check if we have data in localStorage
    const storedAvenger = localStorage.getItem('selectedAvenger');
    const storedMissions = localStorage.getItem('missions');
    
    // Get the current user
    const user = auth.currentUser;
    if (!user) {
      console.error('No authenticated user found, cannot migrate data');
      return false;
    }
    
    // Create or update the user document
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date()
      });
    }

    // Migrate selected avenger if exists
    if (storedAvenger) {
      const avenger = JSON.parse(storedAvenger);
      // Update the user's document with the selected avenger
      await updateDoc(userRef, { selectedAvenger: avenger });
      // console.log('Migrated selected avenger to Firestore for user:', user.uid);
    }

    // Migrate missions if exist
    if (storedMissions) {
      const missions = JSON.parse(storedMissions);
      for (const mission of missions) {
        // Create a new document with auto-generated ID
        const missionRef = doc(collection(db, 'missions'));
        await setDoc(missionRef, {
          ...mission,
          id: missionRef.id, // Override the local ID with Firestore ID
          uid: user.uid // Associate with the current user
        });
      }
      // console.log(`Migrated ${JSON.parse(storedMissions).length} missions to Firestore for user:`, user.uid);
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('selectedAvenger');
    localStorage.removeItem('missions');
    // console.log('Cleared localStorage after migration');

    return true;
  } catch (error) {
    console.error('Error migrating localStorage to Firestore:', error);
    return false;
  }
};