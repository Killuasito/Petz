import { useState } from "react";
import { SHOP_ITEMS } from "../constants/shop";
import { FaCoins, FaStore, FaBoxOpen } from "react-icons/fa";

function Shop({ coins = 0, inventory = [], onPurchase }) {
  const [activeTab, setActiveTab] = useState("toys");

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FaStore className="text-purple-500" /> Loja
        </h3>
        <span className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
          <FaCoins className="text-yellow-500" />
          {coins}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        {Object.keys(SHOP_ITEMS).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-3 py-1 rounded capitalize ${
              activeTab === category
                ? "bg-purple-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SHOP_ITEMS[activeTab]?.map((item) => {
          const isOwned = inventory.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => !isOwned && onPurchase(item)}
              disabled={isOwned || coins < item.price}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${
                  isOwned
                    ? "bg-green-50 border-green-200"
                    : coins < item.price
                    ? "bg-gray-50 border-gray-200 opacity-50"
                    : "bg-purple-50 border-purple-200 hover:bg-purple-100"
                }
              `}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-medium">{item.name}</div>
              {isOwned ? (
                <div className="text-xs text-green-600 flex items-center justify-center gap-1 mt-1">
                  <FaBoxOpen /> Obtido
                </div>
              ) : (
                <div className="text-xs flex items-center justify-center gap-1 mt-1">
                  <FaCoins className="text-yellow-500" />
                  {item.price}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Shop;
