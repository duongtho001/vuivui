import type { VideoConfig } from './types';

export type Language = 'en' | 'vi';

export interface TranslationKeys {
  appTitle: string;
  appDescription: string;
  newProjectButton: string;
  guideButtonTooltip: string;
  languageLabel: string;
  untitledProject: string;
  referenceCharactersLabel: string;
  analyzingScript: string;
  autoGenerateButton: string;
  characterNamePlaceholder: string;
  removeCharacterButton: string;
  characterDescriptionPlaceholder: string;
  characterImageLabel: string;
  noImageGenerated: string;
  generatingImageButton: string;
  generateImageButton: string;
  addCharacterButton: string;
  storyIdeaLabel: string;
  suggestingIdeaButton: string;
  suggestIdeaButton: string;
  storyIdeaPlaceholder: string;
  generatedScriptLabel: string;
  videoSettingsLabel: string;
  durationLabel: string;
  durationPlaceholder: string;
  durationFeedback: (scenes: number, minutes: number, seconds: number) => string;
  styleLabel: string;
  dialogueSettingsLabel: string;
  dialogueOffLabel: string;
  dialogueOnLabel: string;
  dialogueLanguageLabel: string;
  generatingScriptButton: string;
  generatingStoryboardButton: string;
  generateStoryboardButton: string;
  generateScriptButton: string;
  sceneLabel: string;
  timeLabel: string;
  promptLabel: string;
  promptHelperTooltip: string;
  sceneImageLabel: string;
  selectReferenceImageLabel: string;
  noReferenceImagesAvailable: string;
  timelineTitle: string;
  downloadButton: string;
  primaryCharacterLabel: string;
  selectPrimaryCharacterPrompt: string;
  generatingAllImagesButton: string;
  generateAllImagesButton: string;
  downloadAllImagesButton: string;
  emptyTimelineTitle: string;
  emptyTimelineDescription: string;
  loaderText: string;
  generationComplete: string;
  generatingScene: (current: number, total: number) => string;
  generationStatusPreparing: string;
  generationStatusRequesting: (batch: number) => string;
  errorGeneratingImage: string;
  generationIncompleteError: (current: number, total: number) => string;
  newProjectConfirmationTitle: string;
  newProjectConfirmationMessage: string;
  confirmButton: string;
  cancelButton: string;
  resumeGenerationTitle: string;
  resumeButton: string;
  finishForNowButton: string;
  continueGenerationTitle: string;
  continueGenerationMessage: (generated: number, total: number) => string;
  continueGenerationButton: string;
  guideModalTitle: string;
  guideSteps: Array<{ title: string; description: string }>;
  promptHelperTitle: string;
  promptHelperTags: {
    cam: { group: string; tags: Array<{ tag: string; desc: string }> };
    set: { group: string; tags: Array<{ tag: string; desc: string }> };
    char: { group: string; tags: Array<{ tag: string; desc: string }> };
    action: { group: string; tags: Array<{ tag: string; desc: string }> };
    perf: { group: string; tags: Array<{ tag: string; desc: string }> };
    snd: { group: string; tags: Array<{ tag: string; desc: string }> };
    vo: { group: string; tags: Array<{ tag: string; desc: string }> };
    style: { group: string; tags: Array<{ tag: string; desc: string }> };
  };
  systemInstruction_generateStoryIdea: (style: string) => string;
  systemInstruction_generateScript: (config: VideoConfig) => string;
  systemInstruction_generateScenes: (config: VideoConfig, isContinuation: boolean) => string;
  systemInstruction_generateCharacters: (duration: number) => string;
}

