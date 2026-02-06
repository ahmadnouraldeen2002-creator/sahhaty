import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';
/**
 * Helper to clean JSON string if the model wraps it in markdown blocks
 */
const cleanJson = (text) => {
    if (!text)
        return "{}";
    // Remove ```json and ``` or just ``` at start/end
    return text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
};
/**
 * Generates an initial health plan (Diet + Workout) based on user profile.
 */
export const generateInitialPlan = async (profile) => {
    // STRICT LANGUAGE ENFORCEMENT
    let targetLanguage = 'English';
    if (profile.language === 'ar' || profile.language === 'Arabic')
        targetLanguage = 'Arabic (العربية)';
    else if (profile.language === 'fr' || profile.language === 'French')
        targetLanguage = 'French (Français)';
    const prompt = `
    You are an expert nutritionist and fitness coach.
    Create a 100% personalized daily diet and workout plan for this user.
    
    IMPORTANT: THE OUTPUT MUST BE IN ${targetLanguage} ONLY.
    If the target is Arabic or French, do NOT use English for meal names or descriptions unless necessary.

    User Profile:
    - Name: ${profile.name}
    - Age: ${profile.age}, Gender: ${profile.gender}
    - Height: ${profile.height}cm, Weight: ${profile.weight}kg
    - Activity: ${profile.activityLevel}
    - Goal: ${profile.goal}
    - Budget: ${profile.budget} (if low, use cheap ingredients like eggs, lentils, oats)
    - Work Schedule: Starts at ${profile.workStart} and Ends at ${profile.workEnd}.
    - Lunch Break: ${profile.hasLunchBreak ? "YES" : "NO"} ${profile.hasLunchBreak ? `at ${profile.breakTime}` : ""}.
    - Employment Status: ${profile.employmentStatus}
    - Has Children: ${profile.hasChildren ? "YES" : "NO"}
    - Restrictions: ${profile.dietaryRestrictions.join(', ')}

    CRITICAL LIFESTYLE ADJUSTMENTS (MUST FOLLOW):
    1. **If Homemaker + Children**: Provide meals that are family-friendly but with portion control, and quick 20-min workouts.
    2. **If Full-time Job**: Lunch must be practical for an office (cold or microwaveable). Breakfast must be fast.
    3. **If Unemployed**: Focus on highly economical meals and more flexible workout times.
    4. **If Student**: Focus on brain food, cheap meals, and stress-relief exercises.

    INSTRUCTIONS FOR DIET - STRICT TIMING RULES:
    1. **Breakfast**: MUST be scheduled BEFORE work/school starts (${profile.workStart}).
    2. **Lunch**: 
       - IF Lunch Break is YES: Schedule it EXACTLY at ${profile.breakTime || "12:00"}.
       - IF Lunch Break is NO: Schedule a "Portable/Hand-held Meal" (Sandwich, Wrap, Fruit) at work.
    3. **Snack**: Schedule it approx 3 hours after Lunch.
    4. **Dinner**: MUST be scheduled AFTER work ends (${profile.workEnd}).

    INSTRUCTIONS FOR WORKOUT:
    1. **Timing**: 
       - If Work ends late (after 6 PM), suggest workout in the Morning OR "Late Night Relaxing Workout".
       - If Work ends early (before 5 PM), suggest workout "After Work".
    2. Provide "youtubeSearchQuery" (English - KEEP THIS IN ENGLISH for better search results).
    3. Provide "estimatedCaloriesBurned".

    JSON Format required (Pure JSON, no Markdown):
    {
      "dietPlan": {
        "dailyCalories": number,
        "meals": {
          "breakfast": { "name": "string", "description": "Time: [Specific Time]. Details...", "calories": number, "protein": number, "carbs": number, "fat": number, "alternatives": ["string"] },
          "lunch": { ...same },
          "dinner": { ...same },
          "snack": { ...same }
        }
      },
      "workoutPlan": {
        "type": "Cardio / Strength / Mixed",
        "exercises": [
          { 
            "name": "string", 
            "duration": "e.g. 30 sec", 
            "description": "instructions",
            "youtubeSearchQuery": "english search term",
            "bestTime": "e.g. 6:00 PM (After Work)",
            "estimatedCaloriesBurned": number
          },
          ... (3 to 5 exercises)
        ]
      }
    }
  `;
    try {
        // Create a timeout promise that rejects after 45 seconds
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 45000));
        // Race the API call against the timeout
        const apiCall = ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        const response = await Promise.race([apiCall, timeoutPromise]);
        const cleanedText = cleanJson(response.text || "{}");
        return JSON.parse(cleanedText);
    }
    catch (error) {
        console.error("Error generating plan:", error);
        throw error;
    }
};
/**
 * Chat with the AI Coach.
 */
