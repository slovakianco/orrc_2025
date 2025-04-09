export interface Race {
  id: number;
  name: string;
  nameRo: string;
  nameFr: string;
  nameDe: string;
  nameIt?: string;
  nameEs?: string;
  description: string;
  descriptionRo: string;
  descriptionFr: string;
  descriptionDe: string;
  descriptionIt?: string;
  descriptionEs?: string;
  distance: number;
  elevation: number;
  difficulty: string;
  date: string;
  price: number;
  imageUrl: string | null;
  raceMap: string | null;
  isemacertified?: boolean;
  isNationalChampionship?: boolean;
}