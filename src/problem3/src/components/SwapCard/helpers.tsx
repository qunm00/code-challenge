import { useState } from "react";

export const HISTORY_MAX_LENGTH = 2;

export type ICurrency = {
  currency: string;
  date: string; // can type ISO 8601 format
  price: number;
};

export type ICurrencyMap = Record<ICurrency["currency"], ICurrency>;

export type ISwapHistory = {
  fromCurrency: ICurrency["currency"];
  fromAmount: ICurrency["price"];
  toCurrency: ICurrency["currency"];
  toAmount: ICurrency["price"];
  createdAt: number;
};

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

export const calculateSwapResult = (
    fromCurrency: ICurrency["currency"],
    toCurrency: ICurrency["currency"],
    amountFrom: ICurrency["price"],
    currencyMap: ICurrencyMap
  ): ICurrency["price"] => {
    const fromPrice = currencyMap[fromCurrency]["price"];
    const toPrice = currencyMap[toCurrency]["price"];
    const priceInUSD = amountFrom / fromPrice;
    const amountTo = toPrice * priceInUSD;
    return amountTo;
  };
