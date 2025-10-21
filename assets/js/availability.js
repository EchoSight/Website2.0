document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.querySelector('[data-availability-calendar]');
  if (!calendar) return;

  const grid = calendar.querySelector('[data-calendar-grid]');
  const monthLabel = calendar.querySelector('[data-calendar-month]');
  const prevBtn = calendar.querySelector('[data-calendar-prev]');
  const nextBtn = calendar.querySelector('[data-calendar-next]');
  const messageEl = calendar.querySelector('[data-calendar-message]');
  const statusEl = calendar.querySelector('[data-calendar-status]');
  const updatedEl = calendar.querySelector('[data-calendar-updated]');

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const statusLabels = {
    available: 'Available',
    limited: 'Limited availability',
    unavailable: 'Fully booked',
  };

  let availabilityByDate = new Map();
  let generalNotes = '';
  let selectedButton = null;

  const currentMonth = new Date();
  currentMonth.setDate(1);

  const toIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseIsoDate = (iso) => {
    if (typeof iso !== 'string') return null;
    const [yearStr, monthStr, dayStr] = iso.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return null;
    }
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date;
  };

  const formatMonth = (date) =>
    date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });

  const formatLongDate = (date) =>
    date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatUpdated = (value) => {
    const date = parseIsoDate(value);
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const setStatusMessage = (entry, dateObj) => {
    if (!statusEl) return;
    if (entry) {
      const label = statusLabels[entry.status] || 'Available';
      const details = entry.note ? ` ${entry.note}` : '';
      statusEl.textContent = `${formatLongDate(dateObj)}: ${label}.${details}`;
    } else {
      statusEl.textContent = `${formatLongDate(dateObj)}: Contact us to confirm availability.`;
    }
  };

  const setSelectedDay = (button, entry, dateObj) => {
    if (selectedButton) {
      selectedButton.classList.remove('availability-calendar__day--selected');
    }
    selectedButton = button;
    if (selectedButton) {
      selectedButton.classList.add('availability-calendar__day--selected');
    }
    setStatusMessage(entry, dateObj);
  };

  const renderCalendar = () => {
    if (!grid || !monthLabel) return;
    grid.innerHTML = '';

    dayNames.forEach((name) => {
      const header = document.createElement('div');
      header.className = 'availability-calendar__day-name';
      header.setAttribute('role', 'columnheader');
      header.textContent = name;
      grid.appendChild(header);
    });

    const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // convert Sunday-first to Monday-first
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const todayIso = toIsoDate(new Date());

    for (let i = 0; i < startOffset; i += 1) {
      const filler = document.createElement('div');
      filler.className = 'availability-calendar__day availability-calendar__day--filler';
      filler.setAttribute('aria-hidden', 'true');
      grid.appendChild(filler);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const iso = toIsoDate(dateObj);
      const entry = availabilityByDate.get(iso);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'availability-calendar__day';
      button.dataset.date = iso;
      button.setAttribute('role', 'gridcell');

      const dateSpan = document.createElement('span');
      dateSpan.className = 'availability-calendar__date';
      dateSpan.textContent = String(day);
      button.appendChild(dateSpan);

      if (iso === todayIso) {
        button.classList.add('availability-calendar__day--today');
      }

      if (entry) {
        const statusClass = `availability-calendar__day--${entry.status}`;
        button.classList.add(statusClass);
        const badge = document.createElement('span');
        badge.className = 'availability-calendar__badge';
        badge.textContent = statusLabels[entry.status] || entry.status;
        button.appendChild(badge);

        if (entry.note) {
          const note = document.createElement('span');
          note.className = 'availability-calendar__note';
          note.textContent = entry.note;
          button.appendChild(note);
        }

        button.setAttribute(
          'aria-label',
          `${formatLongDate(dateObj)}. ${statusLabels[entry.status] || entry.status}.${entry.note ? ` ${entry.note}` : ''}`,
        );
      } else {
        button.classList.add('availability-calendar__day--no-entry');
        button.setAttribute('aria-label', `${formatLongDate(dateObj)}. Contact us to confirm availability.`);
      }

      button.addEventListener('click', () => setSelectedDay(button, entry, dateObj));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          setSelectedDay(button, entry, dateObj);
        }
      });
      button.addEventListener('focus', () => setStatusMessage(entry, dateObj));

      grid.appendChild(button);
    }

    const cellsInRow = dayNames.length;
    const remainder = grid.children.length % cellsInRow;
    if (remainder !== 0) {
      for (let i = remainder; i < cellsInRow; i += 1) {
        const filler = document.createElement('div');
        filler.className = 'availability-calendar__day availability-calendar__day--filler';
        filler.setAttribute('aria-hidden', 'true');
        grid.appendChild(filler);
      }
    }

    monthLabel.textContent = formatMonth(currentMonth);

    if (statusEl) {
      statusEl.textContent = 'Select a highlighted date to see availability details.';
    }

    selectedButton = null;

    const preferredSelection =
      grid.querySelector('.availability-calendar__day--available') ||
      grid.querySelector('.availability-calendar__day--limited');

    if (preferredSelection && preferredSelection.tagName === 'BUTTON') {
      const iso = preferredSelection.dataset.date;
      const dateForSelection = iso ? parseIsoDate(iso) : null;
      const entry = iso ? availabilityByDate.get(iso) : null;
      if (dateForSelection) {
        setSelectedDay(preferredSelection, entry, dateForSelection);
      }
    } else if (statusEl && generalNotes) {
      statusEl.textContent = generalNotes;
    }
  };

  const handlePrev = () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
  };

  const handleNext = () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
  };

  const loadAvailability = async () => {
    try {
      calendar.classList.remove('availability-calendar--error');
      calendar.classList.add('availability-calendar--loading');
      const response = await fetch('assets/data/availability.json', { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error('Failed to load availability');
      }
      const data = await response.json();
      availabilityByDate = new Map();
      if (Array.isArray(data?.availability)) {
        data.availability.forEach((item) => {
          const iso = typeof item?.date === 'string' ? item.date : null;
          const parsedDate = iso ? parseIsoDate(iso) : null;
          if (!iso || !parsedDate) {
            return;
          }
          const status = typeof item.status === 'string' ? item.status.toLowerCase() : 'limited';
          const normalisedStatus = ['available', 'limited', 'unavailable'].includes(status) ? status : 'limited';
          availabilityByDate.set(iso, {
            status: normalisedStatus,
            note: typeof item.note === 'string' ? item.note : '',
          });
        });
      }

      generalNotes = typeof data?.notes === 'string' ? data.notes : '';
      const updatedValue = typeof data?.updated === 'string' ? data.updated : '';

      if (messageEl) {
        messageEl.textContent =
          generalNotes || 'Slots marked available tend to fill quickly—let us know if you need a different date.';
      }

      if (updatedEl) {
        const formatted = formatUpdated(updatedValue);
        updatedEl.textContent = formatted ? `Calendar updated ${formatted}.` : '';
      }

      renderCalendar();
    } catch (error) {
      calendar.classList.add('availability-calendar--error');
      if (statusEl) {
        statusEl.textContent =
          'We could not load availability right now. Email or call us and we will confirm a slot manually.';
      }
    } finally {
      calendar.classList.remove('availability-calendar--loading');
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', handlePrev);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', handleNext);
  }

  loadAvailability();
});
