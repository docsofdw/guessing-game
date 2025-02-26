import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function PlayersList() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking connection...');

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);
        
        // First check if we can connect to Supabase at all
        setConnectionStatus('Testing connection...');
        const { data: testData, error: testError } = await supabase.from('players').select('count');
        
        if (testError) {
          console.error('Connection test failed:', testError);
          setConnectionStatus(`Connection failed: ${testError.message}`);
          setError(`Connection error: ${testError.message}`);
          return;
        }
        
        setConnectionStatus('Connection successful, fetching players...');
        
        // Now fetch the actual player data
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .limit(10);
        
        if (error) {
          throw error;
        }
        
        setPlayers(data || []);
        setConnectionStatus('Data loaded successfully');
      } catch (err: any) {
        console.error('Error fetching players:', err);
        setError(err.message || 'Failed to fetch players');
        setConnectionStatus('Error loading data');
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  if (loading) return <div>
    <p>Loading players...</p>
    <p className="text-sm text-gray-500">{connectionStatus}</p>
  </div>;
  
  if (error) return <div className="text-red-500">
    <p>Error: {error}</p>
    <p className="text-sm">Status: {connectionStatus}</p>
    <p className="mt-4">Please check:</p>
    <ul className="list-disc pl-5">
      <li>Your Supabase URL and anon key are correct</li>
      <li>The 'players' table exists in your database</li>
      <li>Your network connection is stable</li>
      <li>CORS is properly configured in Supabase</li>
    </ul>
  </div>;
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Players List</h2>
      <p className="text-sm text-gray-500 mb-4">{connectionStatus}</p>
      {players.length === 0 ? (
        <p>No players found. You may need to add some data to your players table.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                {/* Add more columns based on your players table structure */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.score || 0}</td>
                  {/* Add more cells based on your players table structure */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 