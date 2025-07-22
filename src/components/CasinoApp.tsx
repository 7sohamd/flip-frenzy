import { useState, useCallback } from "react";
import { Wallet } from "./Wallet";
import { CoinFlip } from "./CoinFlip";
import { BettingInterface } from "./BettingInterface";
import { useToast } from "@/hooks/use-toast";
import { Dice6, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export const CasinoApp = () => {
  const [balance, setBalance] = useState(100);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [lastBet, setLastBet] = useState<number | undefined>();
  const [lastResult, setLastResult] = useState<'win' | 'loss' | undefined>();
  const { toast } = useToast();

  const flipCoin = (): 'heads' | 'tails' => {
    return Math.random() < 0.5 ? 'heads' : 'tails';
  };

  const handlePlaceBet = useCallback(() => {
    if (!selectedAmount || !selectedSide || selectedAmount > balance || isFlipping) {
      return;
    }

    setIsFlipping(true);
    setCoinResult(null);
    
    // Deduct bet amount immediately
    setBalance(prev => prev - selectedAmount);
    
    // Simulate coin flip after animation
    setTimeout(() => {
      const result = flipCoin();
      setCoinResult(result);
      
      const won = result === selectedSide;
      setLastBet(selectedAmount);
      setLastResult(won ? 'win' : 'loss');
      
      if (won) {
        // Return original bet + winnings (double or nothing)
        setBalance(prev => prev + (selectedAmount * 2));
        toast({
          title: "🎉 YOU WON!",
          description: `You won ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(selectedAmount)}! The coin landed on ${result}.`,
          className: "bg-casino-green border-casino-green text-white"
        });
      } else {
        toast({
          title: "😢 You Lost",
          description: `Better luck next time! The coin landed on ${result}.`,
          variant: "destructive"
        });
      }
      
      // Reset selections after a brief delay
      setTimeout(() => {
        setSelectedAmount(0);
        setSelectedSide(null);
        setIsFlipping(false);
      }, 3000);
    }, 2000);
  }, [selectedAmount, selectedSide, balance, isFlipping, toast]);

  const handleAnimationComplete = () => {
    // Animation completion is handled in the setTimeout above
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card className="bg-gradient-card border-casino-gold/30 p-6 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Dice6 className="w-8 h-8 text-casino-gold" />
            <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent font-casino tracking-wider">
              GOLDEN COIN CASINO
            </h1>
            <Sparkles className="w-8 h-8 text-casino-gold" />
          </div>
          <p className="text-lg text-casino-gold/80 font-retro tracking-wide">
            DOUBLE OR NOTHING • 50/50 CHANCE • PURE LUCK
          </p>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8">
        {/* Wallet */}
        <Wallet 
          balance={balance} 
          lastBet={lastBet} 
          lastResult={lastResult}
        />
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coin Flip */}
          <CoinFlip
            isFlipping={isFlipping}
            result={coinResult}
            onAnimationComplete={handleAnimationComplete}
          />
          
          {/* Betting Interface */}
          <BettingInterface
            balance={balance}
            selectedAmount={selectedAmount}
            selectedSide={selectedSide}
            onAmountSelect={setSelectedAmount}
            onSideSelect={setSelectedSide}
            onPlaceBet={handlePlaceBet}
            isFlipping={isFlipping}
          />
        </div>

        {/* Game Rules */}
        <Card className="bg-gradient-card border-casino-gold/30 p-6 shadow-xl">
          <h3 className="text-xl font-bold text-casino-gold mb-4 text-center font-casino tracking-wider">HOW TO PLAY</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold font-digital">
                1
              </div>
              <h4 className="font-semibold font-retro">CHOOSE YOUR SIDE</h4>
              <p className="text-sm text-muted-foreground">
                Pick either Heads (👑) or Tails (🪙)
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold font-digital">
                2
              </div>
              <h4 className="font-semibold font-retro">PLACE YOUR BET</h4>
              <p className="text-sm text-muted-foreground">
                Select your amount from $1 to $100
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold font-digital">
                3
              </div>
              <h4 className="font-semibold font-retro">DOUBLE OR NOTHING</h4>
              <p className="text-sm text-muted-foreground">
                Win double your bet or lose it all!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};