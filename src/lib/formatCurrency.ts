export function formatMVR(value: number | string): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "MVR 0";
  }

  return new Intl.NumberFormat("en-MV", {
    style: "currency",
    currency: "MVR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatMVRSymbol(_value: number | string): string {
  return "MVR";
}

export function formatMVRAmount(value: number | string): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0";
  }

  return new Intl.NumberFormat("en-MV", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