const en: TranslationKeys = {
  appTitle: "Storyboard AI",
  appDescription: "Generate video scripts and storyboards with AI",
  newProjectButton: "New Project",
  guideButtonTooltip: "Show user guide",
  languageLabel: "Language",
  untitledProject: "Untitled Project",
  referenceCharactersLabel: "Reference Characters",
  analyzingScript: "Analyzing...",
  autoGenerateButton: "Auto-Generate from Story Idea",
  characterNamePlaceholder: "Character Name...",
  removeCharacterButton: "Remove",
  characterDescriptionPlaceholder: "Detailed character description (appearance, personality, role in the story, etc.). The more detail, the better the image generation.",
  characterImageLabel: "Reference Image",
  noImageGenerated: "No image generated yet.",
  generatingImageButton: "Generating...",
  generateImageButton: "Generate Image",
  addCharacterButton: "+ Add Character",
  storyIdeaLabel: "Story Idea / Synopsis",
  suggestingIdeaButton: "Suggesting...",
  suggestIdeaButton: "Suggest Idea",
  storyIdeaPlaceholder: "Describe the plot of your video. For example: 'A short, funny video about a cat who learns to use a smartphone and orders too much catnip.'",
  generatedScriptLabel: "Generated Script",
  videoSettingsLabel: "Video Settings",
  durationLabel: "Approximate Video Duration (minutes)",
  durationPlaceholder: "e.g., 2",
  durationFeedback: (scenes, minutes, seconds) => `~${scenes} scenes, final duration: ${minutes}m ${seconds}s.`,
  styleLabel: "Visual Style",
  dialogueSettingsLabel: "Dialogue",
  dialogueOffLabel: "No Dialogue / BGM Only",
  dialogueOnLabel: "Include Dialogue",
  dialogueLanguageLabel: "Dialogue Language",
  generatingScriptButton: "Generating Script...",
  generatingStoryboardButton: "Generating Storyboard...",
  generateStoryboardButton: "Generate Storyboard",
  generateScriptButton: "Generate Script",
  sceneLabel: "Scene",
  timeLabel: "Time",
  promptLabel: "Image Prompt",
  promptHelperTooltip: "Prompt Helper",
  sceneImageLabel: "Scene Image",
  selectReferenceImageLabel: "Reference Character Image",
  noReferenceImagesAvailable: "No character images available",
  timelineTitle: "Storyboard Timeline",
  downloadButton: "Download Prompts",
  primaryCharacterLabel: "Primary Character for Batch Generation",
  selectPrimaryCharacterPrompt: "Select a character...",
  generatingAllImagesButton: "Generating All...",
  generateAllImagesButton: "Generate All Images",
  downloadAllImagesButton: "Download All Images",
  emptyTimelineTitle: "Your storyboard is empty",
  emptyTimelineDescription: "Generate a script and storyboard to see your scenes here.",
  loaderText: "Generating...",
  generationComplete: "Generation Complete!",
  generatingScene: (current, total) => `Generating scene ${current} of ${total}...`,
  generationStatusPreparing: "Preparing to generate scenes...",
  generationStatusRequesting: (batch) => `Requesting scene batch #${batch}...`,
  errorGeneratingImage: "An error occurred while generating the image.",
  generationIncompleteError: (current, total) => `Generation stopped. Only ${current} out of ${total} scenes were created. Would you like to try resuming?`,
  newProjectConfirmationTitle: "Start New Project?",
  newProjectConfirmationMessage: "Are you sure you want to start a new project? All unsaved progress will be lost.",
  confirmButton: "Confirm",
  cancelButton: "Cancel",
  resumeGenerationTitle: "Resume Generation?",
  resumeButton: "Resume",
  finishForNowButton: "Finish for Now",
  continueGenerationTitle: 'Continue Generation?',
  continueGenerationMessage: (generated, total) => `Successfully generated ${generated} out of ${total} scenes. Do you want to continue?`,
  continueGenerationButton: 'Continue',
  guideModalTitle: "How to Use Storyboard AI",
  guideSteps: [
    { title: "Set Video Style", description: "Choose a visual style and desired duration for your video. This guides the entire generation process." },
    { title: "Define a Story Idea", description: "Write a short synopsis or idea for your story. You can also use the 'Suggest Idea' button to get a random one." },
    { title: "Create Characters", description: "Add main characters with detailed descriptions. You can write them manually or use the 'Auto-Generate' feature after providing a story idea. Then, generate a reference image for each character to ensure consistency." },
    { title: "Generate Script", description: "Click 'Generate Script'. The AI will write a script based on your story, characters, and settings." },
    { title: "Generate Storyboard", description: "Once the script is ready, the button will change to 'Generate Storyboard'. Click it to create a list of scenes with image prompts." },
    { title: "Generate Scene Images", description: "For each scene, you can edit the prompt and then generate an image. To generate images for all scenes at once, select a primary character and click 'Generate All Images'." },
    { title: "Download", description: "When you're happy with the results, you can download all the image prompts as a text file or all the generated images as a zip file." },
  ],
  promptHelperTitle: "Prompt Helper (Click to add)",
  promptHelperTags: {
    cam: { group: "CAM (Camera)", tags: [{ tag: "[CAM] ", desc: "Shot, angle, movement" }] },
    set: { group: "SET (Setting)", tags: [{ tag: "[SET] ", desc: "Environment, lighting" }] },
    char: { group: "CHAR (Character)", tags: [{ tag: "[CHAR] ", desc: "Character description" }] },
    action: { group: "ACTION (Action)", tags: [{ tag: "[ACTION] ", desc: "Plot-driving physical action" }] },
    perf: { group: "PERF (Performance)", tags: [{ tag: "[PERF] ", desc: "Emotion, expression, how the action is done" }] },
    snd: { group: "SND (Sound)", tags: [{ tag: "[SND] ", desc: "Sound effects, music" }] },
    vo: { group: "VO (Voiceover)", tags: [{ tag: "[VO] \"\"", desc: "Dialogue or narration" }] },
    style: { group: "STYLE (Style)", tags: [{ tag: "[STYLE] ", desc: "The overall visual style" }] },
  },
  systemInstruction_generateStoryIdea: (style) => `You are a creative assistant. Generate a short, single-paragraph story idea suitable for a short video. The story should be interesting and visually compelling. The desired visual style is "${style}". Keep the idea concise and focused. The language of the response must be the same as the user's prompt.`,
  systemInstruction_generateScript: (config) => `You are a scriptwriter. Based on the provided story idea, characters, and video configuration, write a complete script. The script should be suitable for a video of approximately ${config.duration} seconds.
- The script must be detailed, describing actions, settings, and character emotions.
- ${config.includeDialogue ? `Include dialogue for the characters in the specified language: ${config.dialogueLanguage}. Format dialogue as "CHARACTER NAME: Dialogue text."` : "Do not include any dialogue. The script should be for a video with only background music and visual storytelling."}
- Ensure the pacing fits the short video format.
- The tone should match the visual style: "${config.style}".`,
  systemInstruction_generateScenes: (config, isContinuation) => `You are a professional cinematographer and AI prompt engineer. Your task is to break down the provided script into a sequence of scenes for a video storyboard. Each scene should correspond to roughly 8 seconds of screen time. The total video duration is ${config.duration} seconds.

**CRITICAL INSTRUCTION: The visual style for EVERY scene must be: "${config.style}".**

**Output Structure for Each Scene Prompt:**
You MUST generate the 'prompt' string for each scene following this exact structure, including all tags in order:
\`[CAM] [SET] [CHAR] [ACTION] [PERF] [SND] ${config.includeDialogue ? '[VO] ' : ''}[STYLE]\`

**Tag Definitions:**
-   **[CAM]**: Detailed camera shot, angle, and movement (e.g., "Wide shot, low angle, camera slowly pushes in...").
-   **[SET]**: Description of the setting, environment, and cinematic lighting (e.g., "A neon-lit futuristic city street at night, rain-slicked pavement reflecting the glowing signs...").
-   **[CHAR]**: Full description of any characters in the scene.
-   **[ACTION]**: The primary physical actions that drive the plot (e.g., "The character picks up the glowing artifact...").
-   **[PERF]**: The character's performance—how they perform the action, their emotions, and expressions (e.g., "with a look of awe and trembling hands...").
-   **[SND]**: The sound design, including ambient noise, sound effects, and emotional music cues.
-   **[VO]**: ${config.includeDialogue ? `Voiceover or dialogue in the specified language (${config.dialogueLanguage}).` : `This tag should be OMITTED as dialogue is disabled.`}
-   **[STYLE]**: The visual style. **You MUST use the following style for every scene: "${config.style}".**

**General Rules:**
1.  Generate approximately ${config.duration / 8} scenes in total.
2.  Provide \`scene_id\` (sequential integer), \`time\` ("MM:SS" format), and \`prompt\` (string following the structure above).
3.  The entire prompt must be in English, except for the [VO] tag content if dialogue is enabled.
${isContinuation
    ? "4. **Continuation Task:** You have already generated some scenes. Continue from where you left off, ensuring the new scene_ids and timestamps are sequential and correct. Do not repeat any scenes."
    : ""
}

**Output Format:**
- You MUST output a single, valid JSON object containing one key: "scenes".
- The value of "scenes" must be an array of scene objects.
- Do not include any text, explanations, or markdown formatting before or after the JSON object.

**Example of a valid prompt string within the JSON:**
"[CAM] Close-up shot, eye-level angle. [SET] A wooden table in a sunlit cafe, steam rising from a coffee cup. [CHAR] [Character Name] is in frame. [ACTION] They lift the cup to their lips. [PERF] Smiling softly, a look of contentment in their eyes. [SND] Soft cafe ambiance, gentle clinking of porcelain. [VO] \\"This is perfect.\\" [STYLE] ${config.style}"
`,
  systemInstruction_generateCharacters: (duration) => `You are a character designer. Analyze the provided script or story idea for a ${duration}-second video.
  
**Instructions:**
1. Identify the key characters (maximum 3-4).
2. For each character, generate a concise but detailed description. This description will be used to generate a reference image.
3. The description MUST include visual details like:
    - Gender, approximate age.
    - Hair color and style.
    - Eye color.
    - Clothing style and colors.
    - Distinguishing features (e.g., glasses, a scarf, a unique tattoo).
    - Overall mood or personality (e.g., cheerful, mysterious, tired).

**Output Format:**
- You MUST output a single, valid JSON object.
- The JSON object must contain one key: "characters".
- The value of "characters" must be an array of objects, where each object has two keys: "name" (string) and "description" (string).
- Do not include any text, explanations, or markdown formatting before or after the JSON object.

Example of a valid response:
{
  "characters": [
    {
      "name": "Alex",
      "description": "A male in his early 20s with messy, short brown hair and green eyes. He wears a red hoodie, blue jeans, and white sneakers. He has a friendly, energetic expression and wears thin-rimmed glasses."
    },
    {
      "name": "Luna",
      "description": "A female in her late teens with long, wavy purple hair and dark brown eyes. She's dressed in a black leather jacket, a grey t-shirt, and ripped black jeans. She has a thoughtful, mysterious aura and a small silver moon earring."
    }
  ]
}`
};

