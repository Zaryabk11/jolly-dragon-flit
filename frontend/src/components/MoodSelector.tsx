"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMood } from "@/context/MoodContext";
import { MoodOption } from "@/types/mood";
import { cn } from "@/lib/utils";

const moodOptions: { mood: MoodOption; icon: string; color: string }[] = [
  { mood: "happy", icon: "😊", color: "bg-green-500" },
  { mood: "excited", icon: "🤩", color: "bg-yellow-500" },
  { mood: "neutral", icon: "😐", color: "bg-gray-400" },
  { mood: "anxious", icon: "😟", color: "bg-orange-500" },
  { mood: "sad", icon: "😢", color: "bg-blue-500" },
];

const MoodSelector = () => {
  const { currentDayRecord, selectDailyMood } = useMood();
  const selectedMood = currentDayRecord?.selectedMood;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <h2 className="text-lg font-semibold mb-4 text-center">How are you feeling today?</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {moodOptions.map((option) => (
          <Button
            key={option.mood}
            variant="outline"
            className={cn(
              "flex flex-col items-center justify-center w-24 h-24 rounded-lg transition-all duration-200",
              "hover:scale-105",
              selectedMood === option.mood
                ? `${option.color} text-white border-2 border-primary-foreground scale-105`
                : "bg-muted text-muted-foreground border border-input"
            )}
            onClick={() => selectDailyMood(option.mood)}
          >
            <span className="text-3xl mb-1">{option.icon}</span>
            <span className="text-sm font-medium capitalize">{option.mood}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;