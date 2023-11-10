import { useEffect, useState, useMemo } from 'react';

import { getValuesFromCsv } from 'shared/config';

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

type TypeItem = {
  id: string;
  name: string;
  gif: string;
  color: string;
};

type CategoryItem = {
  id: string;
  name: string;
  typeIds: string[];
  video: string;
};

type Holyday = HolydayItem & {
  type: string;
  color: string;
};

export const useData = (currentDate: string | null) => {
  const [rawHolydays, setRawHolydays] = useState<HolydayItem[]>([]);
  const [names, setNames] = useState<NamesItem[]>([]);
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [weekends, setWeekends] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const holydays = useMemo<Holyday[]>(() => {
    if (!rawHolydays.length || !types.length) {
      return [];
    }
    return rawHolydays.map((item) => {
      const type = types.find(({ name }) => name === item.category);
      return {
        ...item,
        type: type?.id ?? '',
        color: type?.color ?? '#ffffff',
      };
    });
  }, [rawHolydays, types]);

  useEffect(() => {
    void (async () => {
      setRawHolydays(
        (await getValuesFromCsv('/holyday.csv')).map(
          ([date, category, title, description, image]) => ({
            date,
            category,
            title,
            description,
            image,
          }),
        ),
      );
      setNames(
        (await getValuesFromCsv('/names.csv')).map(([date, nameValues]) => ({
          date,
          names: nameValues,
        })),
      );
      setTypes(
        (await getValuesFromCsv('/types.csv')).map(([id, name, gif, color]) => ({
          id,
          name,
          gif,
          color,
        })),
      );
      setWeekends((await getValuesFromCsv('/weekends.csv')).map(([value]) => value));
      setCategories(
        (await getValuesFromCsv('/category.csv')).map(([id, name, typeIds, video]) => ({
          id,
          name,
          typeIds: typeIds?.split(','),
          video,
        })),
      );
    })();
  }, []);

  const localeDate = useMemo(() => {
    if (!currentDate) {
      return null;
    }
    return new Date(Date.parse(currentDate)).toLocaleDateString('ru', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }, [currentDate]);

  const currentHolydays = useMemo(
    () => holydays.filter((item) => item.date === localeDate),
    [localeDate, holydays],
  );
  console.log(currentHolydays);

  const currentNames = useMemo(() => {
    const item = names.find(({ date }) => date === localeDate);
    if (!item) {
      return [];
    }
    return item.names.split(', ');
  }, [localeDate, names]);

  return {
    currentHolydays,
    currentNames,
    types,
    weekends,
    categories,
  };
};
