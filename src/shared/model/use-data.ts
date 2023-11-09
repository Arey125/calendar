import { useEffect, useState } from 'react';

import { getValuesFromCsv, HolydayItem, NamesItem } from 'shared/config';

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

export const useData = () => {
  const [holydays, setHolydays] = useState<HolydayItem[]>([]);
  const [names, setNames] = useState<NamesItem[]>([]);
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [weekends, setWeekends] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    void (async () => {
      setHolydays(
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

  return {
    holydays,
    names,
    types,
    weekends,
    categories,
  };
};
