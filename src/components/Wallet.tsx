import { Card } from "@/components/ui/card";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";

interface WalletProps {
  balance: number;
  lastBet?: number;
  lastResult?: 'win' | 'loss';
}

export const Wallet = ({ balance, lastBet, lastResult }: WalletProps) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-card border-casino-gold/30 p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-gold rounded-full shadow-lg">
            <Coins className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground font-retro">WALLET BALANCE</p>
            <p className="text-3xl font-bold text-casino-gold bg-shimmer bg-size-200 animate-shimmer bg-clip-text font-digital tracking-wider">
              {formatMoney(balance)}
            </p>
          </div>
        </div>
        
        {lastBet && lastResult && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            lastResult === 'win' 
              ? 'bg-casino-green/20 text-casino-green border border-casino-green/30' 
              : 'bg-casino-red/20 text-casino-red border border-casino-red/30'
          }`}>
            {lastResult === 'win' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-semibold">
              {lastResult === 'win' ? '+' : '-'}{formatMoney(lastBet)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};