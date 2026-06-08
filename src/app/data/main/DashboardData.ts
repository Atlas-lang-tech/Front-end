export interface DashboardStat {
  id: number
  title: string
  value: string
  icon: string
  color: "blue" | "green" | "orange" | "red"
}

export interface NewsItem {
  id: number
  title: string
  excerpt: string
  date: string
  tag: string
  tagVariant: "default" | "success" | "pending" | "secondary"
}

export interface ScheduleItem {
  id: number
  time: string
  title: string
  level: string
  mentor: string
}

export interface ContinueLearning {
  title: string
  language: string
  level: string
  icon: string
  progress: number
  lessonsLeft: number
}

export const dashboardStats: DashboardStat[] = [
  { id: 1, title: "Hours spent", value: "24.9", icon: "clock", color: "blue" },
  { id: 2, title: "In progress", value: "8", icon: "book-open", color: "orange" },
  { id: 3, title: "Completed", value: "12", icon: "circle-check", color: "green" },
  { id: 4, title: "Day streak", value: "5", icon: "flame", color: "red" },
]

export const continueLearning: ContinueLearning = {
  title: "English Grammar in Use",
  language: "English",
  level: "B1",
  icon: "book-marked",
  progress: 68,
  lessonsLeft: 4,
}

export const todaySchedule: ScheduleItem[] = [
  {
    id: 1,
    time: "10:30 — 12:00",
    title: "Technical English for Beginners",
    level: "Beginner",
    mentor: "Kristin Watson",
  },
  {
    id: 2,
    time: "13:00 — 14:00",
    title: "English punctuation made easy",
    level: "Advanced",
    mentor: "Cody Fisher",
  },
  {
    id: 3,
    time: "16:00 — 17:00",
    title: "Spanish for Travelers",
    level: "Beginner",
    mentor: "Jacob Jones",
  },
]

export const newsFeed: NewsItem[] = [
  {
    id: 1,
    title: "New Japanese N4 course is live",
    excerpt: "Grammar, vocabulary and listening practice to help you pass the JLPT N4 exam.",
    date: "2 hours ago",
    tag: "New course",
    tagVariant: "success",
  },
  {
    id: 2,
    title: "Streak rewards are here",
    excerpt: "Keep your daily streak and unlock badges and bonus lessons along the way.",
    date: "Yesterday",
    tag: "Feature",
    tagVariant: "secondary",
  },
  {
    id: 3,
    title: "Maintenance scheduled for Sunday",
    excerpt: "The platform will be briefly unavailable from 02:00 to 03:00 UTC for updates.",
    date: "2 days ago",
    tag: "Notice",
    tagVariant: "pending",
  },
  {
    id: 4,
    title: "Meet your new Spanish mentors",
    excerpt: "Three native speakers joined the team to guide your conversation lessons.",
    date: "4 days ago",
    tag: "Community",
    tagVariant: "default",
  },
]
