export const formatTime = (dbDateString) => {
  if (!dbDateString) return '--:--';

  // Si por algún motivo llega un objeto Date en lugar de string, lo pasamos a ISO
  const str = typeof dbDateString === 'string' 
    ? dbDateString 
    : dbDateString.toISOString();

  // HH:mm ("2026-11-16 14:30:00" o "2026-11-16T14:30:00.000Z" = "14:30")
  const match = str.match(/(\d{2}:\d{2})/);
  
  return match ? match[1] : '--:--';
};