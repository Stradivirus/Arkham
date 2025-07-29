// frontend/src/api/investigators.ts
export interface Investigator {
  id?: number;
  korName: string;
  engName?: string;
  investigatorClass: string;
  productLine?: string;
  deckSize?: number;
  health: number;
  sanity: number;
  willpower: number;
  intellect: number;
  combat: number;
  agility: number;
  elderSignEffect?: string;
  specialAbilities?: string;
  flavorText?: string;
}

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/investigators';

export const getInvestigators = () =>
  axios.get<Investigator[]>(API_URL).then(res => res.data);

export const getInvestigator = (id: number) =>
  axios.get<Investigator>(`${API_URL}/${id}`).then(res => res.data);

export const createInvestigator = (data: Investigator) =>
  axios.post<Investigator>(API_URL, data).then(res => res.data);

export const updateInvestigator = (id: number, data: Investigator) =>
  axios.put<Investigator>(`${API_URL}/${id}`, data).then(res => res.data);

export const deleteInvestigator = (id: number) =>
  axios.delete(`${API_URL}/${id}`);