'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { DEFAULT_PLAYER_PROFILE } from '@/lib/companyData';
import { AppView, PlayerProfile } from '@/lib/types';
import AvatarCustomizer from './AvatarCustomizer';
import BulletinView from './BulletinView';
import DirectoryView from './DirectoryView';
import OfficeWorld from './OfficeWorld';
import OrgChartView from './OrgChartView';

const STORAGE_KEY = 'pixelhq_player_profile_v1';
const PROFILE_EVENT = 'pixelhq-profile-updated';

let cachedRawProfile: string | null = null;
let cachedParsedProfile: PlayerProfile = DEFAULT_PLAYER_PROFILE;

function subscribeProfile(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(PROFILE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(PROFILE_EVENT, callback);
  };
}

function getProfileSnapshot(): PlayerProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRawProfile) return cachedParsedProfile;
    cachedRawProfile = raw;
    if (raw) {
      const parsed = JSON.parse(raw) as PlayerProfile;
      if (parsed && parsed.appearance) {
        cachedParsedProfile = parsed;
        return cachedParsedProfile;
      }
    }
  } catch {
    // ignore storage errors
  }
  cachedParsedProfile = DEFAULT_PLAYER_PROFILE;
  return cachedParsedProfile;
}

function getServerProfileSnapshot(): PlayerProfile {
  return DEFAULT_PLAYER_PROFILE;
}

export default function PixelHQApp() {
  const [activeView, setActiveView] = useState<AppView>('world');
  const playerProfile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getServerProfileSnapshot
  );
  const [targetEmployeeId, setTargetEmployeeId] = useState<string | null>(null);
  const [orgChartEmployeeId, setOrgChartEmployeeId] = useState<string | null>(
    null
  );

  const handleSaveProfile = (next: PlayerProfile) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(PROFILE_EVENT));
    } catch {
      // ignore storage errors
    }
  };

  const handleVisitEmployee = (employeeId: string) => {
    setTargetEmployeeId(employeeId);
    setActiveView('world');
  };

  const handleOpenOrgChartForEmployee = (employeeId: string) => {
    setOrgChartEmployeeId(employeeId);
    setActiveView('org');
  };

  const navItems: { id: Exclude<AppView, 'avatar'>; label: string }[] = [
    { id: 'world', label: 'Office World' },
    { id: 'org', label: 'Org Chart' },
    { id: 'directory', label: 'Directory' },
    { id: 'bulletin', label: 'Bulletin' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#14171F] text-slate-100">
      {/* 3-Zone Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-8 border-b-2 border-[#2A3142] bg-[#181C26] px-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setActiveView('world')}
          className="font-pixel text-base tracking-wide text-amber-400 transition-colors hover:text-amber-300 whitespace-nowrap shrink-0"
        >
          PixelHQ
        </button>

        {/* Zone 2: Concise single-line text nav links */}
        <nav className="flex items-center gap-6 overflow-x-auto text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`border-b-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('avatar')}
            className={`px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'avatar'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            Edit Avatar
          </button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1">
        {activeView === 'world' && (
          <OfficeWorld
            playerProfile={playerProfile}
            targetEmployeeId={targetEmployeeId}
            onClearTargetEmployee={() => setTargetEmployeeId(null)}
            onOpenOrgChartForEmployee={handleOpenOrgChartForEmployee}
          />
        )}

        {activeView === 'org' && (
          <OrgChartView
            initialEmployeeId={orgChartEmployeeId}
            onVisitEmployee={handleVisitEmployee}
          />
        )}

        {activeView === 'directory' && (
          <DirectoryView onVisitEmployee={handleVisitEmployee} />
        )}

        {activeView === 'bulletin' && (
          <BulletinView onExploreOffice={() => setActiveView('world')} />
        )}

        {activeView === 'avatar' && (
          <AvatarCustomizer
            profile={playerProfile}
            onSave={handleSaveProfile}
            onEnterOffice={() => setActiveView('world')}
          />
        )}
      </main>
    </div>
  );
}
