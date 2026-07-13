import { useState, useEffect } from "react";
import { DesignLayer } from "../types";

export function useDesignLayers(currentSide: "front" | "back") {
  const [layers, setLayers] = useState<DesignLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (layers.length === 0) {
      const initialId = Date.now().toString();
      setLayers([
        {
          id: initialId,
          side: "front",
          image: null,
          isPlacing: false,
          label: "Design 1",
        },
      ]);
      setActiveLayerId(initialId);
    }
  }, []);

  const addLayer = () => {
    const newId = Date.now().toString();
    const countOnSide = layers.filter((l) => l.side === currentSide).length;

    setLayers((prev) => [
      ...prev,
      {
        id: newId,
        side: currentSide,
        image: null,
        isPlacing: false,
        label: `Design ${countOnSide + 1}`,
      },
    ]);
    setActiveLayerId(newId);
  };

  const lockLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isPlacing: false } : l))
    );
  };

  const deleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayerId === id) {
      setActiveLayerId(null);
    }
  };

  const generateDesign = (prompt: string) => {
    setIsGenerating(true);
    let targetId = activeLayerId;

    if (!targetId) {
      const newId = Date.now().toString();
      const countOnSide = layers.filter((l) => l.side === currentSide).length;
      const newLayer: DesignLayer = {
        id: newId,
        side: currentSide,
        image: null,
        isPlacing: false,
        label: `Design ${countOnSide + 1}`,
        originalPrompt: prompt,
      };
      setLayers((prev) => [...prev, newLayer]);
      targetId = newId;
      setActiveLayerId(newId);
    } else {
      setLayers((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, originalPrompt: prompt } : l))
      );
    }

    setTimeout(() => {
      const mockImage = require("../assets/logo.png");
      setLayers((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, image: mockImage } : l))
      );
      setIsGenerating(false);
    }, 2000);
  };

  const selectLayerImage = (img: any) => {
    let targetId = activeLayerId;

    if (!targetId) {
      const newId = Date.now().toString();
      const countOnSide = layers.filter((l) => l.side === currentSide).length;
      const newLayer: DesignLayer = {
        id: newId,
        side: currentSide,
        image: img,
        isPlacing: false,
        label: `Design ${countOnSide + 1}`,
      };
      setLayers((prev) => [...prev, newLayer]);
      targetId = newId;
      setActiveLayerId(newId);
    } else {
      setLayers((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, image: img } : l))
      );
    }
  };

  return {
    layers,
    activeLayerId,
    setActiveLayerId,
    isGenerating,
    addLayer,
    lockLayer,
    deleteLayer,
    generateDesign,
    selectLayerImage,
  };
}
