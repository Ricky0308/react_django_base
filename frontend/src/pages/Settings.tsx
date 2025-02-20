import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserInfo from '@/components/settings/UserInfo';
import CurrentPlan from '@/components/settings/CurrentPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Settings: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<'userInfo' | 'currentPlan'>('userInfo');

  return (
    <div className="flex min-h-screen">
      <aside className="w-1/4 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <Button
          variant={selectedSection === 'userInfo' ? 'default' : 'ghost'}
          onClick={() => setSelectedSection('userInfo')}
          className="w-full mb-4"
        >
          User Info
        </Button>
        <Button
          variant={selectedSection === 'currentPlan' ? 'default' : 'ghost'}
          onClick={() => setSelectedSection('currentPlan')}
          className="w-full"
        >
          Current Plan
        </Button>
      </aside>
      <main className="flex-grow p-4 md:p-8 lg:p-16">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {selectedSection === 'userInfo' ? 'User Information' : 'Current Plan'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSection === 'userInfo' && <UserInfo />}
            {selectedSection === 'currentPlan' && <CurrentPlan />}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings; 