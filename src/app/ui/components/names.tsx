import { Paper, Stack } from '@mui/material';

type TProps = {
  items: string[];
};

export const Names = ({ items }: TProps) => (
  <>
    <h2>Именины в этот день</h2>
    {items.map((item) => (
      <Paper>
        <Stack alignItems="center">
          <h3>{item}</h3>
        </Stack>
      </Paper>
    ))}
  </>
);
