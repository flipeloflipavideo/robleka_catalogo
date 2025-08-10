export const CATEGORIES = {
  agenda: { label: "Agendas", icon: "fas fa-book", color: "deep-blue" },
  libreta: { label: "Libretas", icon: "fas fa-book-open", color: "royal-purple" },
  etiquetas: { label: "Etiquetas", icon: "fas fa-tags", color: "violet" },
} as const;

export const STYLES = {
  minimalista: { label: "Minimalista", color: "indigo" },
  vintage: { label: "Vintage", color: "lavender" },
  moderno: { label: "Moderno", color: "plum" },
  elegante: { label: "Elegante", color: "deep-blue" },
  profesional: { label: "Profesional", color: "dark-navy" },
  creativo: { label: "Creativo", color: "violet" },
} as const;

export const COLORS = [
  { name: "azul-profundo", value: "#3E4B82", class: "bg-deep-blue" },
  { name: "morado-real", value: "#5A4C7A", class: "bg-royal-purple" },
  { name: "violeta", value: "#7B68AA", class: "bg-violet" },
  { name: "lavanda", value: "#A594C7", class: "bg-lavender" },
  { name: "índigo", value: "#4A5FCC", class: "bg-indigo" },
  { name: "ciruela", value: "#8B5A9F", class: "bg-plum" },
  { name: "azul-marino", value: "#1A2B5C", class: "bg-dark-navy" },
  { name: "amatista", value: "#9966CC", class: "bg-purple-500" },
] as const;

export const SOCIAL_PLATFORMS = {
  whatsapp: {
    name: "WhatsApp",
    icon: "fab fa-whatsapp",
    color: "bg-green-500 hover:bg-green-600",
    baseUrl: "https://wa.me/?text=",
  },
  facebook: {
    name: "Facebook",
    icon: "fab fa-facebook",
    color: "bg-blue-600 hover:bg-blue-700",
    baseUrl: "https://www.facebook.com/sharer/sharer.php?u=",
  },
  telegram: {
    name: "Telegram",
    icon: "fab fa-telegram",
    color: "bg-sky hover:bg-blue-500",
    baseUrl: "https://t.me/share/url?url=",
  },
  email: {
    name: "Email",
    icon: "fas fa-envelope",
    color: "bg-gray-600 hover:bg-gray-700",
    baseUrl: "mailto:?subject=Mira este diseño&body=",
  },
} as const;
