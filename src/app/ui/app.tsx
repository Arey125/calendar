import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { Box, CssBaseline } from '@mui/material';

export const App = () => (
  <div>
    <CssBaseline />
    <Box width="60vw">
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" locale="ru" />
    </Box>
  </div>
);
