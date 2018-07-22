import {AsyncStorage} from 'react-native'

const FLASH_CARDS_STORAGE_KEY = "FLASH_CARDS_STORAGE_KEY";

// Load all the decks.
export async function getDecks() {
  const data = await AsyncStorage.getItem(FLASH_CARDS_STORAGE_KEY);
  if (data) {
    return JSON.parse(data)
  } else {
    return {};
  }
}

// Load deck by name.
export async function getDeck(title) {
  const data = await AsyncStorage.getItem(FLASH_CARDS_STORAGE_KEY);
  const decks = await getDecks();
  return decks[title];
}

// Save all decks.
export async function updateDecks(decks) {
  await AsyncStorage.setItem(FLASH_CARDS_STORAGE_KEY, JSON.stringify(decks))
}

// Delete all the data.
export async function resetData() {
  await AsyncStorage.setItem(FLASH_CARDS_STORAGE_KEY, '{}')
}
