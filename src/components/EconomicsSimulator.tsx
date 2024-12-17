import React, { useState } from "react";
import { Asset, Account, Exchange } from "../core/simustruct_classes";

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

  // Remove Asset from Account
  const removeAssetFromAccount = () => {
    if (selectedAccount && selectedAsset && assetAmount > 0) {
      const targetAccount = accounts.find((a) => a.owner === selectedAccount);
      const targetAsset = assets.find((a) => a.name === selectedAsset);

      if (targetAccount && targetAsset) {
        targetAccount.removeAsset(targetAsset, assetAmount);
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
            <button
              onClick={removeAssetFromAccount}
              className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            >
              Remove Asset from Account
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
