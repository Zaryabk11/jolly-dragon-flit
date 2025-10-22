export type MoodOption = "happy" | "sad" | "neutral" | "anxious" | "excited";

export interface EmojiEntry {
  emoji: string;
  timestamp: string; // ISO string
}

export interface DailyMoodRecord {
  date: string; // YYYY-MM-DD format
  selectedMood: MoodOption | null;
  emojiEntries: EmojiEntry[];
}