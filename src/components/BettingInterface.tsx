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
}

export const BettingInterface = ({
  balance,
  selectedAmount,
  selectedSide,
  onAmountSelect,
  onSideSelect,
  onPlaceBet,
  isFlipping
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
    <Card className="bg-gradient-card border-casino-gold/30 p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-casino-gold mb-6 text-center font-casino tracking-wider">PLACE YOUR BET</h2>
      
      {/* Side Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant={selectedSide === 'heads' ? "casino" : "casino-bet"}
          size="lg"
          onClick={() => onSideSelect('heads')}
          disabled={isFlipping}
          className={`h-20 text-xl font-bold font-casino tracking-wider ${
            selectedSide === 'heads' ? 'ring-2 ring-casino-gold' : ''
          }`}
        >
          <Crown className="w-8 h-8 mr-2" />
          HEADS
        </Button>
        <Button
          variant={selectedSide === 'tails' ? "casino" : "casino-bet"}
          size="lg"
          onClick={() => onSideSelect('tails')}
          disabled={isFlipping}
          className={`h-20 text-xl font-bold font-casino tracking-wider ${
            selectedSide === 'tails' ? 'ring-2 ring-casino-gold' : ''
          }`}
        >
          <Coins className="w-8 h-8 mr-2" />
          TAILS
        </Button>
      </div>

      {/* Betting Amount Tabs */}
      <Tabs defaultValue="regular" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted/20">
          <TabsTrigger value="regular" className="data-[state=active]:bg-casino-felt">
            Regular Bets
          </TabsTrigger>
          <TabsTrigger value="high-stakes" className="data-[state=active]:bg-casino-red">
            High Stakes 🔥
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {regularBets.map((amount) => (
              <BetButton key={amount} amount={amount} disabled={isFlipping} />
            ))}
          </div>
          <Button
            variant={selectedAmount === balance ? "casino" : "casino-bet"}
            size="lg"
            onClick={() => onAmountSelect(balance)}
            disabled={isFlipping || balance === 0}
            className={`w-full h-16 text-lg font-bold font-digital mt-3 ${
              selectedAmount === balance ? 'ring-2 ring-casino-gold' : ''
            }`}
          >
            BET ALL ({formatMoney(balance)})
          </Button>
        </TabsContent>
        
        <TabsContent value="high-stakes" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {highStakesBets.map((amount) => (
              <BetButton key={amount} amount={amount} disabled={isFlipping} />
            ))}
          </div>
          <Button
            variant={selectedAmount === balance ? "casino" : "casino-bet"}
            size="lg"
            onClick={() => onAmountSelect(balance)}
            disabled={isFlipping || balance === 0}
            className={`w-full h-16 text-lg font-bold font-digital mt-3 ${
              selectedAmount === balance ? 'ring-2 ring-casino-gold' : ''
            }`}
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
        className="w-full h-16 text-xl font-bold font-casino tracking-wide"
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
        <div className="mt-4 p-4 bg-casino-felt/20 rounded-lg border border-casino-green/30">
          <div className="text-center text-sm text-casino-green">
            <p className="font-semibold">
              You're betting {formatMoney(selectedAmount)} on {selectedSide.toUpperCase()}
            </p>
            <p className="text-casino-gold">
              Win: {formatMoney(selectedAmount * 2)} | Lose: {formatMoney(selectedAmount)}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};