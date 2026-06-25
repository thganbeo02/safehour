export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function formatRelativeDate(isoString: string) {
  const date = new Date(isoString);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const dayDiff = Math.round(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff <= 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return `${dayDiff} days ago`;
  if (dayDiff < 14) return "1 week ago";
  return formatDate(isoString);
}
