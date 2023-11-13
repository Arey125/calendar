export const getValuesFromCsv = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    return [];
  }
  const file = await response.text();
  const lines = file.split('\r\n');
  return lines.map((line) => line.split(';'));
};

export { theme } from './theme';
