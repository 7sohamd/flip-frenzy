import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Crown, CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CoinFlipProps {
  isFlipping: boolean;
  result: 'heads' | 'tails' | null;
  onAnimationComplete: () => void;
  isPremium?: boolean;
}

export const CoinFlip = ({ isFlipping, result, onAnimationComplete, isPremium }: CoinFlipProps) => {
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
    <Card className={`${isPremium ? 'bg-white border-2 border-yellow-400 shadow-md' : 'bg-gradient-card border-casino-gold/30'} p-8 text-center shadow-md transition-colors duration-500`}>
      <h2 className={`text-2xl font-bold mb-6 font-casino tracking-wider ${isPremium ? 'text-yellow-700' : 'text-casino-gold'}`}>COIN FLIP</h2>
      
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
          <div className={`w-80 h-80 rounded-full border-8 shadow-md flex items-center justify-center transition-all duration-500 ${
            isPremium
              ? 'border-yellow-400'
              : 'border-casino-gold'
          } ${
            result === 'heads'
              ? isPremium ? 'bg-yellow-200 animate-pulse' : 'bg-gradient-gold animate-pulse-gold'
              : result === 'tails'
              ? isPremium ? 'bg-yellow-50 animate-pulse' : 'bg-casino-felt animate-pulse-gold'
              : isPremium ? 'bg-white' : 'bg-gradient-card'
          }`}>
            {result === 'heads' ? (
              <Crown className={`w-16 h-16 m-0 p-0 ${isPremium ? 'text-yellow-700' : 'text-casino-gold'}`} />
            ) : result === 'tails' ? (
              <CircleDollarSign className={`w-14 h-14 m-0 p-0 ${isPremium ? 'text-yellow-700' : 'text-casino-gold'}`} />
            ) : (
              <span className="text-6xl font-bold">?</span>
            )}
          </div>
        )}
      </div>

      {showResult && result && (
        <div className="space-y-4 animate-fade-in">
          <h3 className={`text-xl font-semibold font-casino tracking-wide ${isPremium ? 'text-yellow-700' : 'text-foreground'}`}>
            RESULT: <span className={`font-digital text-2xl ${isPremium ? 'text-yellow-600' : (result === 'heads' ? 'text-casino-gold' : 'text-casino-green')}`}>
              {result.toUpperCase()}
            </span>
          </h3>
        </div>
      )}
    </Card>
  );
};