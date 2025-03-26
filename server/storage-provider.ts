// This file acts as a provider for the storage instance to prevent circular dependencies
import { IStorage } from "./storage";
import { hybridStorage } from "./hybrid-storage";

// Default to hybridStorage
let currentStorage: IStorage = hybridStorage;

// Set the storage instance to use
export function setStorage(storage: IStorage) {
  currentStorage = storage;
}

// Get the current storage instance
export function getStorage(): IStorage {
  return currentStorage;
}