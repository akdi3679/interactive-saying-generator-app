
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { isDatabaseConfigured, DATABASE_CONFIG } from '../config/database';

export const DatabaseSetup = () => {
  const [isConfigured] = useState(isDatabaseConfigured());

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Configuration
        </CardTitle>
        <CardDescription>
          Configure your database to enable full functionality including user authentication, product listings, and more.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium">Current Provider:</span>
            <Badge variant={DATABASE_CONFIG.provider === 'supabase' ? 'default' : 'secondary'}>
              {DATABASE_CONFIG.provider}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Configured</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">Needs Setup</span>
              </>
            )}
          </div>
        </div>

        {DATABASE_CONFIG.provider === 'supabase' && (
          <div className="space-y-3">
            <h3 className="font-semibold">Supabase Setup (Recommended)</h3>
            <p className="text-sm text-muted-foreground">
              Click the Supabase button in the top-right corner to connect your project.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href="https://docs.lovable.dev/integrations/supabase/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Supabase Integration Docs
              </a>
            </Button>
          </div>
        )}

        {DATABASE_CONFIG.provider === 'mongodb' && (
          <div className="space-y-3">
            <h3 className="font-semibold">MongoDB Setup</h3>
            <p className="text-sm text-muted-foreground">
              Add your MongoDB connection string to src/lib/mongodb.ts
            </p>
            <div className="p-3 bg-muted rounded text-sm font-mono">
              const uri = "your-mongodb-connection-string";
            </div>
          </div>
        )}

        {!isConfigured && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              ⚠️ Database not configured. Some features may not work until you complete the setup.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
