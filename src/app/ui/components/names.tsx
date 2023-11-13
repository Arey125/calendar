import { Paper, Stack } from '@mui/material';

type TProps = {
  items: string[];
};

export const Names = ({ items }: TProps) => (
  <Stack spacing={2}>
    <h2>Именины в этот день</h2>
    {items.map((item) => (
      <Paper sx={{backgroundColor: '#fff8'}}>
        <Stack alignItems="center">
          <h3>{item}</h3>
        </Stack>
      </Paper>
    ))}
  </Stack>
);
