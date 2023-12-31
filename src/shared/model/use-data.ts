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

export type CategoryItem = {
  id: string;
  name: string;
  typeIds: string[];
  video: string;
};

type Holyday = HolydayItem & {
  type: string;
  color: string;
  gif: string;
};

export const useData = (currentDate: string | null) => {
  const [rawHolydays, setRawHolydays] = useState<HolydayItem[]>([]);
  const [names, setNames] = useState<NamesItem[]>([]);
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [weekends, setWeekends] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState(0);

  const holydays = useMemo<Holyday[]>(() => {
    if (!rawHolydays.length || !types.length) {
      return [];
    }
    return rawHolydays
      .map((item) => {
        const type = types.find(({ name }) => name === item.category);
        const [day, month, year] = item.date.split('.');
        const date = `${year}-${month}-${day}`;
        return {
          ...item,
          type: type?.id ?? '',
          color: type?.color ?? '#ffffff',
          gif: type?.gif ?? '',
          date,
        };
      })
      .filter((item) => categories[currentCategory]?.typeIds.includes(item.type));
  }, [rawHolydays, types, currentCategory, categories]);

  const events = useMemo(() => {
    const eventObject: Record<string, Holyday[]> = {};
    holydays.forEach((item) => {
      if (!eventObject[item.date]) {
        eventObject[item.date] = [];
      }
      if (!item.gif.length) {
        return;
      }
      if (eventObject[item.date].findIndex(({ gif }) => gif === item.gif) !== -1) {
        return;
      }
      eventObject[item.date].push(item);
    });
    return Object.entries(eventObject).map(([date, items]) => ({
      date,
      items: items.sort((a, b) => Number(a.type) - Number(b.type)).slice(0, 3),
    }));
  }, [holydays]);

  useEffect(() => {
    void (async () => {
      setRawHolydays(
        (await getValuesFromCsv('./holyday.csv')).map(
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
        (await getValuesFromCsv('./names.csv')).map(([rawDate, nameValues]) => {
          const [day, month, year] = rawDate.split('.');
          const date = `${year}-${month}-${day}`;
          return {
            date,
            names: nameValues,
          };
        }),
      );
      setTypes(
        (await getValuesFromCsv('./types.csv')).map(([id, name, gif, color]) => ({
          id,
          name,
          gif,
          color,
        })),
      );
      setWeekends(
        (await getValuesFromCsv('./weekends.csv')).map(([value]) => {
          const [day, month, year] = value.split('.');
          const date = Date.parse(`${year}-${month}-${day}`);
          return date;
        }),
      );
      setCategories(
        (await getValuesFromCsv('./category.csv')).map(([id, name, typeIds, video]) => ({
          id,
          name,
          typeIds: typeIds?.split(',') ?? [],
          video,
        })),
      );
    })();
  }, []);

  const localeDate = useMemo(() => {
    if (!currentDate) {
      return null;
    }
    return currentDate;
  }, [currentDate]);

  const currentHolydays = useMemo(
    () => holydays.filter((item) => item.date === localeDate),
    [localeDate, holydays],
  );

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
    holydays,
    events,
    currentCategory,
    setCurrentCategory,
  };
};
