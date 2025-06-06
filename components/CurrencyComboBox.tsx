"use client";

import * as React from "react";
import { useMediaQuery } from "@react-hook/media-query";

import { Button } from "@/components/ui/button";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { user_settings } from "@prisma/client";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

function OptionList({
  setOpen,
  setSelectedOption: setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (currency: Currency | null) => void;
}) {
  return (
    <>
      <Command>
        <CommandInput placeholder="Filter currency..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {Currencies.map((currency: Currency) => (
              <CommandItem
                key={currency.value}
                value={currency.value}
                onSelect={(value) => {
                  setSelectedOption(
                    Currencies.find((priority) => priority.value === value) ||
                      null
                  );
                  setOpen(false);
                }}
              >
                {currency.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </>
  );
}

const CurrencyComboBox = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  );

  const userSettings = useQuery<user_settings>({
    queryKey: ["user-settings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );

    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: user_settings) => {
      toast.success("Currency updated", { id: "update-currency" });
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: "update-currency" });
    },
  });

  const selectOption = React.useCallback((currency: Currency | null) => {
    if (!currency) {
      toast.error("Please select a currency");
      return
    };
    toast.loading("Updating currency...", { id: "update-currency" });
    setSelectedOption(currency);
    mutation.mutate(currency.value);
  }, [mutation]);

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={mutation.isPending} className="w-full justify-start">
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList
              setOpen={setOpen}
              setSelectedOption={selectOption}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" disabled={mutation.isPending} className="w-full justify-start">
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList
              setOpen={setOpen}
              setSelectedOption={selectOption}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
};

export default CurrencyComboBox;
