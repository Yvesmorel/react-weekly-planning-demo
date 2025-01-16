import { DragEvent } from "react";
import { TaskFeildsType } from "react-weekly-planning/definitions";

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


export const Groups = [
  {
    id: "1",
    label: "ReactJS",
    imageUrl: "./react.svg",
    tasks: ["Hooks", "Context API", "Redux", "React-memo"],
    type: "code",
    color: "#01a3c0d1",
  },
  {
    id: "2",
    label: "JavaScript",
    imageUrl: "./javascript.svg",
    tasks: ["Class", "Promise", "Strict mode", "Closures"],
    type: "code",
    color: "#cdbb28",
  },
  {
    id: "3",
    label: "Sport",
    imageUrl: "./sport.svg",
    tasks: ["push ups", "stretching"],
    type: "health",
    color: "#FA7070",
  },
];
