import { useState, useCallback } from "react";
import { Wallet } from "./Wallet";
import { CoinFlip } from "./CoinFlip";
import { BettingInterface } from "./BettingInterface";
import { useToast } from "@/hooks/use-toast";
import { Dice6, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

export const CasinoApp = () => {
  const auth = getFirebaseAuth();
  const db = getFirebaseFirestore();
  const [user, loadingAuth] = useAuthState(auth);
  const [balance, setBalance] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [lastBet, setLastBet] = useState<number | undefined>();
  const [lastResult, setLastResult] = useState<'win' | 'loss' | undefined>();
  const { toast } = useToast();

  // Fetch wallet balance from Firestore
  useEffect(() => {
    if (user) {
      const fetchBalance = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setBalance(userSnap.data().balance ?? 100);
        } else {
          await setDoc(userRef, { balance: 100 });
          setBalance(100);
        }
      };
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [user, db]);

  // Update balance in Firestore after every gamble
  const updateBalanceInFirestore = async (newBalance: number) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { balance: newBalance });
    }
  };

  const flipCoin = (): 'heads' | 'tails' => {
    return Math.random() < 0.5 ? 'heads' : 'tails';
  };

  const handlePlaceBet = useCallback(() => {
    if (!selectedAmount || !selectedSide || !balance || selectedAmount > balance || isFlipping) {
      return;
    }
    setIsFlipping(true);
    setCoinResult(null);
    setBalance(prev => (prev !== null ? prev - selectedAmount : null));
    setTimeout(() => {
      const result = flipCoin();
      setCoinResult(result);
      const won = result === selectedSide;
      setLastBet(selectedAmount);
      setLastResult(won ? 'win' : 'loss');
      let newBalance = balance - selectedAmount;
      if (won) {
        newBalance += selectedAmount * 2;
        toast({
          title: "🎉 YOU WON!",
          description: `You won $${selectedAmount}! The coin landed on ${result}.`,
          className: "bg-casino-green border-casino-green text-white"
        });
      } else {
        toast({
          title: "😢 You Lost",
          description: `Better luck next time! The coin landed on ${result}.`,
          variant: "destructive"
        });
      }
      setBalance(newBalance);
      updateBalanceInFirestore(newBalance);
      setTimeout(() => {
        setSelectedAmount(0);
        setSelectedSide(null);
        setIsFlipping(false);
      }, 3000);
    }, 2000);
  }, [selectedAmount, selectedSide, balance, isFlipping, toast, user]);

  const handleAnimationComplete = () => {};

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // Show loader while auth or balance is loading
  if (loadingAuth || (user && balance === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Card className="bg-gradient-card border-casino-gold/30 p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-gold bg-clip-text text-transparent font-casino tracking-wider">GOLDEN COIN CASINO</h1>
          <p className="mb-6 text-casino-gold/80 font-retro tracking-wide">Sign in to play and save your wallet!</p>
          <Button variant="casino" size="lg" onClick={handleSignIn}>Sign in with Google</Button>
        </Card>
      </div>
    );
  }

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
          <div className="text-center mt-4">
            <span className="text-xs text-casino-gold/70 font-retro tracking-wide">Made by Soham</span>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="casino" size="sm" onClick={handleSignOut}>Sign Out</Button>
            <span className="ml-4 text-sm text-casino-gold/70 font-retro">{user.displayName}</span>
          </div>
        </Card>
      </div>
      <div className="max-w-6xl mx-auto grid gap-8">
        {/* Wallet */}
        <Wallet 
          balance={balance ?? 0} 
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
            balance={balance ?? 0}
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