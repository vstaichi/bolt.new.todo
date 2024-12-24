import React, { useEffect, useState } from 'react';
import { Switch } from '~/components/ui/Switch';
import { useSettings } from '~/lib/hooks/useSettings';
import { LOCAL_PROVIDERS, URL_CONFIGURABLE_PROVIDERS } from '~/lib/stores/settings';
import type { IProviderConfig } from '~/types/model';

export default function ProvidersTab() {
  const { providers, updateProviderSettings, isLocalModel } = useSettings();
  const [filteredProviders, setFilteredProviders] = useState<IProviderConfig[]>([]);

  // Load base URLs from cookies
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let newFilteredProviders: IProviderConfig[] = Object.entries(providers).map(([key, value]) => ({
      ...value,
      name: key,
    }));

    if (searchTerm && searchTerm.length > 0) {
      newFilteredProviders = newFilteredProviders.filter((provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (!isLocalModel) {
      newFilteredProviders = newFilteredProviders.filter((provider) => !LOCAL_PROVIDERS.includes(provider.name));
    }

    newFilteredProviders.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredProviders(newFilteredProviders);
  }, [providers, searchTerm, isLocalModel]);

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-bolt-elements-background-depth-4 relative px-2 py-1.5 rounded-md focus:outline-none placeholder-bolt-elements-textTertiary text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary border border-bolt-elements-borderColor"
        />
      </div>
      {filteredProviders.map((provider) => (
        <div
          key={provider.name}
          className="flex flex-col mb-2 provider-item hover:bg-bolt-elements-bg-depth-3 p-4 rounded-lg border border-bolt-elements-borderColor "
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-bolt-elements-textPrimary">{provider.name}</span>
            <Switch
              className="ml-auto"
              checked={provider.settings.enabled}
              onCheckedChange={(enabled) => updateProviderSettings(provider.name, { ...provider.settings, enabled })}
            />
          </div>
          {/* Base URL input for configurable providers */}
          {URL_CONFIGURABLE_PROVIDERS.includes(provider.name) && provider.settings.enabled && (
            <div className="mt-2">
              <label className="block text-sm text-bolt-elements-textSecondary mb-1">Base URL:</label>
              <input
                type="text"
                value={provider.settings.baseUrl || ''}
                onChange={(e) =>
                  updateProviderSettings(provider.name, { ...provider.settings, baseUrl: e.target.value })
                }
                placeholder={`Enter ${provider.name} base URL`}
                className="w-full bg-white dark:bg-bolt-elements-background-depth-4 relative px-2 py-1.5 rounded-md focus:outline-none placeholder-bolt-elements-textTertiary text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary border border-bolt-elements-borderColor"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
