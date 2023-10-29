import HOLYDAYS_JSON from './holydays.json';
import NAMES_JSON from './names.json';

type HolydayItem = {
  date: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

type NamesItem = {
  date: string;
  names: string;
};

export const HOLYDAYS = HOLYDAYS_JSON as HolydayItem[];
export const NAMES = NAMES_JSON as NamesItem[];
export { theme } from './theme';
