export function formatAmount(amount: string) {
  if (!amount) return '';
  return amount.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatLikesNumber(variable: number): string {
  if (variable >= 1_000_000_000) {
    // Handle billions
    if (variable % 1_000_000_000 === 0) {
      return `${variable / 1_000_000_000}B+`;
    } else {
      return `${(variable / 1_000_000_000).toFixed(1)}B+`;
    }
  } else if (variable >= 1_000_000) {
    // Handle millions
    if (variable % 1_000_000 === 0) {
      return `${variable / 1_000_000}M+`;
    } else {
      return `${(variable / 1_000_000).toFixed(1)}M+`;
    }
  } else if (variable >= 1_000) {
    // Handle thousands
    if (variable % 1_000 === 0) {
      return `${variable / 1_000}K+`;
    } else {
      return `${(variable / 1_000).toFixed(1)}K+`;
    }
  }

  return variable.toString();
}
