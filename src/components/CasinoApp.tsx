import { useState, useCallback } from "react";
import { Wallet } from "./Wallet";
import { CoinFlip } from "./CoinFlip";
import { BettingInterface } from "./BettingInterface";
import { useToast } from "@/hooks/use-toast";
import { Dice6, Sparkles, Github, Linkedin, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth, getFirebaseFirestore } from "@/lib/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState as useReactState } from "react";

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
  const [flipHistory, setFlipHistory] = useState<("heads" | "tails")[]>([]);
  const { toast } = useToast();

  // Coupon input state
  const [coupon, setCoupon] = useReactState("");
  const [couponMsg, setCouponMsg] = useReactState("");
  const couponCode = import.meta.env.VITE_ADMIN_COUPON_CODE;

  // Calculate heads/tails counts and percentages
  const headsCount = flipHistory.filter(f => f === 'heads').length;
  const tailsCount = flipHistory.filter(f => f === 'tails').length;
  const totalFlips = headsCount + tailsCount;
  const headsPercent = totalFlips ? Math.round((headsCount / totalFlips) * 100) : 0;
  const tailsPercent = totalFlips ? 100 - headsPercent : 0;

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
      setFlipHistory(prev => {
        const updated = [result, ...prev];
        return updated.slice(0, 50);
      });
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

  // Top right auth controls
  const AuthControls = () => (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {!user ? (
        <Button variant="casino" size="sm" onClick={handleSignIn} className="px-3 py-1 text-xs font-retro h-7">Sign in</Button>
      ) : (
        <>
          <span className="text-xs font-retro text-yellow-900 bg-yellow-100 px-2 py-1 rounded border border-yellow-300 h-7 flex items-center">{user.displayName}</span>
          <Button variant="casino" size="sm" onClick={handleSignOut} className="px-2 py-1 text-xs font-retro h-7">Sign Out</Button>
        </>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <AuthControls />
        <Card className="bg-gradient-card border-casino-gold/30 p-8 text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-gold bg-clip-text text-transparent font-casino tracking-wider">GOLDEN COIN CASINO</h1>
          <p className="mb-6 text-casino-gold/80 font-retro tracking-wide">Sign in to play and save your wallet!</p>
        </Card>
      </div>
    );
  }

  // Determine if user is premium
  const isPremium = (balance ?? 0) >= 500;

  return (
    <div className={`min-h-screen p-4 ${isPremium ? 'bg-white' : 'bg-background'} transition-colors duration-500`}> 
      {/* Coupon input for admin (only when balance is 0) */}
      {balance === 0 && (
        <div className="fixed top-16 right-4 z-40 flex flex-col items-end">
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded px-2 py-1 shadow">
            <input
              type="text"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              placeholder="Have coupon?"
              className="text-xs px-2 py-1 rounded border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white font-retro"
            />
            <button
              className="text-xs font-bold px-2 py-1 rounded bg-yellow-900 text-white hover:bg-yellow-800 transition-colors font-retro"
              onClick={async () => {
                if (coupon.trim() === couponCode) {
                  setBalance(500);
                  setCouponMsg("$500 credited!");
                  setCoupon("");
                  // Also update in Firestore
                  if (user) {
                    const userRef = doc(db, "users", user.uid);
                    await updateDoc(userRef, { balance: 500 });
                  }
                } else {
                  setCouponMsg("Invalid coupon");
                }
                setTimeout(() => setCouponMsg(""), 2000);
              }}
            >
              Redeem
            </button>
          </div>
          {couponMsg && <span className={`text-xs mt-1 font-retro ${couponMsg.includes("credited") ? 'text-green-700' : 'text-red-600'}`}>{couponMsg}</span>}
        </div>
      )}
      {/* Flip History */}
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-center gap-4 mb-4 flex-wrap">
        <div className="flex flex-row gap-1">
          {flipHistory.length === 0 ? (
            <span className="text-xs text-muted-foreground font-retro">No flips yet</span>
          ) : (
            flipHistory.map((res, idx) => (
              <span
                key={idx}
                className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs border ${res === 'heads' ? 'bg-yellow-900 text-white border-yellow-900' : 'bg-yellow-200 text-yellow-900 border-yellow-300'} transition-colors`}
                title={res === 'heads' ? 'Heads' : 'Tails'}
              >
                {res === 'heads' ? 'H' : 'T'}
              </span>
            ))
          )}
        </div>
        {/* Success Rate Bar */}
        <div className="flex flex-col items-center ml-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-retro text-yellow-900">H</span>
            <div className="relative w-40 h-4 rounded-full overflow-hidden border border-yellow-300 bg-yellow-100 flex">
              <div
                className="h-4 bg-yellow-900 transition-all duration-300"
                style={{ width: `${headsPercent}%` }}
              />
              <div
                className="h-4 bg-yellow-200 transition-all duration-300"
                style={{ width: `${tailsPercent}%` }}
              />
            </div>
            <span className="text-xs font-retro text-yellow-900">T</span>
          </div>
          <div className="flex justify-between w-40 text-[10px] font-retro text-yellow-900">
            <span>{headsPercent}%</span>
            <span>{tailsPercent}%</span>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Card className={`${isPremium ? 'bg-white border-2 border-yellow-400 shadow-md' : 'bg-gradient-card border-casino-gold/30'} p-6 text-center shadow-md transition-colors duration-500`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Dice6 className={`w-8 h-8 ${isPremium ? 'text-yellow-500' : 'text-casino-gold'}`} />
            <h1 className={`text-4xl font-bold ${isPremium ? 'text-yellow-600' : 'bg-gradient-gold bg-clip-text text-transparent'} font-casino tracking-wider`}>
              GOLDEN COIN CASINO
            </h1>
            <Sparkles className={`w-8 h-8 ${isPremium ? 'text-yellow-500' : 'text-casino-gold'}`} />
          </div>
          <p className={`text-lg font-retro tracking-wide ${isPremium ? 'text-yellow-700' : 'text-casino-gold/80'}`}> 
            DOUBLE OR NOTHING • 50/50 CHANCE • PURE LUCK
          </p>
          <div className="text-center mt-4">
            <span className={`text-xs font-retro tracking-wide ${isPremium ? 'text-yellow-600' : 'text-casino-gold/70'}`}>Made by Soham</span>
          </div>
          {/* Auth controls moved to top right */}
        </Card>
        {balance > 1000 && (
          <p className={`text-center text-xs font-retro mt-2 ${isPremium ? 'text-yellow-700' : 'text-casino-gold/80'}`}>
            You are among the top 0.1% lucky players to reach this amount
          </p>
        )}
      </div>
      <div className="max-w-6xl mx-auto grid gap-8">
        {/* Wallet */}
        <Wallet 
          balance={balance ?? 0} 
          isPremium={isPremium}
          lastBet={lastBet} 
          lastResult={lastResult}
        />
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coin Flip */}
          <CoinFlip
            isFlipping={isFlipping}
            result={coinResult}
            onAnimationComplete={handleAnimationComplete}
            isPremium={isPremium}
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
            isPremium={isPremium}
          />
        </div>
        {/* Game Rules */}
        <Card className={`${isPremium ? 'bg-white border-2 border-yellow-400 shadow' : 'bg-gradient-card border-casino-gold/30'} p-6 shadow transition-colors duration-500`}>
          <h3 className={`text-xl font-bold mb-4 text-center font-casino tracking-wider ${isPremium ? 'text-yellow-700' : 'text-casino-gold'}`}>HOW TO PLAY</h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold font-digital ${isPremium ? 'bg-yellow-300 text-yellow-900' : 'bg-gradient-gold text-primary-foreground'}`}> 
                1
              </div>
              <h4 className={`font-semibold font-retro ${isPremium ? 'text-yellow-800' : ''}`}>CHOOSE YOUR SIDE</h4>
              <p className={`text-sm ${isPremium ? 'text-yellow-700' : 'text-muted-foreground'}`}>Pick either Heads (👑) or Tails (🪙)</p>
            </div>
            <div className="space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold font-digital ${isPremium ? 'bg-yellow-300 text-yellow-900' : 'bg-gradient-gold text-primary-foreground'}`}> 
                2
              </div>
              <h4 className={`font-semibold font-retro ${isPremium ? 'text-yellow-800' : ''}`}>PLACE YOUR BET</h4>
              <p className={`text-sm ${isPremium ? 'text-yellow-700' : 'text-muted-foreground'}`}>Select your amount from $1 to $100</p>
            </div>
            <div className="space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto font-bold font-digital ${isPremium ? 'bg-yellow-300 text-yellow-900' : 'bg-gradient-gold text-primary-foreground'}`}> 
                3
              </div>
              <h4 className={`font-semibold font-retro ${isPremium ? 'text-yellow-800' : ''}`}>DOUBLE OR NOTHING</h4>
              <p className={`text-sm ${isPremium ? 'text-yellow-700' : 'text-muted-foreground'}`}>Win double your bet or lose it all!</p>
            </div>
          </div>
        </Card>
      </div>
      {/* Footer */}
      <footer className={`w-full mt-8 flex items-end justify-between px-4 py-3 ${isPremium ? 'bg-white border-t-2 border-yellow-200' : 'bg-background border-t border-casino-gold/30'} shadow`}>
        <div className="flex-1 text-center text-xs font-retro" style={{ color: '#7c4a03' }}>
          Made by Soham 2025
        </div>
        <div className="flex gap-3 items-center justify-end">
          <button className="transition-colors" style={{ color: '#7c4a03' }} aria-label="GitHub">
            <Github className="w-5 h-5" />
          </button>
          <button className="transition-colors" style={{ color: '#7c4a03' }} aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </button>
          <button className="transition-colors" style={{ color: '#7c4a03' }} aria-label="Email">
            <Mail className="w-5 h-5" />
          </button>
          <button className="transition-colors" style={{ color: '#7c4a03' }} aria-label="Phone">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </footer>
      <AuthControls />
    </div>
  );
};