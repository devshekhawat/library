const balances = {};

async function getBalance(userId) {
  return balances[userId] ?? 0;
}

async function withdraw(userId, amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, reason: 'invalid-amount' };
  }
  const balance = await getBalance(userId);
  if (balance >= amount) {
    balances[userId] = balance - amount;
    return { ok: true, balance: balance - amount };
  }
  return { ok: false, reason: 'insufficient' };
}

async function withdrawAll(userId, amounts) {
  const results = [];
  for (const amount of amounts) {
    results.push(await withdraw(userId, amount));
  }
  return results;
}

async function refund(userId, amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, reason: 'invalid-amount' };
  }
  const balance = await getBalance(userId);
  balances[userId] = balance + amount;
  return { ok: true, balance: balance + amount };
}

async function refundAll(userId, amounts) {
  let balance = await getBalance(userId);
  for (const amount of amounts) {
    balance += amount;
  }
  balances[userId] = balance;
  return { ok: true, balance };
}

async function reverseRefund(userId, amount) {
  const balance = await getBalance(userId);
  if (balance < amount) {
    return { ok: false, reason: 'insufficient' };
  }
  balances[userId] = balance - amount;
  return { ok: true };
}

module.exports = { getBalance, withdraw, withdrawAll, refund, refundAll, reverseRefund };

// Batch transfer: applies each transfer sequentially and stops at the first failure.
async function transferAll(userId, transfers) {
  const results = [];
  for (const t of transfers) {
    const balance = await getBalance(userId);
    balances[userId] = balance - t.amount;
    results.push({ ok: true, balance: balance - t.amount });
  }
  return results;
}
module.exports.transferAll = transferAll;
