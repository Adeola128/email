import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-3.1-pro-preview";

const BRAND_GUIDELINES = `
  Brand: Oratora
  Color Palette:
  - Deep Navy Blue: #000066 (Primary)
  - Action Green: #11B018 (CTA/Buttons)
  - White: #FFFFFF (Backgrounds)
  - Brown: #996633 (Accents)
  
  Typography:
  - Primary Heading: Montserrat (Bold)
  - Secondary Heading: Poppins (Semi-bold)
  
  Layout Rules:
  - Maintain generous margins (white space).
  - CTA buttons MUST be Action Green (#11B018).
  - Use clean, thin-line or flat icons.
`;

export const generateEmailTemplate = async (prompt: string, layout?: string, styleReference?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  const systemInstruction = `
    You are an expert email designer and developer for the brand Oratora. 
    Your task is to generate a high-quality, responsive HTML email template based on the user's request.
    
    Brand Guidelines:
    ${BRAND_GUIDELINES}
    
    Layout Request: ${layout || 'standard'}
    
    ${styleReference ? `
    STYLE REFERENCE:
    The user has provided an existing email template as a style reference. 
    Analyze the following HTML and replicate its visual style (colors, spacing, typography, button styles, shadows, etc.) as closely as possible while still adhering to the Oratora brand identity where applicable.
    
    Reference HTML:
    ${styleReference}
    ` : ''}
    
    Guidelines:
    1. Use inline CSS for all styling.
    2. Use a container with max-width: 600px.
    3. Use the specified brand fonts (Montserrat for headings, Poppins for secondary text).
    4. Include a placeholder for the recipient's name using {{name}}.
    5. Ensure the design is modern, clean, and visually appealing.
    6. Return ONLY the HTML code. Do not include any markdown formatting like \`\`\`html or explanations.
    7. Use the brand color palette strictly unless the style reference suggests a specific, intentional variation that enhances the design.
    8. Ensure it's mobile-responsive.
    9. If layout is 'mosaic', use a grid-like image gallery.
    10. If layout is 'alternating', use zig-zag image/text sections.
    11. If layout is 'triple-column', use a 3-column feature section.
    12. If layout is 'card-deck', use shadow-boxed cards for content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction.trim(),
        temperature: 0.7,
      },
    });

    let text = response.text || '';
    text = text.replace(/```html/gi, '').replace(/```/g, '').trim();
    return text;
  } catch (error) {
    console.error("Error generating email template:", error);
    throw error;
  }
};

export const restyleEmailTemplate = async (existingHtml: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  const systemInstruction = `
    You are an expert email designer for Oratora. 
    Your task is to RE-STYLE the provided HTML email template to match the Oratora brand guidelines.
    
    Brand Guidelines:
    ${BRAND_GUIDELINES}
    
    Instructions:
    1. Keep the content and structure of the original HTML.
    2. Update all colors to match the Oratora palette (#000066, #11B018, #FFFFFF, #996633).
    3. Update all fonts to Montserrat (headings) and Poppins (body).
    4. Ensure all buttons are Action Green (#11B018).
    5. Add generous padding and margins if missing.
    6. Return ONLY the updated HTML code. No markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ parts: [{ text: `Restyle this HTML: \n\n ${existingHtml}` }] }],
      config: {
        systemInstruction: systemInstruction.trim(),
        temperature: 0.5,
      },
    });

    let text = response.text || '';
    text = text.replace(/```html/gi, '').replace(/```/g, '').trim();
    return text;
  } catch (error) {
    console.error("Error restyling email template:", error);
    throw error;
  }
};
