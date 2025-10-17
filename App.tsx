import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import SceneTimeline from './components/SceneTimeline';
import type { Scene, CharacterProfile, VideoConfig } from './types';
import { generateScenePrompts, generateCharacterDNA, generateScript, generateStoryIdea, generateCharacterImage, generateSceneImage } from './services/geminiService';
import { translations, type Language } from './translations';
import GuideModal from './components/GuideModal';
import ConfirmationModal from './components/ConfirmationModal';
import ExclamationTriangleIcon from './components/icons/ExclamationTriangleIcon';

declare var JSZip: any;

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('vi');
  const t = translations[language];

  const [projectName, setProjectName] = useState<string>(t.untitledProject);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [storyIdea, setStoryIdea] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<string>('');
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({ 
    duration: 0, 
    style: 'cinematic',
    includeDialogue: false,
    dialogueLanguage: 'vi',
  });
  const [scenes, setScenes] = useState<Scene[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCharacterLoading, setIsCharacterLoading] = useState<boolean>(false);
  const [isIdeaLoading, setIsIdeaLoading] = useState<boolean>(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [isGuideVisible, setIsGuideVisible] = useState<boolean>(false);
  const [isNewProjectConfirmVisible, setIsNewProjectConfirmVisible] = useState<boolean>(false);
  const [isResumeModalVisible, setIsResumeModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);
  const [generationStatusMessage, setGenerationStatusMessage] = useState<string>('');
  
  useEffect(() => {
    const firstLine = storyIdea.split('\n')[0].trim();
    if (firstLine.length > 0 && firstLine.length < 50) {
      setProjectName(firstLine);
    } else {
      setProjectName(t.untitledProject);
    }
  }, [storyIdea, t.untitledProject]);

  const resetState = () => {
    setProjectName(t.untitledProject);
    setCharacters([]);
    setStoryIdea('');
    setGeneratedScript('');
    setScenes([]);
    setVideoConfig({ 
        duration: 0, 
        style: 'cinematic',
        includeDialogue: false,
        dialogueLanguage: 'vi',
    });
    setError(null);
    setIsLoading(false);
    setIsCharacterLoading(false);
    setIsIdeaLoading(false);
    setIsBatchGenerating(false);
    setIsGenerationComplete(false);
    setGenerationProgress({ current: 0, total: 0 });
    setGenerationStatusMessage('');
  };

  const handleNewProjectRequest = () => {
    if (storyIdea || characters.length > 0 || scenes.length > 0 || generatedScript) {
        setIsNewProjectConfirmVisible(true);
    } else {
        resetState();
    }
  };

  const handleConfirmNewProject = () => {
      resetState();
      setIsNewProjectConfirmVisible(false);
  };

  const handleGenerateStoryIdea = async () => {
    if (!videoConfig.style) return;
    
    setIsIdeaLoading(true);
    setError(null);
    try {
      const idea = await generateStoryIdea(videoConfig.style, language);
      setStoryIdea(idea);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsIdeaLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    if (characters.length === 0 || !storyIdea.trim() || videoConfig.duration <= 0) return;
    
    setIsLoading(true);
    setError(null);
    setGeneratedScript('');
    setScenes([]);
    setIsGenerationComplete(false);
    setGenerationProgress({ current: 0, total: 0 });
    
    try {
      const script = await generateScript(storyIdea, characters, videoConfig, language);
      setGeneratedScript(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateStoryboard = async () => {
    if (!generatedScript.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsGenerationComplete(false);

    const totalScenes = Math.round(videoConfig.duration / 8);
    setGenerationProgress({ current: scenes.length, total: totalScenes });
    setGenerationStatusMessage(t.generationStatusPreparing);

    const SCENE_BATCH_SIZE = 10;

    try {
        let currentScenes = [...scenes];
        const maxAttempts = 5; 
        let safetyBreak = 0;
        let batchNumber = Math.floor(scenes.length / SCENE_BATCH_SIZE) + 1;

        const addScenesWithDelay = async (scenesToAdd: Scene[]) => {
            for (const scene of scenesToAdd) {
                setScenes(prev => {
                    if (prev.some(s => s.scene_id === scene.scene_id)) {
                        return prev;
                    }
                    const newScenes = [...prev, scene].sort((a,b) => a.scene_id - b.scene_id);
                    setGenerationProgress({ current: newScenes.length, total: totalScenes });
                    return newScenes;
                });
                await new Promise(resolve => setTimeout(resolve, 200)); 
            }
        };
        
        while (currentScenes.length < totalScenes && safetyBreak < maxAttempts) {
            setGenerationStatusMessage(t.generationStatusRequesting(batchNumber));
            const newScenesBatch = await generateScenePrompts(
                characters,
                generatedScript,
                videoConfig,
                language,
                currentScenes
            );
            batchNumber++;

            if (!newScenesBatch || newScenesBatch.length === 0) {
                 safetyBreak++;
                 continue;
            }

            const uniqueNewScenes = newScenesBatch.filter(
                (newScene) => !currentScenes.some((existingScene) => existingScene.scene_id === newScene.scene_id)
            );

            if (uniqueNewScenes.length === 0) {
                safetyBreak++;
            } else {
                currentScenes = [...currentScenes, ...uniqueNewScenes];
                await addScenesWithDelay(uniqueNewScenes);
                safetyBreak = 0; 
            }
        }
        
        if (currentScenes.length < totalScenes) {
            setError(t.generationIncompleteError(currentScenes.length, totalScenes));
            setIsResumeModalVisible(true);
        } else {
          setIsGenerationComplete(true);
        }

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsLoading(false);
        setGenerationStatusMessage('');
    }
  };
  
  const handleResumeGeneration = () => {
    setIsResumeModalVisible(false);
    setError(null);
    handleGenerateStoryboard();
  };


  const handlePrimaryAction = () => {
    if (generatedScript) {
      handleGenerateStoryboard();
    } else {
      handleGenerateScript();
    }
  };

  const handleGenerateCharacter = async () => {
    if (!storyIdea.trim()) return;

    setIsCharacterLoading(true);
    setError(null);

    try {
      const generatedCharacters = await generateCharacterDNA(storyIdea, videoConfig.duration, language);
      setCharacters(generatedCharacters);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsCharacterLoading(false);
    }
  };

  const handleGenerateCharacterImage = async (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, isGeneratingImage: true } : c));
    setError(null);

    try {
        const imageUrl = await generateCharacterImage(character.description);
        setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, imageUrl, isGeneratingImage: false } : c));
    } catch (err) {
        setError(err instanceof Error ? err.message : t.errorGeneratingImage);
        setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, isGeneratingImage: false } : c));
    }
  };

  const handleGenerateSceneImage = async (sceneId: number, characterId: string) => {
    const scene = scenes.find(s => s.scene_id === sceneId);
    const character = characters.find(c => c.id === characterId);
    if (!scene || !character || !character.imageUrl) return;

    setScenes(prev => prev.map(s => s.scene_id === sceneId ? { ...s, isGeneratingImage: true } : s));
    setError(null);

    try {
        const imageUrl = await generateSceneImage(scene.prompt, character.imageUrl);
        setScenes(prev => prev.map(s => s.scene_id === sceneId ? { ...s, imageUrl, isGeneratingImage: false } : s));
    } catch (err) {
        setError(err instanceof Error ? err.message : t.errorGeneratingImage);
        setScenes(prev => prev.map(s => s.scene_id === sceneId ? { ...s, isGeneratingImage: false } : s));
    }
  };

  const handleGenerateAllSceneImages = async (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character || !character.imageUrl) {
        setError("Selected character does not have a reference image.");
        return;
    }

    setIsBatchGenerating(true);
    setError(null);
    
    // Only generate for scenes that don't have an image yet
    const scenesToGenerate = scenes.filter(s => !s.imageUrl);

    for (const scene of scenesToGenerate) {
        // We can reuse the single-scene generation logic
        setScenes(prev => prev.map(s => s.scene_id === scene.scene_id ? { ...s, isGeneratingImage: true } : s));
        try {
            const imageUrl = await generateSceneImage(scene.prompt, character.imageUrl);
            setScenes(prev => prev.map(s => s.scene_id === scene.scene_id ? { ...s, imageUrl, isGeneratingImage: false } : s));
        } catch (err) {
            setError(`Failed to generate image for Scene ${scene.scene_id}. Batch process stopped.`);
            setScenes(prev => prev.map(s => s.scene_id === scene.scene_id ? { ...s, isGeneratingImage: false } : s));
            setIsBatchGenerating(false);
            return; // Stop on first error
        }
    }

    setIsBatchGenerating(false);
  };

  const handleDownloadAllImages = async () => {
    const scenesWithImages = scenes.filter(s => s.imageUrl);
    if (scenesWithImages.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
        const zip = new JSZip();
        
        for (const scene of scenesWithImages) {
            const response = await fetch(scene.imageUrl!);
            const blob = await response.blob();
            // Pad scene number for correct file sorting
            const sceneNumber = scene.scene_id.toString().padStart(3, '0');
            zip.file(`scene_${sceneNumber}.png`, blob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${projectName.replace(/ /g, '_')}_images.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (err) {
        setError("Failed to create or download the zip file.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };


  const handleDownload = () => {
    if (scenes.length === 0) return;
    const sortedScenes = [...scenes].sort((a, b) => a.scene_id - b.scene_id);
    const content = sortedScenes.map(s => {
      return s.prompt.replace(/^Scene \d+ –\s*/, `${s.scene_id}. `);
    }).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${projectName.replace(/ /g, '_')}_prompts.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0D0D0F] min-h-screen text-gray-200 font-sans">
      <GuideModal isOpen={isGuideVisible} onClose={() => setIsGuideVisible(false)} t={t} />
      <ConfirmationModal
        isOpen={isNewProjectConfirmVisible}
        onClose={() => setIsNewProjectConfirmVisible(false)}
        onConfirm={handleConfirmNewProject}
        title={t.newProjectConfirmationTitle}
        message={t.newProjectConfirmationMessage}
        confirmText={t.confirmButton}
        cancelText={t.cancelButton}
        icon={<ExclamationTriangleIcon className="w-16 h-16 text-yellow-400" />}
      />
      <ConfirmationModal
        isOpen={isResumeModalVisible}
        onClose={() => setIsResumeModalVisible(false)}
        onConfirm={handleResumeGeneration}
        title={t.resumeGenerationTitle}
        message={error || ''}
        confirmText={t.resumeButton}
        cancelText={t.finishForNowButton}
        icon={<ExclamationTriangleIcon className="w-16 h-16 text-yellow-400" />}
      />
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        t={t} 
        onOpenGuide={() => setIsGuideVisible(true)}
        onNewProject={handleNewProjectRequest}
      />
      <main className="container mx-auto p-4 md:p-8">
        {error && !isResumeModalVisible && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-200">&times;</button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputPanel
            characters={characters}
            setCharacters={setCharacters}
            storyIdea={storyIdea}
            setStoryIdea={setStoryIdea}
            generatedScript={generatedScript}
            videoConfig={videoConfig}
            setVideoConfig={setVideoConfig}
            onPrimaryAction={handlePrimaryAction}
            isLoading={isLoading || isBatchGenerating}
            onGenerateCharacter={handleGenerateCharacter}
            isCharacterLoading={isCharacterLoading}
            onGenerateStoryIdea={handleGenerateStoryIdea}
            isIdeaLoading={isIdeaLoading}
            onGenerateCharacterImage={handleGenerateCharacterImage}
            t={t}
            language={language}
          />
          <SceneTimeline
            scenes={scenes}
            onUpdatePrompt={(sceneId, newPrompt) => {
              setScenes(prevScenes => 
                prevScenes.map(s => s.scene_id === sceneId ? { ...s, prompt: newPrompt } : s)
              )
            }}
            isLoading={isLoading}
            isBatchGenerating={isBatchGenerating}
            isGenerationComplete={isGenerationComplete}
            generationProgress={generationProgress}
            generationStatusMessage={generationStatusMessage}
            onDownloadPrompts={handleDownload}
            onDownloadAllImages={handleDownloadAllImages}
            characters={characters}
            onGenerateSceneImage={handleGenerateSceneImage}
            onGenerateAllSceneImages={handleGenerateAllSceneImages}
            t={t}
          />
        </div>
      </main>
    </div>
  );
};

export default App;