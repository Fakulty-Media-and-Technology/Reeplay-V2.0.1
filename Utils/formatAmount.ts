export function formatAmount(amount: string) {
  if (!amount) return '';
  return amount.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
