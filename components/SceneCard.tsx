import React, { useState, useEffect, useRef } from 'react';
import type { Scene } from '../types';
import type { TranslationKeys } from '../translations';
import LightBulbIcon from './icons/LightBulbIcon';
import PromptHelper from './PromptHelper';
import CameraIcon from './icons/CameraIcon';

interface SceneCardProps {
  scene: Scene;
  onUpdatePrompt: (sceneId: number, newPrompt: string) => void;
  charactersWithImages: { id: string, name: string }[];
  onGenerateSceneImage: (sceneId: number, characterId: string) => void;
  isLoading: boolean;
  isBatchGenerating: boolean;
  t: TranslationKeys;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, onUpdatePrompt, charactersWithImages, onGenerateSceneImage, isLoading, isBatchGenerating, t }) => {
  const [prompt, setPrompt] = useState(scene.prompt);
  const [isHelperVisible, setIsHelperVisible] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPrompt(scene.prompt);
  }, [scene.prompt]);
  
  useEffect(() => {
    if (!selectedCharacterId && charactersWithImages.length > 0) {
      setSelectedCharacterId(charactersWithImages[0].id);
    }
  }, [charactersWithImages, selectedCharacterId]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleBlur = () => {
    if (prompt.trim() !== scene.prompt.trim()) {
      onUpdatePrompt(scene.scene_id, prompt);
    }
  };
  
  const handleInsertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const newText = text.substring(0, start) + tag + text.substring(end);
    setPrompt(newText);
    onUpdatePrompt(scene.scene_id, newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 0);
  };

  return (
    <div className="bg-[#1E1E22] rounded-lg p-4 flex flex-col space-y-3 shadow-md border border-gray-700 hover:border-[#5BEAFF] transition-colors duration-300">
      <div className="flex justify-between items-baseline text-sm">
        <h3 className="text-lg font-bold text-gray-100">
          {t.sceneLabel} {scene.scene_id}
        </h3>
        <p className="font-mono text-gray-400 bg-[#0D0D0F] px-2 py-1 rounded-md">{t.timeLabel}: {scene.time}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side: Prompt editing */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={`prompt-${scene.scene_id}`} className="block text-xs font-medium text-gray-500">
              {t.promptLabel}
            </label>
            <button 
              onClick={() => setIsHelperVisible(!isHelperVisible)}
              title={t.promptHelperTooltip}
              className={`p-1 rounded-full ${isHelperVisible ? 'bg-cyan-900/70 text-cyan-300' : 'text-gray-500 hover:bg-gray-700 hover:text-cyan-300'} transition-colors`}
              >
              <LightBulbIcon className="w-5 h-5" />
            </button>
          </div>
          <textarea
            ref={textareaRef}
            id={`prompt-${scene.scene_id}`}
            rows={isHelperVisible ? 5 : 10}
            className="w-full bg-[#0D0D0F] text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-1 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition text-sm"
            value={prompt}
            onChange={handlePromptChange}
            onBlur={handleBlur}
          />
          {isHelperVisible && <PromptHelper onInsertTag={handleInsertTag} t={t} />}
        </div>

        {/* Right side: Image generation */}
        <div className="space-y-2 flex flex-col">
          <label className="block text-xs font-medium text-gray-400">{t.sceneImageLabel}</label>
          <div className="flex-grow aspect-video w-full bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {scene.isGeneratingImage && <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>}
            {!scene.isGeneratingImage && scene.imageUrl && <img src={scene.imageUrl} alt={`${t.sceneLabel} ${scene.scene_id}`} className="w-full h-full object-cover" />}
            {!scene.isGeneratingImage && !scene.imageUrl && <p className="text-gray-500 text-xs text-center">{t.noImageGenerated}</p>}
          </div>
          <div className="space-y-2">
            <div>
              <label htmlFor={`ref-${scene.scene_id}`} className="block text-xs font-medium text-gray-500 mb-1">{t.selectReferenceImageLabel}</label>
              <select
                id={`ref-${scene.scene_id}`}
                value={selectedCharacterId}
                onChange={(e) => setSelectedCharacterId(e.target.value)}
                disabled={charactersWithImages.length === 0 || scene.isGeneratingImage || isLoading || isBatchGenerating}
                className="w-full bg-[#0D0D0F] text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-1 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition text-sm disabled:bg-gray-800 disabled:text-gray-500"
              >
                {charactersWithImages.length === 0 
                  ? <option value="">{t.noReferenceImagesAvailable}</option>
                  : charactersWithImages.map(char => <option key={char.id} value={char.id}>{char.name}</option>)
                }
              </select>
            </div>
            <button
              onClick={() => onGenerateSceneImage(scene.scene_id, selectedCharacterId)}
              disabled={!selectedCharacterId || scene.isGeneratingImage || isLoading || isBatchGenerating}
              className="w-full flex items-center justify-center gap-x-1.5 text-sm bg-cyan-800/50 text-cyan-200 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <CameraIcon className="w-4 h-4" />
              {scene.isGeneratingImage ? t.generatingImageButton : t.generateImageButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;