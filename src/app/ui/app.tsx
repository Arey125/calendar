import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import {
  AppBar,
  Box,
  CssBaseline,
  Stack,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { theme as appTheme } from 'shared/config';
import { useData } from 'shared/model';
import { AutoScroll } from 'shared/ui';
import { Icon } from './assets';
import { Events, Names, CategorySelect } from './components';
import './index.css';

const FullCalendarBox = styled(Box)(({ theme }) => ({
  '& button': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.dark} !important`,
  },
}));

export const App = () => {
  const ref = useRef<FullCalendar>(null);

  const [currentDate, setCurrentDate] = useState<string | null>(null);

  const {
    currentHolydays,
    currentNames,
    events,
    weekends,
    categories,
    currentCategory,
    setCurrentCategory,
  } = useData(currentDate);

  const shortDate = useMemo(() => {
    if (!currentDate) {
      return null;
    }
    return new Date(Date.parse(currentDate)).toLocaleDateString('ru', {
      day: 'numeric',
      month: 'long',
    });
  }, [currentDate]);

  const setDate = (dateStr: string) => {
    setCurrentDate(dateStr);
  };

  useLayoutEffect(() => {
    const calendarApi = ref.current?.getApi();
    if (calendarApi) {
      const today = Date.now();
      if (today < Date.parse('2024-01-01')) {
        calendarApi.gotoDate('2024-01-01');
        setDate('2024-01-01');
      }
    }
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <img src={Icon} alt="" height="44px" />
          <Typography variant="h4" component="div" sx={{ paddingLeft: 4, fontSize: '28px' }}>
            Календарь
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{ paddingLeft: 1, fontSize: '28px', fontWeight: '600' }}
          >
            2024
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack
        position="fixed"
        height="100vh"
        width="100vw"
        zIndex={-1}
        alignItems="center"
        justifyContent="center"
      >
        {categories[currentCategory] !== undefined ? (
          <video height="100%" autoPlay muted loop key={currentCategory}>
            <source src={categories[currentCategory].video} type="video/mp4" />
          </video>
        ) : null}
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        paddingTop={2}
        height="calc(100vh - 64px)"
        sx={{ backgroundColor: '#f0f0f0dd' }}
      >
        <FullCalendarBox width="60vw">
          <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ru"
            dateClick={(info) => setDate(info.dateStr)}
            buttonText={{
              today: 'Сегодня',
            }}
            events={events.map(({ date, items }) => ({
              images: items.map(({ gif }) => gif),
              date,
            }))}
            eventBackgroundColor="transparent"
            eventBorderColor="transparent"
            eventContent={(info) =>
              (info.event.extendedProps.images as string[]).map((src) => (
                <img src={src} alt="" width="30%" />
              ))
            }
            dayCellClassNames={({ date }) =>
              weekends.some((value) => Math.abs(Number(date) - value) < 5 * 60 * 60 * 1000)
                ? 'bg-red'
                : ''
            }
            firstDay={1}
          />
        </FullCalendarBox>
        <Stack>
          <Stack paddingX={2}>
            <CategorySelect
              items={categories}
              value={currentCategory}
              setValue={setCurrentCategory}
            />
            <h2>Праздники {shortDate}</h2>
          </Stack>
          <AutoScroll key={currentDate}>
            <Events items={currentHolydays} shortDate={shortDate as string} />
            <Names items={currentNames} />
          </AutoScroll>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
