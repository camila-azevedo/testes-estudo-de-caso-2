export function getEventCountdown(dateTime, now) {
  const difference = new Date(dateTime).getTime() - now;
  if (Number.isNaN(difference)) return "Data do evento indisponível";
  if (difference <= 0) return "Este evento já começou";

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `Começa em ${days}d ${hours}h ${minutes}min ${seconds}s`;
}
