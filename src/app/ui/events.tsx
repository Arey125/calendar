import { Box, Card, Stack } from '@mui/material';

type Item = {
  date: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

type TProps = {
  items: Item[];
};

export const Events = ({ items }: TProps) => (
  <Stack spacing={2} paddingBottom={3} px={2} borderBottom="2px solid #888">
    <h2>Праздники в этот день</h2>
    {items.map((item) => (
      <Card variant="elevation">
        <Box m={3} my={2}>
          <h2>{item.category}</h2>
          <div>{item.title}</div>
        </Box>
      </Card>
    ))}
  </Stack>
);
