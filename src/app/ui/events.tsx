import { Close as CloseIcon } from '@mui/icons-material';
import { Box, Card, Modal, Stack, Typography, IconButton, CardMedia } from '@mui/material';
import { useCallback, useState } from 'react';

type Item = {
  date: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

const BOX_STYLE = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
  borderRadius: 2,
};

type TProps = {
  items: Item[];
  shortDate: string;
};

export const Events = ({ items, shortDate }: TProps) => {
  const [currentEvent, setCurrentEvent] = useState<Item | null>(null);
  const open = Boolean(currentEvent);
  const close = useCallback(() => setCurrentEvent(null), []);

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={BOX_STYLE}>
          <Stack direction="row" justifyContent="flex-end" overflow="auto">
            <IconButton onClick={close}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Box pb={2} px={2} maxHeight="80vh" overflow="auto">
            <Stack direction="row" justifyContent="space-between" alignItems="center" px={2}>
              <Stack>
                <Typography id="modal-modal-title" variant="h4" component="h2">
                  {currentEvent?.title}
                </Typography>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                  {shortDate}
                </Typography>
              </Stack>
              <CardMedia
                component="img"
                image={currentEvent?.image}
                alt=""
                sx={{ width: '200px', borderRadius: 2 }}
              />
            </Stack>
            <Typography id="modal-modal-description" sx={{ mt: 2, px: 2 }}>
              {currentEvent?.description.split('\n').map((item) => (
                <p>{item}</p>
              ))}
            </Typography>
          </Box>
        </Box>
      </Modal>
      <Stack spacing={2} paddingBottom={3} px={2} borderBottom="2px solid #888">
        <h2>Праздники в этот день</h2>
        {items.map((item) => (
          <Card variant="elevation" onClick={() => setCurrentEvent(item)}>
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
