import React, { useState } from "react";

// Asset Class
class Asset {
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
class Account {
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
class Exchange {
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

const EconomicsSimulator: React.FC = () => {
  // State Management
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  // Form States
  const [newAccountName, setNewAccountName] = useState<string>("");
  const [newAssetName, setNewAssetName] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [assetAmount, setAssetAmount] = useState<number>(0);
  const [newExchangeName, setNewExchangeName] = useState<string>("");
  const [exchangeAsset1, setExchangeAsset1] = useState<string>("");
  const [exchangeAsset2, setExchangeAsset2] = useState<string>("");

  // Create New Account
  const createAccount = () => {
    if (newAccountName && !accounts.some((a) => a.owner === newAccountName)) {
      const newAccount = new Account(newAccountName);
      setAccounts([...accounts, newAccount]);
      setNewAccountName("");
    }
  };

  // Create New Asset
  const createAsset = () => {
    if (newAssetName && !assets.some((a) => a.name === newAssetName)) {
      const newAsset = new Asset(newAssetName);
      setAssets([...assets, newAsset]);
      setNewAssetName("");
    }
  };

  // Add Asset to Account
  const addAssetToAccount = () => {
    if (selectedAccount && selectedAsset && assetAmount > 0) {
      const targetAccount = accounts.find((a) => a.owner === selectedAccount);
      const targetAsset = assets.find((a) => a.name === selectedAsset);

      if (targetAccount && targetAsset) {
        targetAccount.addAsset(targetAsset, assetAmount);
        setAccounts([...accounts]);
      }
    }
  };

  // Create Exchange
  const createExchange = () => {
    if (newExchangeName && exchangeAsset1 && exchangeAsset2) {
      const asset1 = assets.find((a) => a.name === exchangeAsset1);
      const asset2 = assets.find((a) => a.name === exchangeAsset2);

      if (asset1 && asset2) {
        const newExchange = new Exchange(newExchangeName);
        newExchange.addPool(asset1, asset2);
        setExchanges([...exchanges, newExchange]);
        setNewExchangeName("");
        setExchangeAsset1("");
        setExchangeAsset2("");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Pane - Control Panel */}
      <div className="w-1/3 p-6 bg-gray-100 overflow-y-auto border-r">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Economics Simulator
        </h1>

        {/* Account Creation Section */}
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create Account</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              placeholder="Account Name"
              className="border p-2 rounded flex-grow"
            />
            <button
              onClick={createAccount}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Create
            </button>
          </div>
        </div>

        {/* Asset Creation Section */}
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create Asset</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Asset Name"
              className="border p-2 rounded flex-grow"
            />
            <button
              onClick={createAsset}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </div>

        {/* Add Asset to Account Section */}
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Add Asset to Account</h2>
          <div className="space-y-2">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.owner} value={account.owner}>
                  {account.owner}
                </option>
              ))}
            </select>

            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Asset</option>
              {assets.map((asset) => (
                <option key={asset.name} value={asset.name}>
                  {asset.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={assetAmount}
              onChange={(e) => setAssetAmount(Number(e.target.value))}
              placeholder="Amount"
              className="w-full border p-2 rounded"
              min="0"
            />

            <button
              onClick={addAssetToAccount}
              className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            >
              Add Asset to Account
            </button>
          </div>
        </div>

        {/* Create Exchange Section */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create Exchange</h2>
          <div className="space-y-2">
            <input
              type="text"
              value={newExchangeName}
              onChange={(e) => setNewExchangeName(e.target.value)}
              placeholder="Exchange Name"
              className="w-full border p-2 rounded"
            />

            <select
              value={exchangeAsset1}
              onChange={(e) => setExchangeAsset1(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select First Asset</option>
              {assets.map((asset) => (
                <option key={asset.name} value={asset.name}>
                  {asset.name}
                </option>
              ))}
            </select>

            <select
              value={exchangeAsset2}
              onChange={(e) => setExchangeAsset2(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Second Asset</option>
              {assets.map((asset) => (
                <option key={asset.name} value={asset.name}>
                  {asset.name}
                </option>
              ))}
            </select>

            <button
              onClick={createExchange}
              className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
            >
              Create Exchange
            </button>
          </div>
        </div>
      </div>

      {/* Right Pane - Display Area */}
      <div className="w-2/3 p-6 overflow-y-auto">
        {/* Accounts Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Accounts</h2>
          <div className="bg-white shadow rounded">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Owner</th>
                  <th className="p-3 text-left">Assets</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{account.owner}</td>
                    <td className="p-3">
                      {Object.entries(account.holdings)
                        .map(([asset, amount]) => `${asset}: ${amount}`)
                        .join(", ") || "No assets"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exchanges Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
          <div className="bg-white shadow rounded">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Pools</th>
                </tr>
              </thead>
              <tbody>
                {exchanges.map((exchange, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{exchange.name}</td>
                    <td className="p-3">
                      {Object.entries(exchange.pools)
                        .map(
                          ([key, pool]) =>
                            `${key}: ${Object.entries(pool)
                              .map(([asset, amount]) => `${asset}: ${amount}`)
                              .join(", ")}`,
                        )
                        .join("; ") || "No pools"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicsSimulator;
