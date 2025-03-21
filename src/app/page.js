"use client"; 
import { useState, useEffect } from "react";
import { TonConnectButton } from '@tonconnect/ui-react';
import Tweet from '@/components/Tweet';
import { initTonClient } from '@/lib/ton';
import { getUserData } from '@/lib/telegram';

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUserData();

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const client = await initTonClient();
        // TODO: Implement fetching tweets from smart contract
        // For now, using mock data
        setTweets([
          {
            id: 1,
            content: 'Hello TON!',
            owner: 'EQA...',
            price: 10,
            isForSale: true,
          },
          // Add more mock tweets
        ]);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.username || 'Guest'}</h1>
        <TonConnectButton />
      </div>

      {loading ? (
        <p>Loading tweets...</p>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))}
        </div>
      )}
    </main>
  );
}
