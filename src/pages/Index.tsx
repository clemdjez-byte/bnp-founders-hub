import { mockAssets } from "@/lib/mockData";
import { useEffect, useState, useRef } from "react";
import lvmhLogo from "@/assets/logos/lvmh.png";
import bitcoinLogo from "@/assets/logos/bitcoin.png";
import ethereumLogo from "@/assets/logos/ethereum.png";
import appleLogo from "@/assets/logos/apple.png";
import googleLogo from "@/assets/logos/google.png";
import amazonLogo from "@/assets/logos/amazon.png";
import metaLogo from "@/assets/logos/meta.png";
import microsoftLogo from "@/assets/logos/microsoft.png";
import teslaLogo from "@/assets/logos/tesla.png";
import solanaLogo from "@/assets/logos/solana.png";
import realEstateLogo from "@/assets/logos/real-estate.png";
import cashLogo from "@/assets/logos/cash.png";

interface Bubble {
  id: string;
  label: string;
  value: number;
  type: string;
  color: string;
  logo: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  isDragging: boolean;
}

const logoMap: { [key: string]: string } = {
  "lvmh": lvmhLogo,
  "bitcoin": bitcoinLogo,
  "ethereum": ethereumLogo,
  "apple": appleLogo,
  "google": googleLogo,
  "amazon": amazonLogo,
  "meta": metaLogo,
  "microsoft": microsoftLogo,
  "tesla": teslaLogo,
  "solana": solanaLogo,
  "real-estate": realEstateLogo,
  "cash": cashLogo,
};

const typeConfig: { [key: string]: { color: string } } = {
  "Stock": { color: "#3b82f6" },
  "Fund": { color: "#8b5cf6" },
  "Cash": { color: "#10b981" },
  "Crypto": { color: "#f59e0b" },
  "Real Estate": { color: "#ef4444" },
};

const Index = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [draggedBubble, setDraggedBubble] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const initialBubbles: Bubble[] = mockAssets.map((asset) => {
      const size = Math.max(150, Math.min(400, asset.value / 2500));
      
      return {
        id: asset.id,
        label: asset.label,
        value: asset.value,
        type: asset.type,
        color: typeConfig[asset.type]?.color || "#3b82f6",
        logo: asset.logo || "cash",
        x: Math.random() * (window.innerWidth - size),
        y: Math.random() * (window.innerHeight - size),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size,
        isDragging: false,
      };
    });

    setBubbles(initialBubbles);
  }, []);

  // Collision detection helper
  const checkCollision = (b1: Bubble, b2: Bubble) => {
    const dx = (b1.x + b1.size / 2) - (b2.x + b2.size / 2);
    const dy = (b1.y + b1.size / 2) - (b2.y + b2.size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (b1.size + b2.size) / 2;
    
    return distance < minDistance;
  };

  // Resolve collision
  const resolveCollision = (b1: Bubble, b2: Bubble) => {
    const dx = (b1.x + b1.size / 2) - (b2.x + b2.size / 2);
    const dy = (b1.y + b1.size / 2) - (b2.y + b2.size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return { b1, b2 };
    
    // Normalize
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Relative velocity
    const dvx = b1.vx - b2.vx;
    const dvy = b1.vy - b2.vy;
    
    // Velocity along collision normal
    const dvn = dvx * nx + dvy * ny;
    
    // Do not resolve if velocities are separating
    if (dvn > 0) return { b1, b2 };
    
    // Collision impulse
    const impulse = 2 * dvn / 2; // Assuming equal mass
    
    // Update velocities
    const newB1 = {
      ...b1,
      vx: b1.vx - impulse * nx * 0.8, // 0.8 is elasticity
      vy: b1.vy - impulse * ny * 0.8,
    };
    
    const newB2 = {
      ...b2,
      vx: b2.vx + impulse * nx * 0.8,
      vy: b2.vy + impulse * ny * 0.8,
    };
    
    // Separate bubbles
    const overlap = (b1.size + b2.size) / 2 - distance;
    const separationX = nx * overlap / 2;
    const separationY = ny * overlap / 2;
    
    newB1.x += separationX;
    newB1.y += separationY;
    newB2.x -= separationX;
    newB2.y -= separationY;
    
    return { b1: newB1, b2: newB2 };
  };

  useEffect(() => {
    const animate = () => {
      setBubbles((prevBubbles) => {
        let updatedBubbles = prevBubbles.map((bubble) => {
          if (bubble.isDragging) return bubble;

          let newX = bubble.x + bubble.vx;
          let newY = bubble.y + bubble.vy;
          let newVx = bubble.vx;
          let newVy = bubble.vy;

          // Wall collision
          if (newX <= 0 || newX >= window.innerWidth - bubble.size) {
            newVx = -newVx * 0.8;
            newX = Math.max(0, Math.min(window.innerWidth - bubble.size, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - bubble.size) {
            newVy = -newVy * 0.8;
            newY = Math.max(0, Math.min(window.innerHeight - bubble.size, newY));
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });

        // Check collisions between bubbles
        for (let i = 0; i < updatedBubbles.length; i++) {
          for (let j = i + 1; j < updatedBubbles.length; j++) {
            if (updatedBubbles[i].isDragging || updatedBubbles[j].isDragging) continue;
            
            if (checkCollision(updatedBubbles[i], updatedBubbles[j])) {
              const { b1, b2 } = resolveCollision(updatedBubbles[i], updatedBubbles[j]);
              updatedBubbles[i] = b1;
              updatedBubbles[j] = b2;
            }
          }
        }

        return updatedBubbles;
      });
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
      b.id === bubbleId ? { ...b, isDragging: true, vx: 0, vy: 0 } : b
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
        b.id === draggedBubble ? { 
          ...b, 
          isDragging: false,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        } : b
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
        const logoSrc = logoMap[bubble.logo];
        return (
          <div
            key={bubble.id}
            className="absolute rounded-full flex flex-col items-center justify-center transition-all duration-100 cursor-move select-none hover:scale-105"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}80, ${bubble.color}30)`,
              boxShadow: `
                0 0 80px ${bubble.color}50,
                0 20px 80px rgba(0, 0, 0, 0.4),
                inset 0 0 60px ${bubble.color}30,
                0 0 120px ${bubble.color}20
              `,
              border: `5px solid ${bubble.color}`,
              transform: bubble.isDragging ? 'scale(1.15)' : 'scale(1)',
            }}
            onMouseDown={(e) => handleMouseDown(e, bubble.id)}
          >
            <div className="flex flex-col items-center gap-3 p-6">
              <div 
                className="p-4 rounded-2xl backdrop-blur-md shadow-xl"
                style={{
                  boxShadow: `0 0 30px ${bubble.color}30`,
                }}
              >
                <img 
                  src={logoSrc} 
                  alt={bubble.label}
                  className="h-16 w-16 object-contain"
                  draggable="false"
                />
              </div>
              <div className="text-center bg-background/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="font-bold text-foreground text-lg mb-1">
                  {bubble.label}
                </div>
                <div className="text-xs text-muted-foreground font-medium mb-1.5">
                  {bubble.type}
                </div>
                <div className="text-base text-foreground font-bold">
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
