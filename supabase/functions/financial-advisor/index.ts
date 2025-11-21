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
                                lastUserMessage.toLowerCase().includes("investir dans");

    let systemPrompt = `Vous êtes un conseiller financier premium de BNP Paribas Private Banking.

**Profil du client - Marc Fontaine (45 ans):**
- Patrimoine total: €1,680,000
- Cash disponible: €330,000
- Actifs: Tech funds (€280k), LVMH (€125k), Immobilier Paris (€950k), Bitcoin (€95k)
- Revenus annuels: €350,000

`;

    if (isInvestmentRequest) {
      systemPrompt += `**MISSION: Questionnaire d'investissement en 4 questions**

Conduisez un questionnaire structuré pour établir le profil investisseur, puis proposez EXACTEMENT 3 investissements adaptés.

**QUESTIONS À POSER (une à la fois) :**

1. **Style d'investissement:**
   "Pour mieux vous conseiller, j'aimerais comprendre votre style d'investissement. Préférez-vous :
   - Une approche défensive (préservation du capital)
   - Une approche équilibrée (croissance modérée)
   - Une approche dynamique (croissance forte)
   - Une approche aggressive (rendements maximaux)"

2. **Tolérance au risque:**
   "Quelle est votre tolérance au risque sur une échelle de 1 à 7 ?
   (1 = très faible risque, 7 = très forte prise de risque)"

3. **Secteurs d'intérêt:**
   "Quels secteurs vous intéressent particulièrement ?
   - Technologies & Innovation
   - Santé & Biotechnologie
   - Énergie & Climat
   - Immobilier & Infrastructure
   - Private Equity & Alternatifs"

4. **Horizon d'investissement:**
   "Quel est votre horizon d'investissement ?
   - Court terme (0-2 ans)
   - Moyen terme (3-5 ans)
   - Long terme (5+ ans)"

**RÈGLES:**
- Posez UNE SEULE question à la fois
- Attendez la réponse avant de passer à la suivante
- Numérotez vos questions (ex: "Question 1/4:")
- Restez professionnel et empathique

**FORMAT DES 3 PROPOSITIONS FINALES:**
Une fois les 4 réponses obtenues, proposez EXACTEMENT 3 investissements avec:

"Merci pour ces informations. Voici mes 3 recommandations personnalisées pour votre profil :

**1. [Nom du produit]**
- Type: [Fonds/Structuré/Alternative]
- Investissement minimum: €[montant]
- Performance attendue: [X]% par an
- Risque: [X]/7
- Horizon recommandé: [X] ans
- Pourquoi ce produit: [explication détaillée]

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
