// Seeded verification bugs: non-atomic read-modify-write + negative amounts + floating promise.
class Wallet {
  constructor() { this.balances = {}; }
  getBalance(user) { return this.balances[user] ?? 0; }
  withdraw(user, amount) {
    if (amount < 0) { /* TODO: validate */ }
    const current = this.getBalance(user);
    this.balances[user] = current - amount; // race: read-modify-write not atomic
    return Promise.resolve(this.balances[user]);
  }
  refund(user, amount) {
    const current = this.getBalance(user);
    this.balances[user] = current + amount; // race + negative amount unguarded
  }
  refundAll(users, amounts) {
    return Promise.all(users.map((u, i) => this.refund(u, amounts[i]))); // concurrent mutation race
  }
}
module.exports = { Wallet };
