import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';

export function SummaryDayMonth({ yearMonth = {}, handleDayMonth }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (currentDate) {
      const formattedMonth = format(currentDate, 'yyyy-MM');
      handleDayMonth(formattedMonth);
    }
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  let startDayOfWeek = getDay(monthStart) - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  return (
    <div className="calendar-container">
      {/* Cabecera del Mes */}
      <div className="calendar-header">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="calendar-nav-btn"
          aria-label="Mes anterior"
        >
          &larr;
        </button>
        <h2 className="calendar-title">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="calendar-nav-btn"
          aria-label="Mes siguiente"
        >
          &rarr;
        </button>
      </div>

      {/* Días de la semana */}
      <div className="calendar-weekdays">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>

      {/* Grilla de Días */}
      <div className="calendar-grid">
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {daysInMonth.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayAmount = yearMonth?.[dateKey];

          return (
            <div
              key={dateKey}
              className={`calendar-day ${dayAmount ? 'calendar-day--has-income' : ''}`}
            >
              <span className="calendar-day-number">{format(day, 'd')}</span>
              {dayAmount ? (
                <span className="calendar-amount" title={`$${dayAmount.toLocaleString('es-CL')}`}>
                  ${dayAmount.toLocaleString('es-CL')}
                </span>
              ) : (
                <span className="calendar-empty-amount">-</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}