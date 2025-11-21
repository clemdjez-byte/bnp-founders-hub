import { mockAssets } from "@/lib/mockData";
import { useEffect, useState, useRef } from "react";
import { Landmark, TrendingUp, Wallet, Bitcoin, Building2 } from "lucide-react";

interface Bubble {
  id: string;
  label: string;
  value: number;
  type: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  isDragging: boolean;
}

const typeConfig: { [key: string]: { color: string; icon: any } } = {
  "Stock": { color: "#3b82f6", icon: TrendingUp },
  "Fund": { color: "#8b5cf6", icon: Landmark },
  "Cash": { color: "#10b981", icon: Wallet },
  "Crypto": { color: "#f59e0b", icon: Bitcoin },
  "Real Estate": { color: "#ef4444", icon: Building2 },
};

const Index = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [draggedBubble, setDraggedBubble] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const initialBubbles: Bubble[] = mockAssets.map((asset) => {
      const size = Math.max(150, Math.min(400, asset.value / 2000));
      
      return {
        id: asset.id,
        label: asset.label,
        value: asset.value,
        type: asset.type,
        color: typeConfig[asset.type]?.color || "#3b82f6",
        x: Math.random() * (window.innerWidth - size),
        y: Math.random() * (window.innerHeight - size),
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size,
        isDragging: false,
      };
    });

    setBubbles(initialBubbles);
  }, []);

  useEffect(() => {
    const animate = () => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          if (bubble.isDragging) return bubble;

          let newX = bubble.x + bubble.vx;
          let newY = bubble.y + bubble.vy;
          let newVx = bubble.vx;
          let newVy = bubble.vy;

          if (newX <= 0 || newX >= window.innerWidth - bubble.size) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(window.innerWidth - bubble.size, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - bubble.size) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(window.innerHeight - bubble.size, newY));
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, bubbleId: string) => {
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble) return;

    dragOffset.current = {
      x: e.clientX - bubble.x,
      y: e.clientY - bubble.y,
    };
    setDraggedBubble(bubbleId);
    setBubbles(prev => prev.map(b => 
      b.id === bubbleId ? { ...b, isDragging: true } : b
    ));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedBubble) return;

    setBubbles(prev => prev.map(b => {
      if (b.id === draggedBubble) {
        return {
          ...b,
          x: Math.max(0, Math.min(window.innerWidth - b.size, e.clientX - dragOffset.current.x)),
          y: Math.max(0, Math.min(window.innerHeight - b.size, e.clientY - dragOffset.current.y)),
        };
      }
      return b;
    }));
  };

  const handleMouseUp = () => {
    if (draggedBubble) {
      setBubbles(prev => prev.map(b => 
        b.id === draggedBubble ? { ...b, isDragging: false } : b
      ));
      setDraggedBubble(null);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {bubbles.map((bubble) => {
        const Icon = typeConfig[bubble.type]?.icon || TrendingUp;
        return (
          <div
            key={bubble.id}
            className="absolute rounded-full flex flex-col items-center justify-center transition-all duration-100 cursor-move select-none"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}60, ${bubble.color}20)`,
              boxShadow: `
                0 0 60px ${bubble.color}40,
                0 20px 60px rgba(0, 0, 0, 0.3),
                inset 0 0 40px ${bubble.color}20
              `,
              border: `4px solid ${bubble.color}`,
              transform: bubble.isDragging ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseDown={(e) => handleMouseDown(e, bubble.id)}
          >
            <div className="flex flex-col items-center gap-4 p-6">
              <div 
                className="p-4 rounded-full backdrop-blur-md"
                style={{
                  backgroundColor: `${bubble.color}30`,
                  boxShadow: `0 0 20px ${bubble.color}40`,
                }}
              >
                <Icon className="h-12 w-12" style={{ color: bubble.color }} />
              </div>
              <div className="text-center">
                <div className="font-bold text-foreground text-xl mb-2">
                  {bubble.label}
                </div>
                <div className="text-sm text-muted-foreground font-medium mb-1">
                  {bubble.type}
                </div>
                <div className="text-lg text-foreground font-bold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(bubble.value)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Index;
