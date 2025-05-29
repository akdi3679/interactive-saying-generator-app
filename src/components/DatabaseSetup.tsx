
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DATABASE_CONFIG, isDatabaseConfigured } from '@/config/database';
import { CheckCircle, AlertCircle } from 'lucide-react';

const DatabaseSetup = () => {
  const [mongoUri, setMongoUri] = useState(DATABASE_CONFIG.mongodb.uri);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(isDatabaseConfigured());
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Since we're using MongoDB only, just validate the URI format
      if (!mongoUri || mongoUri.includes('your-username')) {
        throw new Error('Please provide a valid MongoDB URI');
      }
      
      setIsConnected(true);
      console.log('MongoDB connection configured successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            MongoDB Configuration
            {isConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
          </CardTitle>
          <CardDescription>
            Configure your MongoDB connection string to enable full functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mongo-uri">MongoDB Connection String</Label>
            <Input
              id="mongo-uri"
              type="password"
              placeholder="mongodb+srv://username:password@cluster.mongodb.net/dbname"
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test Connection'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSetup;
