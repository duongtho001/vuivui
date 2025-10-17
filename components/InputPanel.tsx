import React, { useState, useEffect } from 'react';
import type { CharacterProfile, VideoConfig } from '../types';
import { VIDEO_STYLES, DIALOGUE_LANGUAGES } from '../constants';
import SparklesIcon from './icons/SparklesIcon';
import WandIcon from './icons/WandIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import CameraIcon from './icons/CameraIcon';
import Loader from './Loader';
import type { TranslationKeys, Language } from '../translations';

interface InputPanelProps {
  characters: CharacterProfile[];
  setCharacters: React.Dispatch<React.SetStateAction<CharacterProfile[]>>;
  storyIdea: string;
  setStoryIdea: React.Dispatch<React.SetStateAction<string>>;
  generatedScript: string;
  videoConfig: VideoConfig;
  setVideoConfig: React.Dispatch<React.SetStateAction<VideoConfig>>;
  onPrimaryAction: () => void;
  isLoading: boolean;
  onGenerateCharacter: () => void;
  isCharacterLoading: boolean;
  onGenerateStoryIdea: () => void;
  isIdeaLoading: boolean;
  onGenerateCharacterImage: (characterId: string) => void;
  t: TranslationKeys;
  language: Language;
}

const InputPanel: React.FC<InputPanelProps> = ({
  characters,
  setCharacters,
  storyIdea,
  setStoryIdea,
  generatedScript,
  videoConfig,
  setVideoConfig,
  onPrimaryAction,
  isLoading,
  onGenerateCharacter,
  isCharacterLoading,
  onGenerateStoryIdea,
  isIdeaLoading,
  onGenerateCharacterImage,
  t,
  language,
}) => {
  const [minutesDisplay, setMinutesDisplay] = useState<string>('');

  useEffect(() => {
    if (videoConfig.duration > 0) {
      const minutes = Math.floor(videoConfig.duration / 60);
      setMinutesDisplay(minutes.toString());
    } else {
      setMinutesDisplay('');
    }
  }, [videoConfig.duration]);


  const handleConfigChange = <K extends keyof VideoConfig>(key: K, value: VideoConfig[K]) => {
    setVideoConfig((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleMinutesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinutesDisplay(value);

    const minutes = parseInt(value, 10);
    if (!isNaN(minutes) && minutes > 0) {
      const requestedSeconds = minutes * 60;
      const numberOfScenes = Math.round(requestedSeconds / 8);
      const actualSeconds = Math.max(8, numberOfScenes * 8); // Ensure a minimum of 1 scene (8s)
      handleConfigChange('duration', actualSeconds);
    } else {
      handleConfigChange('duration', 0); // Invalid input disables generation
    }
  };

  const handleAddCharacter = () => {
    setCharacters(prev => [...prev, { id: crypto.randomUUID(), name: '', description: '' }]);
  };
  
  const handleRemoveCharacter = (index: number) => {
    setCharacters(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCharacterChange = (index: number, field: keyof Omit<CharacterProfile, 'id'>, value: string) => {
    setCharacters(prev => {
      const newChars = [...prev];
      newChars[index] = { ...newChars[index], [field]: value };
      return newChars;
    });
  };

  const numberOfScenes = videoConfig.duration > 0 ? videoConfig.duration / 8 : 0;
  const displayMinutes = Math.floor(videoConfig.duration / 60);
  const displaySeconds = videoConfig.duration % 60;

  const anyImageGenerating = characters.some(c => c.isGeneratingImage);
  const canGenerateCharacters = !isLoading && !isCharacterLoading && !isIdeaLoading && !anyImageGenerating && storyIdea.trim() !== '';
  const canGenerateScript = !isLoading && !isCharacterLoading && !isIdeaLoading && !anyImageGenerating && characters.length > 0 && characters.every(c => c.description.trim()) && storyIdea.trim() && videoConfig.duration > 0;
  const canGenerateStoryboard = canGenerateScript && generatedScript.trim() !== '';
  
  const isGeneratingScript = isLoading && !generatedScript;
  const isGeneratingStoryboard = isLoading && !!generatedScript;

  return (
    <div className="p-6 bg-[#1E1E22] rounded-lg shadow-lg space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-lg font-semibold text-gray-200">
            {t.referenceCharactersLabel}
          </label>
          <button
            onClick={onGenerateCharacter}
            disabled={!canGenerateCharacters}
            className="flex items-center gap-x-1.5 text-sm font-semibold text-[#5BEAFF] hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            <WandIcon className="w-4 h-4" />
            {isCharacterLoading ? t.analyzingScript : t.autoGenerateButton}
          </button>
        </div>
        <div className="space-y-4">
          {characters.map((char, index) => (
            <div key={char.id} className="p-4 bg-[#0D0D0F] border border-gray-700 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder={t.characterNamePlaceholder}
                      value={char.name}
                      onChange={(e) => handleCharacterChange(index, 'name', e.target.value)}
                      className="w-full bg-transparent text-gray-200 font-semibold focus:outline-none"
                    />
                    <button
                      onClick={() => handleRemoveCharacter(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors text-xs font-semibold"
                    >
                      {t.removeCharacterButton}
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    className="w-full bg-gray-800/50 text-gray-300 p-2 rounded-md border border-gray-600 focus:ring-1 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition text-sm"
                    placeholder={t.characterDescriptionPlaceholder}
                    value={char.description}
                    onChange={(e) => handleCharacterChange(index, 'description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-400">{t.characterImageLabel}</label>
                    <div className="aspect-square w-full bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {char.isGeneratingImage && <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>}
                        {!char.isGeneratingImage && char.imageUrl && <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />}
                        {!char.isGeneratingImage && !char.imageUrl && <p className="text-gray-500 text-xs text-center">{t.noImageGenerated}</p>}
                    </div>
                    <button
                        onClick={() => onGenerateCharacterImage(char.id)}
                        disabled={!char.description.trim() || char.isGeneratingImage || isLoading || isCharacterLoading || isIdeaLoading}
                        className="w-full flex items-center justify-center gap-x-1.5 text-sm bg-cyan-800/50 text-cyan-200 font-semibold py-2 px-3 rounded-lg hover:bg-cyan-700 hover:text-white transition-colors border border-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <CameraIcon className="w-4 h-4" />
                        {char.isGeneratingImage ? t.generatingImageButton : t.generateImageButton}
                    </button>
                </div>
              </div>
            </div>
          ))}
           <button
            onClick={handleAddCharacter}
            className="w-full text-sm font-semibold text-center text-[#5BEAFF] hover:text-cyan-200 py-2 border-2 border-dashed border-gray-600 hover:border-[#5BEAFF] rounded-lg transition-colors"
          >
           {t.addCharacterButton}
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="storyIdea" className="block text-lg font-semibold text-gray-200">
            {t.storyIdeaLabel}
          </label>
           <button
            onClick={onGenerateStoryIdea}
            disabled={isLoading || isCharacterLoading || isIdeaLoading || anyImageGenerating || !videoConfig.style}
            className="flex items-center gap-x-1.5 text-sm font-semibold text-[#5BEAFF] hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            <LightBulbIcon className="w-4 h-4" />
            {isIdeaLoading ? t.suggestingIdeaButton : t.suggestIdeaButton}
          </button>
        </div>
        <textarea
          id="storyIdea"
          rows={8}
          className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition"
          placeholder={t.storyIdeaPlaceholder}
          value={storyIdea}
          onChange={(e) => setStoryIdea(e.target.value)}
        />
      </div>

      {generatedScript && (
         <div>
          <label htmlFor="generatedScript" className="block text-lg font-semibold text-gray-200 mb-2">
            {t.generatedScriptLabel}
          </label>
          <textarea
            id="generatedScript"
            rows={10}
            readOnly
            className="w-full bg-[#0D0D0F]/50 text-gray-400 p-3 rounded-md border border-gray-700 cursor-default"
            value={generatedScript}
          />
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">{t.videoSettingsLabel}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">{t.durationLabel}</label>
            <input
              id="duration"
              type="number"
              min="1"
              step="1"
              className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition"
              value={minutesDisplay}
              onChange={handleMinutesInputChange}
              placeholder={t.durationPlaceholder}
            />
             {videoConfig.duration > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {t.durationFeedback(numberOfScenes, displayMinutes, displaySeconds)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-400 mb-2">{t.styleLabel}</label>
            <select
              id="style"
              className="w-full bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition"
              value={videoConfig.style}
              onChange={(e) => handleConfigChange('style', e.target.value)}
            >
              {VIDEO_STYLES.map(style => <option key={style.key} value={style.en}>{style[language]}</option>)}
            </select>
          </div>
        </div>
         <div className="mt-6">
            <h4 className="block text-sm font-medium text-gray-400 mb-2">{t.dialogueSettingsLabel}</h4>
            <div className="flex items-center gap-x-8">
                <div className="flex items-center">
                    <input
                        id="dialogue-off"
                        name="dialogue-option"
                        type="radio"
                        checked={!videoConfig.includeDialogue}
                        onChange={() => handleConfigChange('includeDialogue', false)}
                        className="h-4 w-4 border-gray-500 text-[#5BEAFF] focus:ring-[#5BEAFF]"
                    />
                    <label htmlFor="dialogue-off" className="ml-3 block text-sm font-medium leading-6 text-gray-300">
                        {t.dialogueOffLabel}
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="dialogue-on"
                        name="dialogue-option"
                        type="radio"
                        checked={videoConfig.includeDialogue}
                        onChange={() => handleConfigChange('includeDialogue', true)}
                        className="h-4 w-4 border-gray-500 text-[#5BEAFF] focus:ring-[#5BEAFF]"
                    />
                    <label htmlFor="dialogue-on" className="ml-3 block text-sm font-medium leading-6 text-gray-300">
                        {t.dialogueOnLabel}
                    </label>
                </div>
            </div>
            {videoConfig.includeDialogue && (
                <div className="mt-4">
                     <label htmlFor="dialogue-language" className="block text-sm font-medium text-gray-400 mb-2">{t.dialogueLanguageLabel}</label>
                     <select
                        id="dialogue-language"
                        className="w-full md:w-1/2 bg-[#0D0D0F] text-gray-300 p-3 rounded-md border border-gray-700 focus:ring-2 focus:ring-[#5BEAFF] focus:border-[#5BEAFF] transition"
                        value={videoConfig.dialogueLanguage}
                        onChange={(e) => handleConfigChange('dialogueLanguage', e.target.value)}
                    >
                        {DIALOGUE_LANGUAGES.map(lang => <option key={lang.key} value={lang.key}>{lang.label}</option>)}
                    </select>
                </div>
            )}
        </div>
      </div>

      <button
        onClick={onPrimaryAction}
        disabled={isLoading || (generatedScript ? !canGenerateStoryboard : !canGenerateScript)}
        className="w-full flex items-center justify-center gap-x-2 bg-[#5BEAFF] text-[#0D0D0F] font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
      >
        <SparklesIcon className="w-6 h-6" />
        {
          isGeneratingScript ? t.generatingScriptButton : 
          isGeneratingStoryboard ? t.generatingStoryboardButton :
          generatedScript ? t.generateStoryboardButton : 
          t.generateScriptButton
        }
      </button>
    </div>
  );
};

export default InputPanel;