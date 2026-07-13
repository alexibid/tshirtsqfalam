export interface DesignLayer {
  id: string;
  side: "front" | "back";
  image: any | null;
  isPlacing: boolean;
  label: string;
  originalPrompt?: string;
}
