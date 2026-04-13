import { google } from '@ai-sdk/google';
import { streamText, Message } from 'ai';


async function verifyWithArmorIQ(userInput: string) {
  console.log(`🛡️ ArmorIQ Checking User Input...`);
  const text = userInput.toLowerCase();

  // Rule 1: Prevent Prescriptions
  if (text.includes('prescribe') || text.includes('prescription')) {
    return { 
      allowed: false, 
      reason: "BLOCKED: AI agents are strictly prohibited from prescribing medication or acting as a licensed pharmacist." 
    };
  }

  // Rule 2: Prevent Exact Dosage Recommendations
  // This regex catches patterns like "50mg", "10 ml", "200mcg"
  if (text.match(/\d+\s*(mg|ml|mcg|grams)/)) {
    return { 
      allowed: false, 
      reason: "BLOCKED: AI agents cannot recommend or verify specific medication dosages. This violates medical safety boundaries." 
    };
  }

  console.log("✅ ArmorIQ Approved Input.");
  return { allowed: true, reason: "Input passes safety policies." };
}

const systemPrompt = `
You are a responsible AI medical assistant.

Your role:
- Provide general medical guidance based on user symptoms
- DO NOT give final diagnoses
- Classify severity: LOW, MEDIUM, HIGH only if the user is asking about symptoms or health concerns. Do not classify severity for general first aid queries.

Guidelines:
- LOW → mild symptoms → give home care advice
- MEDIUM → moderate concern → suggest precautions + doctor visit if needed
- HIGH → serious symptoms → strongly recommend immediate medical help

Rules:
- Be calm, clear, and helpful
- Use simple language (no complex medical jargon)
- Never panic the user unnecessarily
- Always prioritize safety

Respond ONLY in this format:

Severity: <LOW/MEDIUM/HIGH/NONE>
Advice: <clear explanation and next steps>
`;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  // Get the latest message the user just typed
  const latestMessage = messages[messages.length - 1];


  if (latestMessage && latestMessage.role === 'user') {
    const armorCheck = await verifyWithArmorIQ(latestMessage.content);

    if (!armorCheck.allowed) {
      console.log("🚨 ARMORIQ BLOCK TRIGGERED!");
      
      // The Hackathon Trick: Instead of breaking the app with an HTTP error,
      // we force the AI to stream the ArmorIQ block message back to the chat UI!
      const blockStream = streamText({
        model: google('gemma-3-4b-it'),
        prompt: `You are a security firewall. Output EXACTLY this text and nothing else: "🚨 **ARMORIQ SHIELD ACTIVATED**\n\nPolicy Violation: ${armorCheck.reason}"`,
      });
      
      return blockStream.toDataStreamResponse();
    }
  }

  
  const result = streamText({
    model: google('gemma-3-4b-it'),
    system: systemPrompt,
    messages: messages, 
  });

  return result.toDataStreamResponse();
}
