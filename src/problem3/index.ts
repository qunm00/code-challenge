interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// ! if eslint is used, no-empty-interface will be raised
// * could be safely ignored
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  // ! two hooks below can have types inside diamond operator so that reader could quickly get the shape of balances and prices
  const balances = useWalletBalances();
  const prices = usePrices();

  // ! avoid usage of any
  // * any could be either enum or string
  // ! this function could be refactored outside of React component since it does not handle rendering logic
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // ! for more readability, sortedBalances could be filteredBalance, then filteredBalance can be assigned to sortedBalance after sorted
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // ! blockchain is not defined on WalletBalance
        // * define blockchain on WalletBalance
        const balancePriority = getPriority(balance.blockchain);
        // ! not sure what lhsPriority is
        // * lhsPriorioty seems like it should be balancePriority instead
        // * this filter function removes wallet that is not in priorityList and has negative balance
        // ! below two if statements could be reduced to one if statement
        //** 
            if ((lhsPriority > -99) && (balance.amount <= 0)) {
                //
            }
        */
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // ! same as above blockchain is not defined on WalletBalance
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // ! missing return 0
        // * I think it's ok to miss return 0 after trying it out in node
      });
      // ! not sure why prices is in dependencies when there is only balances in useMemo
      // * prices could be removed from dependencies array
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // ! map does not modify original array so that balance in sortedBalances isn't FormattedWalletBalance
  // * should use formattedBalances instead of sortedBalances
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
