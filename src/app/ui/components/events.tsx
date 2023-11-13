import { Box, Card, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { Modal } from './modal';

type Item = {
  date: string;
  category: string;
  title: string;
  description: string;
  image: string;
  color: string;
};

type TProps = {
  items: Item[];
  shortDate: string;
};

export const Events = ({ items, shortDate }: TProps) => {
  const [currentEvent, setCurrentEvent] = useState<Item | null>(null);
  const close = useCallback(() => setCurrentEvent(null), []);

  return (
    <>
      <Modal currentEvent={currentEvent} close={close} shortDate={shortDate} />
      <Stack spacing={2} paddingBottom={3} borderBottom="2px solid #888">
        <h2>Праздники {shortDate}</h2>
        {items.map((item) => (
          <Card
            variant="elevation"
            onClick={() => setCurrentEvent(item)}
            sx={{ backgroundColor: item.color + '88' }}
          >
            <Box m={3} my={2}>
              <h2>{item.title}</h2>
              <div>{item.category}</div>
            </Box>
          </Card>
        ))}
      </Stack>
    </>
  );
};
