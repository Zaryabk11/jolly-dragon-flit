"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DailyMoodRecord, EmojiEntry, MoodOption } from "@/types/mood";
import { format, parseISO } from "date-fns";

interface MoodContextType {
  dailyRecords: DailyMoodRecord[];
  currentDayRecord: DailyMoodRecord | undefined;
  selectDailyMood: (mood: MoodOption) => void;
  addEmojiEntry: (emoji: string) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

const API_URL = "http://localhost:3001";

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [dailyRecords, setDailyRecords] = useState<DailyMoodRecord[]>([]);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch(`${API_URL}/moods`);
        const data = await response.json();
        const sortedData = data.sort((a: DailyMoodRecord, b: DailyMoodRecord) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
        setDailyRecords(sortedData);
      } catch (error) {
        console.error("Failed to fetch moods:", error);
      }
    };
    fetchMoods();
  }, []);

  const currentDayRecord = dailyRecords.find((record) => record.date === today);

  const selectDailyMood = async (mood: MoodOption) => {
    const existingRecord = dailyRecords.find((record) => record.date === today);
    if (existingRecord) {
      // In a real app, you'd likely have a PUT/PATCH endpoint to update
      console.log("Mood already selected for today, updating is not implemented in this simple backend.");
    } else {
      try {
        const response = await fetch(`${API_URL}/moods`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mood: mood.name, emojis: [] }),
        });
        const newRecord = await response.json();
        setDailyRecords((prev) => [newRecord, ...prev].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
      } catch (error) {
        console.error("Failed to save mood:", error);
      }
    }
  };

  const addEmojiEntry = async (emoji: string) => {
    const existingRecord = dailyRecords.find((record) => record.date === today);
    const newEmojiEntry: EmojiEntry = {
      emoji,
      timestamp: new Date().toISOString(),
    };

    if (existingRecord) {
      // In a real app, you'd likely have a PUT/PATCH endpoint to update emojis
      console.log("Adding emoji to existing record is not implemented in this simple backend.");
    } else {
      try {
        const response = await fetch(`${API_URL}/moods`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mood: null, emojis: [newEmojiEntry] }),
        });
        const newRecord = await response.json();
        setDailyRecords((prev) => [newRecord, ...prev].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
      } catch (error) {
        console.error("Failed to save emoji entry:", error);
      }
    }
  };

  return (
    <MoodContext.Provider value={{ dailyRecords, currentDayRecord, selectDailyMood, addEmojiEntry }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};