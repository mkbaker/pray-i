import { useAnimatedText } from "@/hooks/useAnimatedText";

interface AnimatedTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  entranceDuration?: number;
}

export function AnimatedText({
  text,
  className = "",
  staggerDelay,
  entranceDuration,
}: AnimatedTextProps) {
  const { containerRef, chars } = useAnimatedText(text, {
    staggerDelay,
    entranceDuration,
  });

  return (
    <span ref={containerRef} className={`${className} inline-block`}>
      {chars.map((char, idx) => (
        <span key={idx} className="char inline-block">
          {char}
        </span>
      ))}
    </span>
  );
}
