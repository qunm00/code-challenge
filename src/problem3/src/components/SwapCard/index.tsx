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
import { useEffect, useState } from "react";

export type ICurrency = {
  currency: string;
  date: string; // can type ISO 8601 format
  price: number;
};

export type ICurrencyMap = Record<ICurrency["currency"], ICurrency>;

export const useGetCurrency = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currencySymbols, setCurrencySymbols] = useState<
    ICurrency["currency"][]
  >([]);
  const [currencyMap, setCurrencyMap] = useState<ICurrencyMap>({});

  const getData = async () => {
    setLoading(true);

    const response = await fetch("https://interview.switcheo.com/prices.json");

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      const data: ICurrency[] = json;
      // retrieving unique symbols
      // could have used Set() but current compilation is configured to ES5
      const symbols: ICurrency["currency"][] = [];
      for (const item of data) {
        const currency = item["currency"];
        if (!symbols.includes(item["currency"])) {
          symbols.push(currency);
        }
      }
      setCurrencySymbols(symbols);

      const tempMap: Record<ICurrency["currency"], ICurrency> = {};
      for (const item of data) {
        // only latest data is stored
        tempMap[item["currency"]] = item;
      }
      setCurrencyMap(tempMap);
    }

    setLoading(false);
  };

  return { currencySymbols, currencyMap, getData, loading, error };
};

function SwapCard() {
  const { currencySymbols, currencyMap, getData, loading, error } =
    useGetCurrency();
  const [selectedFrom, setSelectedFrom] = useState<
    ICurrency["currency"] | null
  >(null);
  const [amountFrom, setAmountFrom] = useState<number | null>(null);
  const [selectedTo, setSelectedTo] = useState<ICurrency["currency"] | null>(
    null
  );
  const [canSwap, setCanSwap] = useState<boolean | undefined>(undefined);

  // TODO there should be a function that convert currency to usd then to the next
  // - USD is medium of exchange here

  useEffect(() => {
    async function fetch() {
      await getData();
    }
    fetch();
  }, []);

  useEffect(() => {
    setCanSwap([selectedFrom, selectedTo, amountFrom].every((item) => !!item));
  }, [selectedFrom, selectedTo, amountFrom]);

  const handleSwap = () => {
    console.log("handleSwap");
    console.log('canSwap', canSwap)
    console.log("selectedFrom", selectedFrom);
    console.log("selectedTo", selectedTo);
    console.log("amountFrom", amountFrom)
    // TODO display warning message if user is trying to swap same currency
    // TODO display success toast if user successfully swap currency
  };
  return (
    <Card className="w-[350px]">
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
              setAmount={setAmountFrom}
              isAutoFocus={true}
              isLoading={loading}
            />
            <SwapItem
              title="Swap To"
              data={currencySymbols}
              setSelected={setSelectedTo}
              isEditable={false}
              isLoading={loading}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSwap} disabled={!canSwap}>
          Swap
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SwapCard;
