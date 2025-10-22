"use client";

import React from "react";
import { MoodProvider } from "@/context/MoodContext";
import MoodSelector from "@/components/MoodSelector";
import EmojiInput from "@/components/EmojiInput";
import MoodTimeline from "@/components/MoodTimeline";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <MoodProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Mood Journal</h1>
          <MoodSelector />
          <EmojiInput />
          <MoodTimeline />
        </div>
        <MadeWithDyad />
      </div>
    </MoodProvider>
  );
};

export default Index;