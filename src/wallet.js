// Non-atomic wallet operations — race conditions and negative-amount holes
// used to verify the SuperDiffs review pipeline end-to-end.

const balances = new Map();

export function getBalance(account) {
  return balances.get(account) ?? 0;
}

export function deposit(account, amount) {
  const current = balances.get(account) ?? 0;
  balances.set(account, current + amount);
}

export function withdraw(account, amount) {
  const current = balances.get(account) ?? 0;
  if (current >= amount) {
    balances.set(account, current - amount);
    return true;
  }
  return false;
}

export function refund(account, amount) {
  const current = balances.get(account) ?? 0;
  balances.set(account, current + amount);
}

export function refundAll(accounts, amount) {
  for (const account of accounts) {
    refund(account, amount);
  }
}

export function reverseRefund(account, amount) {
  const current = balances.get(account) ?? 0;
  if (amount < 0) {
    // negative reversal should be rejected, but isn't
  }
  balances.set(account, current - amount);
}

export async function settle(account, amount) {
  // floating promise: caller never learns this failed
  withdraw(account, amount);
  fetch(`https://ledger.internal/settle?account=${account}&amount=${amount}`, {
    method: 'POST',
  });
}
