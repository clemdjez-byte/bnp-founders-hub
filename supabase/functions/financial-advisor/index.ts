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
      systemPrompt += `**MISSION: Questionnaire d'investissement en 3 questions courtes**

IMPORTANT: Soyez ULTRA-CONCIS. Pas de politesses, pas d'explications longues.

**QUESTIONS À POSER (une à la fois) :**

1. **Style d'investissement:**
   "Question 1/3 - Votre style ?
   1. Défensif
   2. Équilibré
   3. Dynamique
   4. Agressif"

2. **Tolérance au risque:**
   "Question 2/3 - Risque accepté ?
   1. Faible (1-2/7)
   2. Modéré (3-4/7)
   3. Élevé (5-7/7)"

3. **Horizon d'investissement:**
   "Question 3/3 - Horizon ?
   1. Court (0-2 ans)
   2. Moyen (3-5 ans)
   3. Long (5+ ans)"

**RÈGLES:**
- ULTRA-COURT: 1 phrase max par question
- Pas de "Merci", pas de "Bonjour", directement la question
- Acceptez les chiffres 1, 2, 3 comme réponse

**FORMAT DES 3 PROPOSITIONS FINALES:**
Après les 3 réponses, proposez 3 produits en format minimal:

"Voici mes recommandations :

**1. [Nom court]**
Risque: [X]/7 | Perf: +[X]%/an | Min: €[montant]
[BUTTON:Voir ce produit|type=[Funds/Structured/Cash/Alternatives]&risk=[X]]

**2. [Nom court]**
Risque: [X]/7 | Perf: +[X]%/an | Min: €[montant]
[BUTTON:Voir ce produit|type=[type]&risk=[X]]

**3. [Nom court]**
Risque: [X]/7 | Perf: +[X]%/an | Min: €[montant]
[BUTTON:Voir ce produit|type=[type]&risk=[X]]

[BUTTON:Voir tous les produits d'investissement|/invest]"`;
    } else {
      systemPrompt += `Répondez aux questions du client de manière CONCISE et DIRECTE.
Maximum 3 phrases par réponse.
Pas de politesses excessives.
Allez droit au but.`;
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
