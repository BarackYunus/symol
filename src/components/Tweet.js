'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTonConnect } from '@tonconnect/ui-react';
import { showAlert, showConfirm } from '@/lib/telegram';
import { getBalance, sendTransaction, listTweetForSale } from '@/lib/ton';

export default function Tweet({ id, content, owner, price, isForSale }) {
  const [loading, setLoading] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [sellPrice, setSellPrice] = useState('');
  const { connected, wallet } = useTonConnect();
  
  const handleBuy = async () => {
    if (!connected) {
      showAlert('Please connect your TON wallet first');
      return;
    }
    
    try {
      setLoading(true);
      const confirmed = await showConfirm(`Do you want to buy this tweet for ${price} TON?`);
      
      if (confirmed) {
        const balance = await getBalance(wallet.account.address);
        if (balance < price) {
          showAlert('Insufficient balance');
          return;
        }
        
        await sendTransaction(wallet.account.address, owner, price, `Buy tweet ${id}`);
        showAlert('Tweet purchased successfully!');
      }
    } catch (error) {
      showAlert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSell = async () => {
    if (!connected) {
      showAlert('Please connect your TON wallet first');
      return;
    }
    
    setShowPriceInput(true);
  };

  const handlePriceSubmit = async () => {
    try {
      setLoading(true);
      const priceInTON = parseFloat(sellPrice);
      
      if (isNaN(priceInTON) || priceInTON <= 0) {
        showAlert('Please enter a valid price');
        return;
      }

      const confirmed = await showConfirm(`Do you want to list this tweet for ${priceInTON} TON?`);
      
      if (confirmed) {
        await listTweetForSale(id, priceInTON, wallet);
        showAlert('Tweet listed for sale successfully!');
        setShowPriceInput(false);
      }
    } catch (error) {
      showAlert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const renderSellButton = () => {
    if (wallet?.account.address !== owner) return null;
    
    if (showPriceInput) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="Price in TON"
            className="border rounded px-2 py-1 w-32"
            step="0.1"
            min="0"
          />
          <button
            onClick={handlePriceSubmit}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
          <button
            onClick={() => setShowPriceInput(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleSell}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Sell Tweet
      </button>
    );
  };
  
  return (
    <div className="border rounded-lg p-4 mb-4">
      <p className="text-lg mb-2">{content}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Owner: {owner}</p>
        {isForSale ? (
          <button
            onClick={handleBuy}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Buy for ${price} TON`}
          </button>
        ) : renderSellButton()}
      </div>
    </div>
  );
}

Tweet.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  isForSale: PropTypes.bool.isRequired
}; 