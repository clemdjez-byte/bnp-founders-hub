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
  "Stock": { color: "#00DC82" },      // BNP Green
  "Fund": { color: "#00B86E" },       // Darker green
  "Cash": { color: "#00F5A0" },       // Bright green
  "Crypto": { color: "#00DC82" },     // BNP Green
  "Real Estate": { color: "#00A85E" }, // Deep green
  "Cash Available": { color: "#FFD700" }, // Gold/Yellow
};

const Index = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [draggedBubble, setDraggedBubble] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const initialBubbles: Bubble[] = mockAssets.map((asset) => {
      const size = Math.max(150, Math.min(400, asset.value / 2500));
      const topMargin = 150; // Space for header
      const bottomMargin = 50; // Safety margin at bottom
      const maxX = Math.max(0, window.innerWidth - size);
      const maxY = Math.max(0, window.innerHeight - size - topMargin - bottomMargin);
      
      return {
        id: asset.id,
        label: asset.label,
        value: asset.value,
        type: asset.type,
        color: typeConfig[asset.type]?.color || "#3b82f6",
        logo: asset.logo || "cash",
        x: Math.max(0, Math.min(maxX, Math.random() * maxX)),
        y: Math.max(topMargin, Math.min(maxY + topMargin, topMargin + Math.random() * maxY)),
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

          const topMargin = 150; // Space for header
          const bottomMargin = 50; // Safety margin at bottom
          const maxX = window.innerWidth - bubble.size;
          const maxY = window.innerHeight - bubble.size - bottomMargin;
          const minY = topMargin;

          // Wall collision with stricter bounds
          if (newX <= 0) {
            newVx = Math.abs(newVx) * 0.8;
            newX = 0;
          } else if (newX >= maxX) {
            newVx = -Math.abs(newVx) * 0.8;
            newX = maxX;
          }
          
          if (newY <= minY) {
            newVy = Math.abs(newVy) * 0.8;
            newY = minY;
          } else if (newY >= maxY) {
            newVy = -Math.abs(newVy) * 0.8;
            newY = maxY;
          }

          // Ensure bounds are strictly enforced
          newX = Math.max(0, Math.min(maxX, newX));
          newY = Math.max(minY, Math.min(maxY, newY));

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

    const topMargin = 150;
    const bottomMargin = 50;

    setBubbles(prev => prev.map(b => {
      if (b.id === draggedBubble) {
        return {
          ...b,
          x: Math.max(0, Math.min(window.innerWidth - b.size, e.clientX - dragOffset.current.x)),
          y: Math.max(topMargin, Math.min(window.innerHeight - b.size - bottomMargin, e.clientY - dragOffset.current.y)),
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
      className="relative min-h-screen w-full overflow-hidden bg-background mesh-gradient"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Total valorisation en haut à droite */}
      <div className="fixed top-8 right-8 z-50 border border-border/30 rounded-2xl px-6 py-4 bg-transparent">
        <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
        <p 
          className="text-5xl font-bold text-primary"
          style={{
            textShadow: `
              0 0 20px hsl(var(--primary) / 0.8),
              0 0 40px hsl(var(--primary) / 0.6),
              0 0 60px hsl(var(--primary) / 0.4),
              0 0 80px hsl(var(--primary) / 0.2)
            `
          }}
        >
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(bubbles.reduce((sum, b) => sum + b.value, 0))}
        </p>
      </div>

      {bubbles.map((bubble) => {
        const logoSrc = logoMap[bubble.logo];
        return (
          <div
            key={bubble.id}
            className="absolute rounded-full flex flex-col items-center justify-center cursor-move select-none overflow-hidden backdrop-blur-sm transition-all duration-200"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}15, ${bubble.color}08)`,
              boxShadow: `
                0 0 60px ${bubble.color}30,
                0 8px 32px rgba(0, 0, 0, 0.4),
                inset 0 0 40px ${bubble.color}10,
                0 0 100px ${bubble.color}15
              `,
              border: `2px solid ${bubble.color}40`,
              transform: bubble.isDragging ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseDown={(e) => handleMouseDown(e, bubble.id)}
          >
            <div className="flex flex-col items-center justify-center gap-2 w-full h-full p-4">
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 blur-xl opacity-40" style={{ background: bubble.color }} />
                <img 
                  src={logoSrc} 
                  alt={bubble.label}
                  className="object-contain relative z-10"
                  style={{
                    width: `${bubble.size * 0.3}px`,
                    height: `${bubble.size * 0.3}px`,
                    maxWidth: '80px',
                    maxHeight: '80px',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                  }}
                  draggable="false"
                />
              </div>
              <div className="text-center flex-shrink-0 w-full px-2">
                <div className="font-bold text-foreground mb-0.5 drop-shadow-lg truncate" style={{ fontSize: `${Math.max(12, bubble.size * 0.08)}px` }}>
                  {bubble.label}
                </div>
                <div className="text-muted-foreground font-medium mb-0.5 drop-shadow-lg truncate opacity-70" style={{ fontSize: `${Math.max(10, bubble.size * 0.05)}px` }}>
                  {bubble.type}
                </div>
                <div className="text-foreground font-bold drop-shadow-lg truncate" style={{ fontSize: `${Math.max(11, bubble.size * 0.06)}px`, color: bubble.color }}>
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(bubble.value)}
                </div>
                {bubble.type === "Cash Available" && (
                  <button
                    className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
                    style={{ fontSize: `${Math.max(10, bubble.size * 0.06)}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/recap?amount=${bubble.value}`;
                    }}
                  >
                    Invest
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Index;
