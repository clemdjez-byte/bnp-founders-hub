import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Calling AI with messages:", messages);

    // Check if this is an investment profile questionnaire
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const isInvestmentRequest = lastUserMessage.toLowerCase().includes("profil investisseur") || 
                                lastUserMessage.toLowerCase().includes("investir") ||
                                lastUserMessage.toLowerCase().includes("à investir");

    let systemPrompt = `Vous êtes un conseiller financier premium de BNP Paribas Private Banking.

**Profil du client - Marc Fontaine (45 ans):**
- Patrimoine total: €1,680,000
- Cash disponible: €330,000
- Actifs: Tech funds (€280k), LVMH (€125k), Immobilier Paris (€950k), Bitcoin (€95k)
- Revenus annuels: €350,000

`;

    if (isInvestmentRequest) {
      systemPrompt += `**MISSION: Questionnaire d'investissement en 4 questions courtes**

Conduisez un questionnaire structuré pour établir le profil investisseur, puis proposez EXACTEMENT 3 investissements adaptés.

**QUESTIONS À POSER (une à la fois) :**

1. **Style d'investissement:**
   "Question 1/4 - Votre style d'investissement ?
   1. Défensif (sécurité)
   2. Équilibré (croissance modérée)
   3. Dynamique (croissance forte)
   4. Agressif (rendements max)
   
   Répondez par le numéro (1, 2, 3 ou 4)."

2. **Tolérance au risque:**
   "Question 2/4 - Votre tolérance au risque ?
   1. Faible (1-2/7)
   2. Modérée (3-4/7)
   3. Élevée (5-7/7)
   
   Répondez par le numéro (1, 2 ou 3)."

3. **Secteurs d'intérêt:**
   "Question 3/4 - Secteurs qui vous intéressent ?
   1. Tech & Innovation
   2. Santé & Biotech
   3. Énergie & Climat
   4. Immobilier
   5. Private Equity
   
   Répondez par le numéro (1, 2, 3, 4 ou 5)."

4. **Horizon d'investissement:**
   "Question 4/4 - Votre horizon d'investissement ?
   1. Court terme (0-2 ans)
   2. Moyen terme (3-5 ans)
   3. Long terme (5+ ans)
   
   Répondez par le numéro (1, 2 ou 3)."

**RÈGLES:**
- Posez UNE SEULE question à la fois
- Attendez la réponse numérique (1, 2, 3, etc.)
- Questions ultra-courtes et directes
- Acceptez les réponses numériques simples

**FORMAT DES 3 PROPOSITIONS FINALES:**
Une fois les 4 réponses obtenues, proposez EXACTEMENT 3 investissements avec:

"Parfait ! Voici mes 3 recommandations pour vous :

**1. [Nom du produit]**
Type: [Fonds/Structuré/Alternative]
Minimum: €[montant]
Performance: [X]%/an
Risque: [X]/7
Horizon: [X] ans
Pourquoi: [explication courte]

**2. [Nom du produit]**
[même structure]

**3. [Nom du produit]**
[même structure]"`;
    } else {
      systemPrompt += `Vous êtes disponible pour répondre à toutes les questions concernant:
- Le patrimoine du client
- Les marchés financiers
- Des conseils d'investissement généraux
- L'optimisation fiscale
- La gestion de patrimoine

Soyez professionnel, précis et pédagogue.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Financial advisor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
