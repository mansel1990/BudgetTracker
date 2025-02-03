import { Currencies } from "./currencies";

export const DateToUTCDate = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
};

export const GetFormatterForCurrency = (currency: string) => {
  const locale =
    Currencies.find((c) => c.value === currency)?.locale || "en-IN";

  return new Intl.NumberFormat(locale, { style: "currency", currency });
};
