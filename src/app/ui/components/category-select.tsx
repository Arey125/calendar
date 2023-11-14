import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { CategoryItem } from 'shared/model';

type TProps = {
  items: CategoryItem[];
  value: number;
  setValue: (value: number) => void;
};

export const CategorySelect = ({ items, value, setValue }: TProps) => (
  <FormControl>
    <InputLabel id="demo-simple-select-label">Выбор календаря</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      label="Выбор календаря"
      onChange={({ target }) => {
        setValue(Number(target.value));
      }}
    >
      {items.map((item, index) => (
        <MenuItem value={index}>{item.name}</MenuItem>
      ))}
    </Select>
  </FormControl>
);
