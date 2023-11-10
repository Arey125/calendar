import { Close as CloseIcon } from '@mui/icons-material';
import { Box, Modal as MuiModal, Stack, Typography, IconButton, CardMedia } from '@mui/material';

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
  currentEvent: Item | null;
  close: () => void;
  shortDate: string;
};

export const Modal = ({ currentEvent, close, shortDate }: TProps) => {
  const open = Boolean(currentEvent);

  return (
    <MuiModal
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
    </MuiModal>
  );
};
