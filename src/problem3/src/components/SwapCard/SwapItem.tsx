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

function SwapItem({
  title,
  data,
  setSelected,
  setAmount,
  isEditable = true,
  isAutoFocus = false,
  isLoading = false,
}: {
  title: string;
  data: string[];
  setSelected: Dispatch<SetStateAction<string | null>>;
  setAmount?: Dispatch<SetStateAction<number | null>>;
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
    // TODO should have debounce
    const target = event.target as HTMLInputElement
    console.log('event', event)
    if (!/[0-9]/.test(target.value)) {
      // not very good user experience
      // could have solved this better with a validation schema library
      target.value = '';
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
      <div className="grid grid-cols-[5fr_5fr_1fr] gap-2">
        {isLoading ? (
          <Skeleton></Skeleton>
        ) : (
          <Select onValueChange={(value) => setSelected(value)}>
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
        ></Input>
        {/* TODO icon */}
      </div>
    </div>
  );
}

export default SwapItem;
