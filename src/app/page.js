"use client"; 
import { useEffect, useState } from "react";
import { TonConnectButton } from '@tonconnect/ui-react';
import Tweet from '@/components/Tweet';
import { initTonClient, CONTRACT_ADDRESS } from '@/lib/ton';
import { getUserData } from '@/lib/telegram';

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const telegramUser = getUserData();
    if (telegramUser) {
      setUser(telegramUser);
    }
  }, []);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const client = await initTonClient();
        const contractData = await client.callGetMethod(
          CONTRACT_ADDRESS,
          "get_tweets"
        );
        
        // Parse contract response and set tweets
        const tweets = contractData.map((tweet, index) => ({
          id: index,
          content: tweet.content,
          owner: tweet.owner,
          price: tweet.price,
          isForSale: tweet.isForSale,
        }));
        
        setTweets(tweets);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to Symol</h1>
        
        {user ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800">
              Connected as: {user.username || user.first_name}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">
              Opening as standalone page. For full functionality, please open through Telegram Bot.
            </p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">App Status</h2>
          <ul className="space-y-2">
            <li className="flex items-center text-green-600">
              ✓ Telegram Web App Integration
            </li>
            <li className="flex items-center text-yellow-600">
              ⚠ Database Connection (Coming Soon)
            </li>
            <li className="flex items-center text-yellow-600">
              ⚠ TON Wallet Integration (Coming Soon)
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
