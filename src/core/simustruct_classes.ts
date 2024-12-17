// Asset Class
export class Asset {
  name: string;
  totalSupply: number;

  constructor(name: string) {
    this.name = name;
    this.totalSupply = 0;
  }

  toString() {
    return `Asset(${this.name})`;
  }
}

// Account Class
export class Account {
  owner: string;
  holdings: Record<string, number>;

  constructor(owner: string) {
    this.owner = owner;
    this.holdings = {};
  }

  addAsset(Asset: Asset, amount: number) {
    if (!this.holdings[Asset.name]) {
      this.holdings[Asset.name] = 0;
    }
    this.holdings[Asset.name] += amount;
  }

  removeAsset(Asset: Asset, amount: number): boolean {
    if (this.holdings[Asset.name] && this.holdings[Asset.name] >= amount) {
      this.holdings[Asset.name] -= amount;
      if (this.holdings[Asset.name] === 0) {
        delete this.holdings[Asset.name];
      }
      return true;
    }
    return false;
  }

  getBalance(Asset: Asset): number {
    return this.holdings[Asset.name] || 0;
  }

  toString() {
    return `Account(${this.owner}, Holdings: ${JSON.stringify(this.holdings)})`;
  }
}

// Exchange Class
export class Exchange {
  name: string;
  pools: Record<string, Record<string, number>>;

  constructor(name: string) {
    this.name = name;
    this.pools = {};
  }

  addPool(Asset1: Asset, Asset2: Asset) {
    this.pools[`${Asset1.name}-${Asset2.name}`] = {
      [Asset1.name]: 0,
      [Asset2.name]: 0,
    };
  }

  deposit(Asset: Asset, amount: number, account: Account): boolean {
    if (account.removeAsset(Asset, amount)) {
      for (const pool of Object.values(this.pools)) {
        if (pool[Asset.name] !== undefined) {
          pool[Asset.name] += amount;
          return true;
        }
      }
    }
    return false;
  }

  trade(
    AssetFrom: Asset,
    AssetTo: Asset,
    amount: number,
    account: Account,
  ): boolean {
    for (const [key, pool] of Object.entries(this.pools)) {
      const [res1, res2] = key.split("-");
      if (res1 === AssetFrom.name && res2 === AssetTo.name) {
        if (pool[res1] >= amount) {
          pool[res1] -= amount;
          pool[res2] += amount;
          account.addAsset(new Asset(res2), amount);
          return true;
        }
      }
    }
    return false;
  }

  toString() {
    return `Exchange(${this.name}, Pools: ${JSON.stringify(this.pools)})`;
  }
}
