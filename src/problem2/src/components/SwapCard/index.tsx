import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SwapItem from "./SwapItem";
import SwapHistory from "./SwapHistory";
import { useEffect, useState } from "react";
import {
  type ICurrency,
  useGetCurrency,
  calculateSwapResult,
  ISwapHistory,
  HISTORY_MAX_LENGTH,
} from "./helpers";

function SwapCard() {
  const { currencySymbols, currencyMap, getData, loading, error } =
    useGetCurrency();
  const [selectedFrom, setSelectedFrom] = useState<
    ICurrency["currency"] | null
  >(null);
  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [amountTo, setAmountTo] = useState<number>(0);
  const [selectedTo, setSelectedTo] = useState<ICurrency["currency"] | null>(
    null
  );
  const [canSwap, setCanSwap] = useState<boolean | undefined>(undefined);
  const [swapHistory, setSwapHistory] = useState<ISwapHistory[] | []>([]);

  const handleSwap = () => {
    if (!canSwap) return;
    let newHistory = [...swapHistory];
    if (newHistory.length === HISTORY_MAX_LENGTH) {
      newHistory.shift();
    }
    // selectedFrom and selectedTo can't be null since canSwap is true
    newHistory.push({
      fromCurrency: selectedFrom!,
      fromAmount: amountFrom,
      toCurrency: selectedTo!,
      toAmount: amountTo,
      createdAt: new Date().getTime(),
    });
    setSwapHistory(newHistory);
  };

  useEffect(() => {
    async function fetch() {
      await getData();
    }
    fetch();
  }, []);

  useEffect(() => {
    setCanSwap([selectedFrom, selectedTo, amountFrom].every((item) => !!item));
  }, [selectedFrom, selectedTo, amountFrom]);

  useEffect(() => {
    if (!canSwap) return;
    // selectedFrom and selectedTo can't be null since canSwap is true
    const swapResult = calculateSwapResult(
      selectedFrom!,
      selectedTo!,
      amountFrom,
      currencyMap
    );
    setAmountTo(swapResult);
  }, [canSwap, selectedFrom, selectedTo, amountFrom, currencyMap]);

  return (
    <div className="w-[350px]">
      <SwapHistory swapHistory={swapHistory}></SwapHistory>
      <div className="py-2"></div>
      <Card>
        <CardHeader>
          <CardTitle>Currency Swap</CardTitle>
          <CardDescription>
            Swap from one currency to another currencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <SwapItem
                title="Swap From"
                data={currencySymbols}
                setSelected={setSelectedFrom}
                amount={amountFrom}
                setAmount={setAmountFrom}
                isAutoFocus={true}
                isLoading={loading}
              />
              <SwapItem
                title="Swap To"
                data={currencySymbols}
                setSelected={setSelectedTo}
                amount={amountTo}
                isEditable={false}
                isLoading={loading}
              />
            </div>
          </form>
          {selectedFrom && selectedTo && selectedFrom === selectedTo ? (
            <p>You are swapping the same currency. Are you sure? &#x1F914;</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSwap} disabled={!canSwap}>
            Swap
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SwapCard;
