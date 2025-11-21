import { mockAllocationByClass } from "@/lib/mockData";
import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  name: string;
  value: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const colorMap: { [key: string]: string } = {
  "Stocks & ETFs": "hsl(var(--chart-1))",
  "Funds": "hsl(var(--chart-2))",
  "Cash": "hsl(var(--chart-3))",
  "Crypto": "hsl(var(--chart-4))",
  "Real Estate": "hsl(var(--chart-5))",
};

const Index = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const total = mockAllocationByClass.reduce((sum, item) => sum + item.value, 0);
    
    const initialBubbles: Bubble[] = mockAllocationByClass.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const size = Math.max(80, Math.min(300, percentage * 3));
      
      return {
        id: index,
        name: item.name,
        value: item.value,
        color: colorMap[item.name] || "hsl(var(--chart-1))",
        x: Math.random() * (window.innerWidth - size),
        y: Math.random() * (window.innerHeight - size),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size,
      };
    });

    setBubbles(initialBubbles);

    const animate = () => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground animate-fade-in">
            Votre Patrimoine
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in">
            Visualisez votre répartition d'actifs en temps réel
          </p>
        </div>
      </div>

      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full flex items-center justify-center shadow-2xl transition-all duration-100 backdrop-blur-sm hover:scale-110 cursor-pointer"
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: `${bubble.color}40`,
            border: `3px solid ${bubble.color}`,
          }}
        >
          <div className="text-center p-4">
            <div className="font-bold text-foreground text-lg md:text-xl mb-1">
              {bubble.name}
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-semibold">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(bubble.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
