import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Coins, Crown } from "lucide-react";

interface BettingInterfaceProps {
  balance: number;
  selectedAmount: number;
  selectedSide: 'heads' | 'tails' | null;
  onAmountSelect: (amount: number) => void;
  onSideSelect: (side: 'heads' | 'tails') => void;
  onPlaceBet: () => void;
  isFlipping: boolean;
  isPremium?: boolean;
}

export const BettingInterface = ({
  balance,
  selectedAmount,
  selectedSide,
  onAmountSelect,
  onSideSelect,
  onPlaceBet,
  isFlipping,
  isPremium
}: BettingInterfaceProps) => {
  const regularBets = [1, 2, 5, 10];
  const highStakesBets = [20, 30, 50, 100];

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const canPlaceBet = selectedAmount && selectedSide && selectedAmount <= balance && !isFlipping;

  const BetButton = ({ amount, disabled = false }: { amount: number; disabled?: boolean }) => (
    <Button
      variant={selectedAmount === amount ? "casino" : "casino-bet"}
      size="lg"
      onClick={() => onAmountSelect(amount)}
      disabled={disabled || amount > balance}
      className={`w-full h-16 text-lg font-bold font-digital ${
        selectedAmount === amount ? 'ring-2 ring-casino-gold' : ''
      } ${amount > balance ? 'opacity-50' : ''}`}
    >
      {formatMoney(amount)}
      {amount > balance && (
        <Badge variant="destructive" className="ml-2 text-xs">
          Insufficient
        </Badge>
      )}
    </Button>
  );

  return (
    <Card className={`${isPremium ? 'bg-white border-2 border-yellow-400 shadow-md' : 'bg-gradient-card border-casino-gold/30'} p-4 shadow-md transition-colors duration-500`}>
      <div>
        <h2 className={`text-xl font-bold mb-4 text-center font-casino tracking-wider ${isPremium ? 'text-yellow-700' : 'text-casino-gold'}`}>PLACE YOUR BET</h2>
        {/* Side Selection */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant={selectedSide === 'heads' ? "casino" : "casino-bet"}
            size="lg"
            onClick={() => onSideSelect('heads')}
            disabled={isFlipping}
            className={`h-16 text-lg font-bold font-casino tracking-wider ${selectedSide === 'heads' ? (isPremium ? 'ring-2 ring-yellow-400' : 'ring-2 ring-casino-gold') : ''} ${isPremium ? 'bg-yellow-100 text-yellow-700 border-yellow-400' : ''}`}
          >
            <Crown className="w-7 h-7 mr-2" />
            HEADS
          </Button>
          <Button
            variant={selectedSide === 'tails' ? "casino" : "casino-bet"}
            size="lg"
            onClick={() => onSideSelect('tails')}
            disabled={isFlipping}
            className={`h-16 text-lg font-bold font-casino tracking-wider ${selectedSide === 'tails' ? (isPremium ? 'ring-2 ring-yellow-400' : 'ring-2 ring-casino-gold') : ''} ${isPremium ? 'bg-yellow-100 text-yellow-700 border-yellow-400' : ''}`}
          >
            <Coins className="w-7 h-7 mr-2" />
            TAILS
          </Button>
        </div>
        {/* Betting Amount Tabs */}
        <Tabs defaultValue="regular" className="w-full mb-4">
          <TabsList className={`grid w-full grid-cols-2 ${isPremium ? 'bg-yellow-50' : 'bg-muted/20'}`}> 
            <TabsTrigger
              value="regular"
              className={isPremium ? 'data-[state=active]:bg-yellow-800 text-yellow-800' : 'data-[state=active]:bg-casino-felt'}
            >
              Regular Bets
            </TabsTrigger>
            <TabsTrigger
              value="high-stakes"
              className={isPremium ? 'data-[state=active]:bg-yellow-900 text-yellow-900' : 'data-[state=active]:bg-casino-red'}
            >
              High Stakes 🔥
            </TabsTrigger>
          </TabsList>
          <TabsContent value="regular" className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              {regularBets.map((amount) => (
                <BetButton key={amount} amount={amount} disabled={isFlipping} />
              ))}
            </div>
            <Button
              variant={selectedAmount === balance ? "casino" : "casino-bet"}
              size="lg"
              onClick={() => onAmountSelect(balance)}
              disabled={isFlipping || balance === 0}
              className={`w-full h-12 text-base font-bold font-digital mt-2 ${selectedAmount === balance ? (isPremium ? 'ring-2 ring-yellow-400' : 'ring-2 ring-casino-gold') : ''} ${isPremium ? 'bg-yellow-100 text-yellow-700 border-yellow-400' : ''}`}
            >
              BET ALL ({formatMoney(balance)})
            </Button>
          </TabsContent>
          <TabsContent value="high-stakes" className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              {highStakesBets.map((amount) => (
                <BetButton key={amount} amount={amount} disabled={isFlipping} />
              ))}
            </div>
            <Button
              variant={selectedAmount === balance ? "casino" : "casino-bet"}
              size="lg"
              onClick={() => onAmountSelect(balance)}
              disabled={isFlipping || balance === 0}
              className={`w-full h-12 text-base font-bold font-digital mt-2 ${selectedAmount === balance ? (isPremium ? 'ring-2 ring-yellow-400' : 'ring-2 ring-casino-gold') : ''} ${isPremium ? 'bg-yellow-100 text-yellow-700 border-yellow-400' : ''}`}
            >
              BET ALL ({formatMoney(balance)})
            </Button>
          </TabsContent>
        </Tabs>
        {/* Place Bet Button */}
        <Button
          variant={canPlaceBet ? "casino" : "casino-danger"}
          size="lg"
          onClick={onPlaceBet}
          disabled={!canPlaceBet}
          className={`w-full h-12 text-lg font-bold font-casino tracking-wide mt-2 ${isPremium ? 'bg-yellow-400 text-white border-yellow-500' : ''}`}
        >
          {isFlipping ? (
            "Flipping..."
          ) : !selectedAmount ? (
            "Select Amount"
          ) : !selectedSide ? (
            "Choose Heads or Tails"
          ) : selectedAmount > balance ? (
            "Insufficient Balance"
          ) : (
            `Bet ${formatMoney(selectedAmount)} - Win ${formatMoney(selectedAmount * 2)}`
          )}
        </Button>
        {selectedAmount && selectedSide && selectedAmount <= balance && (
          <div className={`mt-2 p-2 rounded-lg border ${isPremium ? 'bg-yellow-50 border-yellow-300' : 'bg-casino-felt/20 border-casino-green/30'}`}>
            <div className={`text-center text-xs ${isPremium ? 'text-yellow-700' : 'text-casino-green'}`}>
              <p className="font-semibold">
                You're betting {formatMoney(selectedAmount)} on {selectedSide.toUpperCase()}
              </p>
              <p className={isPremium ? 'text-yellow-600' : 'text-casino-gold'}>
                Win: {formatMoney(selectedAmount * 2)} | Lose: {formatMoney(selectedAmount)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}