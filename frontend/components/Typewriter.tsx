"use client";

import { useEffect, useState } from "react";

export default function Typewriter({
  words,
  speed = 60,
  pause = 1500,
}: {
  words: string[];
  speed?: number;
  pause?: number;
}) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timer = setTimeout(() => {
      if (!deleting) {
        setText(currentWord.slice(0, index + 1));
        setIndex(index + 1);

        if (index === currentWord.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        setText(currentWord.slice(0, index - 1));
        setIndex(index - 1);

        if (index === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [index, deleting, wordIndex, words, speed, pause]);

  return (
    <span className="border-r-2 border-orange-500 pr-1 animate-pulse">
      {text}
    </span>
  );
}
