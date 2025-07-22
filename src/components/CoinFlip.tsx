import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CoinFlipProps {
  isFlipping: boolean;
  result: 'heads' | 'tails' | null;
  onAnimationComplete: () => void;
}

export const CoinFlip = ({ isFlipping, result, onAnimationComplete }: CoinFlipProps) => {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      setShowResult(false);
      const timer = setTimeout(() => {
        setShowResult(true);
        onAnimationComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFlipping, onAnimationComplete]);

  return (
    <Card className="bg-gradient-card border-casino-gold/30 p-8 text-center shadow-2xl">
      <h2 className="text-2xl font-bold text-casino-gold mb-6 font-casino tracking-wider">COIN FLIP</h2>
      
      <div className="flex justify-center mb-8">
        {isFlipping ? (
          <div className="w-80 h-80 flex items-center justify-center">
            <iframe 
              src="https://lottie.host/embed/7aad6a84-3e30-4fd9-9b86-0aca89e272ff/x2K093vwbc.lottie"
              width="300"
              height="300"
              style={{ border: 'none' }}
              title="Coin Flip Animation"
            />
          </div>
        ) : (
          <div className={`w-80 h-80 rounded-full border-8 border-casino-gold shadow-2xl flex items-center justify-center text-6xl font-bold transition-all duration-500 ${
            result === 'heads' 
              ? 'bg-gradient-gold text-primary-foreground animate-pulse-gold' 
              : result === 'tails' 
              ? 'bg-casino-felt text-foreground animate-pulse-gold'
              : 'bg-gradient-card text-muted-foreground'
          }`}>
            {result === 'heads' ? '👑' : result === 'tails' ? '🪙' : '?'}
          </div>
        )}
      </div>

      {showResult && result && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-xl font-semibold text-foreground font-casino tracking-wide">
            RESULT: <span className={`font-digital text-2xl ${result === 'heads' ? 'text-casino-gold' : 'text-casino-green'}`}>
              {result.toUpperCase()}
            </span>
          </h3>
        </div>
      )}
    </Card>
  );
};