export type HolydayItem = {
  date: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

export type NamesItem = {
  date: string;
  names: string;
};

export const getValuesFromCsv = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    return [];
  }
  const file = await response.text();
  const lines = file.split('\n');
  return lines.map((line) => line.split(';'));
};

export { theme } from './theme';
