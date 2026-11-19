'use client';

import React, { useMemo, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { EMPLOYEES, ROOMS } from '@/lib/companyData';
import { Employee } from '@/lib/types';
import PixelPortrait from './PixelPortrait';

interface DirectoryViewProps {
  onVisitEmployee: (employeeId: string) => void;
}

const ORG_GROUPS: Employee['orgGroup'][] = [
  'Executive',
  'Tech & Product',
  'Growth & Sales',
  'People & Admin',
  'Support & Ops',
];

export default function DirectoryView({ onVisitEmployee }: DirectoryViewProps) {
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<
    Employee['orgGroup'] | 'all'
  >('all');

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EMPLOYEES.filter((emp) => {
      if (selectedGroup !== 'all' && emp.orgGroup !== selectedGroup) {
        return false;
      }
      if (!q) return true;
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.locationLabel.toLowerCase().includes(q) ||
        emp.currentProject.toLowerCase().includes(q) ||
        emp.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [query, selectedGroup]);

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-[#14171F] p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col gap-4 border-b border-[#2A3142] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-pixel text-xl text-slate-100">
              Team Directory & Rooms
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Browse all {EMPLOYEES.length} teammates across our 21 HQ rooms and
              walk straight to any wing
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, room, or skill..."
              className="w-full border border-[#343C4F] bg-[#1B202C] py-2 pr-3 pl-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Interactive Division Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border border-[#2A3142] bg-[#1A1F2B] p-1.5">
          <button
            type="button"
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedGroup === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:bg-[#23293A] hover:text-white'
            }`}
          >
            All Teams ({EMPLOYEES.length})
          </button>
          {ORG_GROUPS.map((group) => {
            const count = EMPLOYEES.filter((e) => e.orgGroup === group).length;
            return (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedGroup === group
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-[#23293A] hover:text-white'
                }`}
              >
                {group} ({count})
              </button>
            );
          })}
        </div>

        {/* Teammate Grid */}
        {filteredEmployees.length === 0 ? (
          <div className="border border-[#2A3142] bg-[#181C26] p-10 text-center text-sm text-slate-400">
            No teammates matched “{query}”. Try clearing your filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((emp) => {
              const room = ROOMS.find((r) => r.id === emp.departmentId);
              return (
                <div
                  key={emp.id}
                  className="flex flex-col justify-between border border-[#2D3548] bg-[#181C26] p-5 transition-colors hover:border-slate-500"
                >
                  <div>
                    <div className="flex items-start gap-3.5">
                      <PixelPortrait appearance={emp.appearance} size={52} />
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-pixel text-sm text-slate-100">
                          {emp.name}
                        </h2>
                        <div className="mt-0.5 truncate text-xs font-medium text-amber-400">
                          {emp.role}
                        </div>
                        <div className="mt-1 truncate text-xs text-slate-400">
                          {room?.shortName} · {emp.status}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#252B3B] pt-3 text-xs text-slate-300">
                      <span className="text-slate-400">Working on: </span>
                      {emp.currentProject}
                    </div>
                    <div className="mt-1.5 text-xs text-slate-400">
                      {emp.skills.join(' · ')}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#252B3B] pt-3">
                    <span className="truncate text-[11px] text-slate-400">
                      {emp.locationLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => onVisitEmployee(emp.id)}
                      className="ml-2 flex items-center gap-1.5 bg-[#242B3B] px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500 hover:text-slate-950 whitespace-nowrap shrink-0"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Locate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
