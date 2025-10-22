"use client";

import React from "react";
import { useMood } from "@/context/MoodContext";
import { format, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const moodColors: Record<string, string> = {
  happy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  excited: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  neutral: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  anxious: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  sad: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const MoodTimeline = () => {
  const { dailyRecords } = useMood();
  const today = new Date();

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <h2 className="text-lg font-semibold mb-4 text-center">Your Mood History</h2>
      {dailyRecords.length === 0 ? (
        <p className="text-center text-muted-foreground">No mood entries yet. Start tracking your mood!</p>
      ) : (
        <div className="space-y-4">
          {dailyRecords.map((record) => (
            <div key={record.date} className="border p-3 rounded-md bg-background">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-md">
                  {isSameDay(parseISO(record.date), today) ? "Today" : format(parseISO(record.date), "PPP")}
                </h3>
                {record.selectedMood && (
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold capitalize",
                      moodColors[record.selectedMood]
                    )}
                  >
                    {record.selectedMood}
                  </span>
                )}
              </div>
              {record.emojiEntries.length > 0 && (
                <div className="mt-2 space-y-1">
                  {record.emojiEntries.map((entry, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2">{entry.emoji}</span>
                      <span>{format(parseISO(entry.timestamp), "p")}</span>
                    </div>
                  ))}
                </div>
              )}
              {!record.selectedMood && record.emojiEntries.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No mood or emoji entries for this day.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodTimeline;