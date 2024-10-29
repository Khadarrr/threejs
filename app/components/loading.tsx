"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export function LoadingProgress() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(timer);
          return prevProgress;
        }
        return prevProgress + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-[60%] max-w-md">
      <Progress value={progress} className="w-full" />
      <p className="text-center text-sm text-white mt-2">Loading 3D Scene...</p>
    </div>
  );
}