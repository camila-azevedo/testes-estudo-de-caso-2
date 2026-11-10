export function formatEventDate(dateTime) {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getEventYear(dateTime) {
  const date = new Date(dateTime);
  return Number.isNaN(date.getTime()) ? "" : date.getFullYear();
}

export function sortEventsByDate(events) {
  return [...events].sort((first, second) => {
    const firstDate = new Date(first.dateTime).getTime();
    const secondDate = new Date(second.dateTime).getTime();
    const firstValid = Number.isFinite(firstDate);
    const secondValid = Number.isFinite(secondDate);

    if (!firstValid && !secondValid) return 0;
    if (!firstValid) return 1;
    if (!secondValid) return -1;
    return firstDate - secondDate;
  });
}
