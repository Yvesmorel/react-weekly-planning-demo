import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const calculateTimeOfDayRange = (start: number, end: number) => {
  const hourToMillisecond = 3600000;
  const range = [];
  for (let i = start; i < end; i += hourToMillisecond) {
    range.push(i);
  }
  return range;
};

export function CustomDate(dateString: string) {
  // Tableau contenant les noms des jours de la semaine en anglais
  const daysOfWeek = ["Sun,", "Mon,", "Tue,", "Wed,", "Thur,", "Frid,", "Sat,"];

  // Tableau contenant les noms des mois en anglais
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Créer un objet Date à partir de la chaîne de caractères
  const date = new Date(dateString);

  // Récupérer le jour de la semaine, le jour du mois et le mois
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];

  // Formater la date dans le format 'jour_de_la_semaine jour_du_mois mois'
  const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month} ${date.getFullYear()}`;

  return formattedDate;
}
