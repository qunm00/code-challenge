import { History } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ISwapHistory } from "./helpers";
import { HISTORY_MAX_LENGTH } from "./helpers";

function SwapHistory({swapHistory}: {swapHistory: ISwapHistory[]}) {
  const swapHistoryString = swapHistory.length ? swapHistory.map((item) => {
    return <li>{`You have made a swap from ${item.fromAmount} ${item.fromCurrency} to ${item.toAmount} ${item.toCurrency}`}</li>
  }) : `You have made no swap`
  return (
    <Alert>
      <History className="h-4 w-4" />
      <AlertTitle>Last {HISTORY_MAX_LENGTH} swaps</AlertTitle>
      <AlertDescription>
        <ul className='list-disc'>
          {swapHistoryString}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export default SwapHistory;