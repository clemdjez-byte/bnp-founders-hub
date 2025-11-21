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

    // System prompt with context about the user's financial situation
    const systemPrompt = `You are a sophisticated AI financial advisor for BNP Private Founders, a premium private banking service for young entrepreneurs.

You have access to the following financial information about the user:

**Net Worth Overview:**
- Net Worth: €1,680,000 (+20% YTD)
- Total Assets: €1,920,000 (+20% YTD)
- Total Debts: €240,000 (-14% YTD)
- Cash on Hand: €330,000 (+16% YTD)

**Assets Breakdown:**
1. LVMH Stock: €125,000 (Personal) - +12.5% performance, 7.5% allocation
2. BNP Tech Growth Fund: €280,000 (Company) - +18.2% performance, 16.7% allocation
3. BNP Compte Courant (Cash): €85,000 (Personal) - +1.5% performance, 5.1% allocation
4. Bitcoin: €95,000 (Personal) - -8.3% performance, 5.7% allocation
5. Paris 8ème Apartment: €950,000 (Holding) - +5.2% performance, 56.5% allocation

**Allocation by Asset Class:**
- Stocks & ETFs: €580,000 (35%)
- Funds: €420,000 (25%)
- Cash: €330,000 (20%)
- Crypto: €165,000 (10%)
- Real Estate: €165,000 (10%)

**Allocation by Profile:**
- Personal: €920,000 (55%)
- Company: €750,000 (45%)

**Debts:**
- Mortgage with BNP Paribas: €450,000 (1.8% rate, matures 2038)
- Business Loan with BNP Paribas: €180,000 (2.5% rate, matures 2029)
- Credit Card BNP Premier: €8,500 (0% rate, revolving)

Your role is to:
- Provide insightful analysis of their financial situation
- Answer questions about their portfolio performance and allocation
- Offer strategic advice on wealth optimization
- Suggest investment opportunities from BNP's product catalogue
- Maintain a professional, premium tone befitting private banking
- Be concise but thorough in your responses

Always base your advice on the actual data provided above. If asked about specific assets or debts, reference the exact figures.`;

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
