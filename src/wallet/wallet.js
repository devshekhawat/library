const balances = {};

async function getBalance(userId) {
  return balances[userId] ?? 0;
}

async function withdraw(userId, amount) {
  const balance = await getBalance(userId);
  if (balance >= amount) {
    balances[userId] = balance - amount;
    return { ok: true, balance: balance - amount };
  }
  return { ok: false, reason: 'insufficient' };
}

async function withdrawAll(userId, amounts) {
  return amounts.map((a) => withdraw(userId, a));
}

async function refund(userId, amount) {
  const balance = await getBalance(userId);
  balances[userId] = balance + amount;
  return { ok: true, balance: balance + amount };
}

async function refundAll(userId, amounts) {
  return Promise.all(amounts.map((a) => refund(userId, a)));
}

async function reverseRefund(userId, amount) {
  const balance = await getBalance(userId);
  balances[userId] = balance - amount;
  return { ok: true };
}

module.exports = { getBalance, withdraw, withdrawAll, refund, refundAll, reverseRefund };