export const chatWithCoach = async (currentMessage, history, profile, dietPlan, workoutPlan) => {
    let targetLanguage = 'English';
    if (profile?.language === 'ar' || profile?.language === 'Arabic')
        targetLanguage = 'Arabic';
    else if (profile?.language === 'fr' || profile?.language === 'French')
        targetLanguage = 'French';
    // SYSTEM INSTRUCTION WITH FOUNDER INFO AND CONTEXT
    const systemInstruction = `
    You are 'Sahhaty', a friendly, motivating, and expert personal health coach.
    
    IMPORTANT SYSTEM IDENTITY:
    - App Name: Sahhaty (صحتي).
    - Developing Company: Ahmad Company (شركة Ahmad).
    - Founder/Owner: Noor Aldin Ahmad (نور الدين أحمد).
    
    IMPORTANT LANGUAGE:
    - You MUST speak in ${targetLanguage}.

    RULES FOR REVEALING FOUNDER INFORMATION (STRICT):
    1. **General Identity Questions** (e.g., "Who made you?", "Who is the owner?"):
       - Answer ONLY: "I was developed by Ahmad Company, founded by Noor Aldin Ahmad."
       - Do NOT mention his age, location, or origin yet.

    2. **Specific Personal Questions** (e.g., "How old is Noor Aldin?", "Where does he live?", "Who is he?"):
       - Answer: "Noor Aldin is 23 years old and currently lives in France."

    3. **Deep/Background Questions** (e.g., "Where is he from?", "What is his story?", "Tell me more about him"):
       - Answer: "Noor Aldin was born in Kurdistan and is of Kurdish origin. He lived most of his life in Lebanon before moving to France to study programming. After establishing 'Ahmad Company', this website (Sahhaty) was the first project he designed there."

    CURRENT CONTEXT (User's active plan):
    Diet Plan: ${dietPlan ? JSON.stringify(dietPlan) : "Not generated yet"}
    Workout Plan: ${workoutPlan ? JSON.stringify(workoutPlan) : "Not generated yet"}
    User Profile: ${profile ? JSON.stringify(profile) : "No profile yet."}

    GOALS:
    1. If the user asks "What is my breakfast/lunch?" look at the Diet Plan above and answer.
    2. INGREDIENT REPLACEMENT (CRITICAL): If the user says "I don't have X" or "Change my meal, I have Y":
       - You MUST ask them what ingredients they DO have if they haven't said it.
       - Once they provide ingredients, calculate the EXACT portion needed to match the ORIGINAL meal's calories.
       - Example: If original breakfast is 400 cal, and they have only Bananas (89 cal/100g), tell them "You need to eat approx 450g of Bananas to match the 400 calories" (Logic: 400/89 * 100).
       - Be precise. Do not just say "Eat bananas". Say "Eat 3 large bananas (approx 400g)".
    3. Be encouraging.
  `;
    // Convert history to Gemini format
    const recentHistory = history.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    try {
        const chat = ai.chats.create({
            model: MODEL_NAME,
            config: { systemInstruction },
            history: recentHistory,
        });
        const result = await chat.sendMessage({ message: currentMessage });
        return result.text;
    }
    catch (error) {
        console.error("Chat error:", error);
        if (targetLanguage === 'French') {
            return "Désolé, erreur de connexion. Veuillez réessayer.";
        }
        else if (targetLanguage === 'Arabic') {
            return "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.";
        }
        return "Sorry, connection error. Please try again.";
    }
};
