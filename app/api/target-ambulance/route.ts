import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// 1. 🛡️ ARMORIQ FOR AMBULANCES (Not Prescriptions!)
async function verifyWithArmorIQ(payload: any) {
    console.log(`🛡️ ArmorIQ Checking Ambulance Payload...`);

    // Rule: Prevent sending too many critical patients automatically
    if (payload.severity === "CRITICAL" && payload.criticalCount > 10) {
        return {
            allowed: false,
            reason: "BLOCKED: Mass casualty event detected. AI autonomous routing disabled; manual dispatcher override required."
        };
    }

    console.log("✅ ArmorIQ Approved Ambulance Payload.");
    return { allowed: true, reason: "Payload passes safety policies." };
}

export async function POST(req: Request) {
    try {
        // 1. Parse the exact JSON SuperPlane sends
        const incomingData = await req.json();
        console.log("📡 Received from SuperPlane:", incomingData);

        // 2. Run ArmorIQ pre-flight check
        const armorCheck = await verifyWithArmorIQ(incomingData);

        if (!armorCheck.allowed) {
            console.log("🚨 ARMORIQ BLOCK TRIGGERED!");
            // Send a standard JSON error back to SuperPlane
            return Response.json({
                status: "Blocked by ArmorIQ",
                reason: armorCheck.reason
            }, { status: 403 });
        }

        // 3. The Routing Brain (Hospital Logic)
        const routingPrompt = `
      You are the PulseGrid AI Emergency Routing Agent.
      An ambulance has reported an incident.
      
      Incident Details:
      ${JSON.stringify(incomingData, null, 2)}
      
      Available Hospitals:
      - HOSP-001 (City General): 0 ICU beds available.
      - HOSP-002 (St. Jude): 5 ICU beds available.
      - HOSP-003 (Mercy Hospital): 2 ICU beds available.
      
      CRITICAL INSTRUCTION: Analyze the incident. If there are critical patients, DO NOT route them to HOSP-001.

      Output EXACTLY ONE JSON object matching this format:
      {
        "target_hospital_id": "Chosen hospital ID",
        "patientsRouted": ${incomingData.totalPatients || 0},
        "criticalRouted": ${incomingData.criticalCount || 0},
        "reasoning": "A 1-sentence explanation of why this hospital was chosen."
      }
    `;

        // 4. Use generateText (NOT streamText) so SuperPlane gets a solid block of data
        const { text } = await generateText({
            model: google('gemma-3-4b-it'), // Or gemini-1.5-flash
            prompt: routingPrompt,
        });

        // 5. Clean up the AI output (in case it adds markdown formatting)
        const cleanJsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const plan = JSON.parse(cleanJsonText);

        // 6. Return standard JSON back to SuperPlane
        return Response.json({
            status: "Success",
            plan: plan
        }, { status: 200 });

    } catch (error: any) {
        console.error("🔥 Server Crash Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}