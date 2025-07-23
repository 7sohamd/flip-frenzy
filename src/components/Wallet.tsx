import { Card } from "@/components/ui/card";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";

interface WalletProps {
  balance: number;
  lastBet?: number;
  lastResult?: 'win' | 'loss';
  isPremium?: boolean;
}

export const Wallet = ({ balance, lastBet, lastResult, isPremium }: WalletProps) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className={`${isPremium ? 'bg-white border-2 border-yellow-400 shadow-md' : 'bg-gradient-card border-casino-gold/30'} p-6 shadow-md transition-colors duration-500`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full shadow-lg ${isPremium ? 'bg-yellow-300' : 'bg-gradient-gold'}`}> 
            <Coins className={`h-6 w-6 ${isPremium ? 'text-yellow-900' : 'text-primary-foreground'}`} />
          </div>
          <div>
            <p className={`text-sm font-medium font-retro ${isPremium ? 'text-yellow-700' : 'text-muted-foreground'}`}>WALLET BALANCE</p>
            <p className={`text-3xl font-bold font-digital tracking-wider ${isPremium ? 'text-yellow-600' : 'text-casino-gold bg-shimmer bg-size-200 animate-shimmer bg-clip-text'}`}>
              {formatMoney(balance)}
            </p>
          </div>
        </div>
        
        {lastBet && lastResult && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            lastResult === 'win' 
              ? isPremium ? 'bg-yellow-100 text-yellow-700 border border-yellow-400' : 'bg-casino-green/20 text-casino-green border border-casino-green/30'
              : isPremium ? 'bg-yellow-50 text-yellow-500 border border-yellow-200' : 'bg-casino-red/20 text-casino-red border border-casino-red/30'
          }`}>
            {lastResult === 'win' ? (
              <TrendingUp className={`h-4 w-4 ${isPremium ? 'text-yellow-700' : ''}`} />
            ) : (
              <TrendingDown className={`h-4 w-4 ${isPremium ? 'text-yellow-500' : ''}`} />
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