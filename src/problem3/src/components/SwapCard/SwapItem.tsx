import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import type { Dispatch, SetStateAction } from "react";
import { ICurrency } from "./helpers";

function SwapItem({
  title,
  data,
  setSelected,
  amount,
  setAmount,
  isEditable = true,
  isAutoFocus = false,
  isLoading = false,
}: {
  title: string;
  data: string[];
  setSelected: Dispatch<SetStateAction<string | null>>;
  amount: ICurrency["price"];
  setAmount?: Dispatch<SetStateAction<number>>;
  isEditable?: boolean;
  isAutoFocus?: boolean;
  isLoading?: boolean;
}) {
  const id = title.toLowerCase().replace(/\s/g, "-");
  const selectItems = data.map((item) => {
    return (
      <SelectItem value={item} key={`${id}-${item}`}>
        {item}
      </SelectItem>
    );
  });
  const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    // could use debounce so that React does not render on every keystroke
    const target = event.target as HTMLInputElement;
    if (!/[0-9]/.test(target.value)) {
      target.value = "0";
    }
    if (setAmount) {
      setAmount(parseInt(target.value));
    }
  };
  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-1">
        {title}
      </Label>
      <div className="grid grid-rows-2 gap-2">
        {isLoading ? (
          <Skeleton></Skeleton>
        ) : (
          <Select onValueChange={(value) => setSelected(value)}>
            {/* TODO icon */}
            {/* could have prepend icon to select item instead of dynamically render icon */}
            <SelectTrigger id={id}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">{selectItems}</SelectContent>
          </Select>
        )}
        <Input
          disabled={!isEditable}
          autoFocus={isAutoFocus}
          onChange={handleOnChange}
          className="text-right"
          value={amount}
        ></Input>
      </div>
    </div>
  );
}

export default SwapItem;
