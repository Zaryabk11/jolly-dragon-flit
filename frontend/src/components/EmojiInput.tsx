"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMood } from "@/context/MoodContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

const commonEmojis = [
  "😊", "😂", "😍", "🤔", "🥳", "😢", "😡", "😴", "👍", "👎",
  "🙏", "🎉", "🔥", "✨", "💔", "💡", "🚀", "🌟", "💯", "🤯",
];

const EmojiInput = () => {
  const { addEmojiEntry } = useMood();

  const handleEmojiSelect = (emoji: string) => {
    addEmojiEntry(emoji);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <h2 className="text-lg font-semibold mb-4 text-center">Add a quick emoji entry</h2>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full py-6 text-lg">
            <Smile className="mr-2 h-5 w-5" /> Add Emoji Moment
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <div className="grid grid-cols-5 gap-2">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                className="text-2xl p-2 h-auto w-auto"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EmojiInput;