const vi: TranslationKeys = {
  ...en, // Default to English if not translated
  appTitle: "Storyboard AI",
  appDescription: "Tạo kịch bản và storyboard cho video bằng AI",
  newProjectButton: "Dự án mới",
  guideButtonTooltip: "Hiển thị hướng dẫn",
  languageLabel: "Ngôn ngữ",
  untitledProject: "Dự án chưa có tên",
  referenceCharactersLabel: "Nhân vật tham chiếu",
  analyzingScript: "Đang phân tích...",
  autoGenerateButton: "Tự động tạo từ ý tưởng",
  characterNamePlaceholder: "Tên nhân vật...",
  removeCharacterButton: "Xóa",
  characterDescriptionPlaceholder: "Mô tả chi tiết về nhân vật (ngoại hình, tính cách, vai trò trong câu chuyện, v.v.). Càng chi tiết, hình ảnh tạo ra càng đẹp.",
  characterImageLabel: "Ảnh tham chiếu",
  noImageGenerated: "Chưa có ảnh nào được tạo.",
  generatingImageButton: "Đang tạo...",
  generateImageButton: "Tạo ảnh",
  addCharacterButton: "+ Thêm nhân vật",
  storyIdeaLabel: "Ý tưởng câu chuyện / Tóm tắt",
  suggestingIdeaButton: "Đang đề xuất...",
  suggestIdeaButton: "Đề xuất ý tưởng",
  storyIdeaPlaceholder: "Mô tả cốt truyện cho video của bạn. Ví dụ: 'Một video ngắn, hài hước về một chú mèo học cách dùng điện thoại và đặt mua quá nhiều cỏ mèo.'",
  generatedScriptLabel: "Kịch bản đã tạo",
  videoSettingsLabel: "Cài đặt Video",
  durationLabel: "Thời lượng video ước tính (phút)",
  durationPlaceholder: "ví dụ: 2",
  durationFeedback: (scenes, minutes, seconds) => `~${scenes} cảnh, thời lượng cuối cùng: ${minutes} phút ${seconds} giây.`,
  styleLabel: "Phong cách hình ảnh",
  dialogueSettingsLabel: "Hội thoại",
  dialogueOffLabel: "Không hội thoại / Chỉ nhạc nền",
  dialogueOnLabel: "Bao gồm hội thoại",
  dialogueLanguageLabel: "Ngôn ngữ hội thoại",
  generatingScriptButton: "Đang tạo kịch bản...",
  generatingStoryboardButton: "Đang tạo storyboard...",
  generateStoryboardButton: "Tạo Storyboard",
  generateScriptButton: "Tạo Kịch bản",
  sceneLabel: "Cảnh",
  timeLabel: "Thời gian",
  promptLabel: "Prompt hình ảnh",
  promptHelperTooltip: "Hỗ trợ prompt",
  sceneImageLabel: "Ảnh của cảnh",
  selectReferenceImageLabel: "Ảnh nhân vật tham chiếu",
  noReferenceImagesAvailable: "Không có ảnh nhân vật",
  timelineTitle: "Dòng thời gian Storyboard",
  downloadButton: "Tải Prompt",
  primaryCharacterLabel: "Nhân vật chính để tạo hàng loạt",
  selectPrimaryCharacterPrompt: "Chọn một nhân vật...",
  generatingAllImagesButton: "Đang tạo tất cả...",
  generateAllImagesButton: "Tạo tất cả ảnh",
  downloadAllImagesButton: "Tải tất cả ảnh",
  emptyTimelineTitle: "Storyboard của bạn đang trống",
  emptyTimelineDescription: "Tạo một kịch bản và storyboard để xem các cảnh của bạn ở đây.",
  loaderText: "Đang tạo...",
  generationComplete: "Hoàn tất!",
  generatingScene: (current, total) => `Đang tạo cảnh ${current} trên ${total}...`,
  generationStatusPreparing: "Đang chuẩn bị tạo các cảnh...",
  generationStatusRequesting: (batch) => `Đang yêu cầu lô cảnh #${batch}...`,
  errorGeneratingImage: "Đã xảy ra lỗi khi tạo ảnh.",
  generationIncompleteError: (current, total) => `Quá trình tạo đã dừng. Chỉ có ${current} trên ${total} cảnh được tạo. Bạn có muốn thử tiếp tục không?`,
  newProjectConfirmationTitle: "Bắt đầu dự án mới?",
  newProjectConfirmationMessage: "Bạn có chắc muốn bắt đầu một dự án mới không? Mọi tiến trình chưa lưu sẽ bị mất.",
  confirmButton: "Xác nhận",
  cancelButton: "Hủy",
  resumeGenerationTitle: "Tiếp tục tạo?",
  resumeButton: "Tiếp tục",
  finishForNowButton: "Để sau",
  continueGenerationTitle: 'Tiếp tục tạo?',
  continueGenerationMessage: (generated, total) => `Đã tạo thành công ${generated} trên ${total} cảnh. Bạn có muốn tiếp tục không?`,
  continueGenerationButton: 'Tiếp tục',
  guideModalTitle: "Hướng dẫn sử dụng Storyboard AI",
  guideSteps: [
    { title: "Đặt phong cách video", description: "Chọn một phong cách hình ảnh và thời lượng mong muốn cho video của bạn. Điều này sẽ định hướng toàn bộ quá trình tạo." },
    { title: "Xác định ý tưởng câu chuyện", description: "Viết một bản tóm tắt ngắn hoặc ý tưởng cho câu chuyện của bạn. Bạn cũng có thể sử dụng nút 'Đề xuất ý tưởng' để nhận một ý tưởng ngẫu nhiên." },
    { title: "Tạo nhân vật", description: "Thêm các nhân vật chính với mô tả chi tiết. Bạn có thể viết thủ công hoặc sử dụng tính năng 'Tự động tạo' sau khi cung cấp ý tưởng câu chuyện. Sau đó, tạo một hình ảnh tham chiếu cho mỗi nhân vật để đảm bảo tính nhất quán." },
    { title: "Tạo kịch bản", description: "Nhấp vào 'Tạo Kịch bản'. AI sẽ viết một kịch bản dựa trên câu chuyện, nhân vật và cài đặt của bạn." },
    { title: "Tạo storyboard", description: "Khi kịch bản đã sẵn sàng, nút sẽ chuyển thành 'Tạo Storyboard'. Nhấp vào đó để tạo danh sách các cảnh với các prompt hình ảnh." },
    { title: "Tạo ảnh cho cảnh", description: "Đối với mỗi cảnh, bạn có thể chỉnh sửa prompt và sau đó tạo một hình ảnh. Để tạo hình ảnh cho tất cả các cảnh cùng một lúc, hãy chọn một nhân vật chính và nhấp vào 'Tạo tất cả ảnh'." },
    { title: "Tải xuống", description: "Khi bạn hài lòng với kết quả, bạn có thể tải xuống tất cả các prompt hình ảnh dưới dạng tệp văn bản hoặc tất cả các hình ảnh đã tạo dưới dạng tệp zip." },
  ],
  promptHelperTitle: "Hỗ trợ Prompt (Nhấp để thêm)",
  promptHelperTags: {
    cam: { group: "CAM (Máy quay)", tags: [{ tag: "[CAM] ", desc: "Cảnh quay, góc máy, chuyển động" }] },
    set: { group: "SET (Bối cảnh)", tags: [{ tag: "[SET] ", desc: "Môi trường, ánh sáng" }] },
    char: { group: "CHAR (Nhân vật)", tags: [{ tag: "[CHAR] ", desc: "Mô tả nhân vật" }] },
    action: { group: "ACTION (Hành động)", tags: [{ tag: "[ACTION] ", desc: "Hành động vật lý chính" }] },
    perf: { group: "PERF (Diễn xuất)", tags: [{ tag: "[PERF] ", desc: "Cảm xúc, biểu cảm, cách thực hiện" }] },
    snd: { group: "SND (Âm thanh)", tags: [{ tag: "[SND] ", desc: "Hiệu ứng âm thanh, nhạc" }] },
    vo: { group: "VO (Lời thoại)", tags: [{ tag: "[VO] \"\"", desc: "Hội thoại hoặc lời dẫn" }] },
    style: { group: "STYLE (Phong cách)", tags: [{ tag: "[STYLE] ", desc: "Phong cách hình ảnh tổng thể" }] },
  },
  systemInstruction_generateStoryIdea: (style) => `Bạn là một trợ lý sáng tạo. Tạo một ý tưởng câu chuyện ngắn, trong một đoạn văn, phù hợp cho một video ngắn. Câu chuyện nên thú vị và hấp dẫn về mặt hình ảnh. Phong cách hình ảnh mong muốn là "${style}". Giữ ý tưởng ngắn gọn và tập trung. Ngôn ngữ của phản hồi phải giống với ngôn ngữ của prompt của người dùng.`,
  systemInstruction_generateScript: (config) => `Bạn là một nhà biên kịch. Dựa trên ý tưởng câu chuyện, nhân vật và cấu hình video được cung cấp, hãy viết một kịch bản hoàn chỉnh. Kịch bản phải phù hợp với một video có thời lượng khoảng ${config.duration} giây.
- Kịch bản phải chi tiết, mô tả hành động, bối cảnh và cảm xúc của nhân vật.
- ${config.includeDialogue ? `Bao gồm hội thoại cho các nhân vật bằng ngôn ngữ được chỉ định: ${config.dialogueLanguage}. Định dạng hội thoại là "TÊN NHÂN VẬT: Lời thoại."` : "Không bao gồm bất kỳ lời thoại nào. Kịch bản nên dành cho một video chỉ có nhạc nền và kể chuyện bằng hình ảnh."}
- Đảm bảo nhịp độ phù hợp với định dạng video ngắn.
- Giọng điệu phải phù hợp với phong cách hình ảnh: "${config.style}".`,
  systemInstruction_generateScenes: (config, isContinuation) => `Bạn là một nhà quay phim chuyên nghiệp và kỹ sư prompt AI. Nhiệm vụ của bạn là chia nhỏ kịch bản được cung cấp thành một chuỗi các cảnh cho một storyboard video. Mỗi cảnh nên tương ứng với khoảng 8 giây trên màn hình. Tổng thời lượng video là ${config.duration} giây.

**CHỈ THỊ QUAN TRỌNG: Phong cách hình ảnh cho MỌI cảnh phải là: "${config.style}".**

**Cấu trúc đầu ra cho mỗi Prompt cảnh:**
Bạn PHẢI tạo chuỗi 'prompt' cho mỗi cảnh theo đúng cấu trúc này, bao gồm tất cả các thẻ theo thứ tự:
\`[CAM] [SET] [CHAR] [ACTION] [PERF] [SND] ${config.includeDialogue ? '[VO] ' : ''}[STYLE]\`

**Định nghĩa các thẻ:**
-   **[CAM]**: Cảnh quay, góc máy và chuyển động chi tiết (ví dụ: "Wide shot, low angle, camera slowly pushes in...").
-   **[SET]**: Mô tả bối cảnh, môi trường và ánh sáng điện ảnh (ví dụ: "A neon-lit futuristic city street at night, rain-slicked pavement reflecting the glowing signs...").
-   **[CHAR]**: Mô tả đầy đủ về bất kỳ nhân vật nào trong cảnh.
-   **[ACTION]**: Các hành động vật lý chính thúc đẩy cốt truyện (ví dụ: "The character picks up the glowing artifact...").
-   **[PERF]**: Diễn xuất của nhân vật—cách họ thực hiện hành động, cảm xúc và biểu cảm của họ (ví dụ: "with a look of awe and trembling hands...").
-   **[SND]**: Thiết kế âm thanh, bao gồm tiếng ồn xung quanh, hiệu ứng âm thanh và các tín hiệu âm nhạc cảm xúc.
-   **[VO]**: ${config.includeDialogue ? `Lời dẫn hoặc hội thoại bằng ngôn ngữ được chỉ định (${config.dialogueLanguage}).` : `Thẻ này nên được BỎ QUA vì hội thoại đã bị tắt.`}
-   **[STYLE]**: Phong cách hình ảnh. **Bạn PHẢI sử dụng phong cách sau đây cho mọi cảnh: "${config.style}".**

**Quy tắc chung:**
1.  Tạo khoảng ${config.duration / 8} cảnh tổng cộng.
2.  Cung cấp \`scene_id\` (số nguyên tuần tự), \`time\` (định dạng "MM:SS"), và \`prompt\` (chuỗi theo cấu trúc trên).
3.  Toàn bộ prompt phải bằng tiếng Anh, ngoại trừ nội dung thẻ [VO] nếu hội thoại được bật.
${isContinuation
    ? "4. **Nhiệm vụ tiếp tục:** Bạn đã tạo một số cảnh. Hãy tiếp tục từ nơi bạn đã dừng lại, đảm bảo scene_id và dấu thời gian mới là tuần tự và chính xác. Không lặp lại bất kỳ cảnh nào."
    : ""
}

**Định dạng đầu ra:**
- Bạn PHẢI xuất ra một đối tượng JSON hợp lệ duy nhất chứa một khóa: "scenes".
- Giá trị của "scenes" phải là một mảng các đối tượng cảnh.
- Không bao gồm bất kỳ văn bản, giải thích hoặc định dạng markdown nào trước hoặc sau đối tượng JSON.

**Ví dụ về một chuỗi prompt hợp lệ trong JSON:**
"[CAM] Close-up shot, eye-level angle. [SET] A wooden table in a sunlit cafe, steam rising from a coffee cup. [CHAR] [Character Name] is in frame. [ACTION] They lift the cup to their lips. [PERF] Smiling softly, a look of contentment in their eyes. [SND] Soft cafe ambiance, gentle clinking of porcelain. [VO] \\"This is perfect.\\" [STYLE] ${config.style}"
`,
  systemInstruction_generateCharacters: (duration) => `Bạn là một nhà thiết kế nhân vật. Phân tích kịch bản hoặc ý tưởng câu chuyện được cung cấp cho một video dài ${duration} giây.

**Hướng dẫn:**
1. Xác định các nhân vật chính (tối đa 3-4).
2. Đối với mỗi nhân vật, tạo một mô tả ngắn gọn nhưng chi tiết. Mô tả này sẽ được sử dụng để tạo một hình ảnh tham chiếu.
3. Mô tả PHẢI bao gồm các chi tiết hình ảnh như:
    - Giới tính, tuổi tác gần đúng.
    - Màu tóc và kiểu tóc.
    - Màu mắt.
    - Phong cách và màu sắc quần áo.
    - Các đặc điểm phân biệt (ví dụ: kính, khăn quàng cổ, hình xăm độc đáo).
    - Tâm trạng hoặc tính cách chung (ví dụ: vui vẻ, bí ẩn, mệt mỏi).

**Định dạng đầu ra:**
- Bạn PHẢI xuất ra một đối tượng JSON hợp lệ duy nhất.
- Đối tượng JSON phải chứa một khóa: "characters".
- Giá trị của "characters" phải là một mảng các đối tượng, trong đó mỗi đối tượng có hai khóa: "name" (chuỗi) và "description" (chuỗi).
- Không bao gồm bất kỳ văn bản, giải thích hoặc định dạng markdown nào trước hoặc sau đối tượng JSON.

Ví dụ về phản hồi hợp lệ:
{
  "characters": [
    {
      "name": "Alex",
      "description": "Một nam thanh niên khoảng 20 tuổi với mái tóc nâu ngắn, rối và đôi mắt xanh lục. Anh ấy mặc áo hoodie màu đỏ, quần jean xanh và giày thể thao trắng. Anh ấy có biểu cảm thân thiện, năng động và đeo kính gọng mỏng."
    },
    {
      "name": "Luna",
      "description": "Một nữ thiếu niên với mái tóc dài, lượn sóng màu tím và đôi mắt nâu sẫm. Cô ấy mặc áo khoác da màu đen, áo phông màu xám và quần jean đen rách. Cô ấy có một khí chất trầm tư, bí ẩn và một chiếc khuyên tai hình mặt trăng nhỏ bằng bạc."
    }
  ]
}`
};

export const translations = {
  en,
  vi,
};
