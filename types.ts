import { ReactNode } from "react";

export interface Scene {
  scene_id: number;
  time: string;
  prompt: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface CharacterProfile {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface VideoConfig {
  duration: number;
  style: string;
  includeDialogue: boolean;
  dialogueLanguage: string;
}

export interface Project {
  id: string;
  name: string;
  characters: CharacterProfile[];
  storyIdea: string;
  generatedScript: string;
  videoConfig: VideoConfig;
  scenes: Scene[];
  lastModified: number;
}