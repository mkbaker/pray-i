import { useAnimatedText } from "@/hooks/useAnimatedText";

interface AnimatedTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  entranceDuration?: number;
  autoExitDelay?: number;
  onExitComplete?: () => void;
}

export function AnimatedText({
  text,
  className = "",
  staggerDelay,
  entranceDuration,
  autoExitDelay,
  onExitComplete,
}: AnimatedTextProps) {
  const { containerRef, renderText } = useAnimatedText(text, {
    staggerDelay,
    entranceDuration,
    autoExitDelay,
    onExitComplete,
  });

  return (
    <span ref={containerRef} className={`${className} inline-block`}>
      {renderText()}
    </span>
  );
}
