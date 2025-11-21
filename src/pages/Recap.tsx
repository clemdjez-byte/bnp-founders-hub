import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Recap() {
  const location = useLocation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get('amount');
    
    if (amount) {
      const formattedAmount = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(amount));
      
      const initialMessage = `J'ai ${formattedAmount} à investir. Pouvez-vous me poser quelques questions pour mieux comprendre mon profil investisseur et me proposer des produits d'investissement adaptés ?`;
      handleSend(initialMessage);
    } else if (location.state?.fromInvest) {
      const product = location.state.product;
      const initialMessage = `Je souhaite investir dans ${product.name}. Pouvez-vous me poser quelques questions pour mieux comprendre mon profil investisseur ?`;
      handleSend(initialMessage);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/financial-advisor`;
    
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (resp.status === 429) {
      toast({
        title: "Rate limit exceeded",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      throw new Error("Rate limit exceeded");
    }

    if (resp.status === 402) {
      toast({
        title: "Payment required",
        description: "Please add funds to continue using AI features.",
        variant: "destructive",
      });
      throw new Error("Payment required");
    }

    if (!resp.ok || !resp.body) {
      throw new Error("Failed to start stream");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantContent = "";

    // Add initial assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === "assistant") {
                lastMessage.content = assistantContent;
              }
              return newMessages;
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async (customMessage?: string) => {
    const messageContent = customMessage || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = { role: "user", content: messageContent };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI advisor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Sparkles className="h-10 w-10 text-primary" />
          AI Financial Advisor
        </h1>
        <p className="text-muted-foreground">
          Get personalized insights and advice about your wealth portfolio
        </p>
      </div>

      <Card className="flex-1 flex flex-col p-6 min-h-0">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome to your AI Financial Advisor</h3>
                <p className="text-muted-foreground max-w-md">
                  Ask me anything about your portfolio, asset allocation, performance, or get personalized investment advice.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 w-full max-w-2xl">
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 text-left justify-start"
                  onClick={() => setInput("What's my current net worth and how has it changed?")}
                >
                  <span className="text-sm">What's my current net worth and how has it changed?</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 text-left justify-start"
                  onClick={() => setInput("How is my portfolio allocated across different asset classes?")}
                >
                  <span className="text-sm">How is my portfolio allocated across different asset classes?</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 text-left justify-start"
                  onClick={() => setInput("What are my best performing assets?")}
                >
                  <span className="text-sm">What are my best performing assets?</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 text-left justify-start"
                  onClick={() => setInput("Should I rebalance my portfolio?")}
                >
                  <span className="text-sm">Should I rebalance my portfolio?</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" && message.content.includes("[BUTTON:") ? (
                      <div className="space-y-4">
                        {message.content.split(/(\[BUTTON:[^\]]+\])/).map((part, idx) => {
                          if (part.startsWith("[BUTTON:")) {
                            const match = part.match(/\[BUTTON:([^|]+)\|([^\]]+)\]/);
                            if (match) {
                              const buttonText = match[1];
                              const params = match[2];
                              const isFullPath = params.startsWith('/');
                              return (
                                <Button 
                                  key={idx}
                                  variant={isFullPath ? "outline" : "default"}
                                  className="w-full"
                                  onClick={() => {
                                    window.location.href = isFullPath ? params : `/invest?${params}`;
                                  }}
                                >
                                  {buttonText}
                                </Button>
                              );
                            }
                            return null;
                          }
                          return part ? <p key={idx} className="text-sm whitespace-pre-wrap">{part}</p> : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="mt-4 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your portfolio, investments, or get financial advice..."
            className="resize-none"
            rows={3}
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-full aspect-square"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Button
          onClick={() => window.location.href = '/invest'}
          className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
        >
          Invest
        </Button>
      </Card>
    </div>
  );
}
