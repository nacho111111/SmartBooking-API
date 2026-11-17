import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';

export function SummaryDayMonth({ yearMonth = {}, handleDayMonth, peluqueras }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (currentDate) {
      const formattedMonth = format(currentDate, 'yyyy-MM');
      handleDayMonth(formattedMonth, peluqueras[0]);
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
          const dayData = yearMonth?.[dateKey];

          return (
            <div
              key={dateKey}
              className={`calendar-day ${dayData ? 'calendar-day--has-income' : ''}`}
            >
              <span className="calendar-day-number">{format(day, 'd')}</span>
              {dayData ? (
                <div className="calendar-amounts-list">
                  <span className="calendar-amount" title={`Total: $${dayData.total.toLocaleString('es-CL')}`}>
                    Tot: ${dayData.total.toLocaleString('es-CL')}
                  </span>
                  <span className="calendar-amount calendar-amount--biz" title={`Negocio: $${dayData.negocio.toLocaleString('es-CL')}`}>
                    Neg: ${dayData.negocio.toLocaleString('es-CL')}
                  </span>
                  <span className="calendar-amount calendar-amount--iva" title={`IVA (19%): $${dayData.iva.toLocaleString('es-CL')}`}>
                    IVA: ${dayData.iva.toLocaleString('es-CL')}
                  </span>
                </div>
              ): (
                <span className="calendar-empty-amount">-</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}