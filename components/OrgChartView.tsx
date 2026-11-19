'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { EMPLOYEES, ROOMS } from '@/lib/companyData';
import { Employee } from '@/lib/types';
import PixelPortrait from './PixelPortrait';

interface OrgChartViewProps {
  initialEmployeeId: string | null;
  onVisitEmployee: (employeeId: string) => void;
}

export default function OrgChartView({
  initialEmployeeId,
  onVisitEmployee,
}: OrgChartViewProps) {
  const [selectedId, setSelectedId] = useState<string>(
    initialEmployeeId || 'emp-claire'
  );

  const ceo = useMemo(
    () => EMPLOYEES.find((e) => e.level === 0) || EMPLOYEES[0],
    []
  );

  const departmentHeads = useMemo(
    () => EMPLOYEES.filter((e) => e.managerId === ceo.id),
    [ceo.id]
  );

  const selectedEmployee = useMemo(
    () => EMPLOYEES.find((e) => e.id === selectedId) || ceo,
    [selectedId, ceo]
  );

  const selectedRoom = useMemo(
    () => ROOMS.find((r) => r.id === selectedEmployee.departmentId),
    [selectedEmployee]
  );

  const selectedManager = useMemo(
    () =>
      selectedEmployee.managerId
        ? EMPLOYEES.find((e) => e.id === selectedEmployee.managerId) || null
        : null,
    [selectedEmployee]
  );

  const directReports = useMemo(
    () => EMPLOYEES.filter((e) => e.managerId === selectedEmployee.id),
    [selectedEmployee.id]
  );

  const getReports = (managerId: string): Employee[] =>
    EMPLOYEES.filter((e) => e.managerId === managerId);

  const getRoomName = (deptId: string) =>
    ROOMS.find((r) => r.id === deptId)?.shortName || deptId;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-[#14171F] lg:flex-row">
      {/* Main Org Hierarchy Tree */}
      <div className="flex-1 overflow-auto p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#2A3142] pb-5">
            <div>
              <h1 className="font-pixel text-xl text-slate-100">
                Company Organization Chart
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                {EMPLOYEES.length} teammates across 5 divisions · Select anyone
                to inspect or walk to their room in HQ
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Users className="h-4 w-4 text-amber-400" />
              <span className="tabular-nums">{EMPLOYEES.length} Total</span>
            </div>
          </div>

          {/* Tier 0: CEO */}
          <div className="mt-8 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setSelectedId(ceo.id)}
              className={`flex w-full max-w-xs items-center gap-3.5 border-2 p-3.5 text-left transition-colors ${
                selectedEmployee.id === ceo.id
                  ? 'border-amber-400 bg-[#23293A]'
                  : 'border-[#343C4F] bg-[#1A1F2B] hover:border-slate-500'
              }`}
            >
              <PixelPortrait appearance={ceo.appearance} size={52} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-pixel text-xs text-amber-300">
                  {ceo.name}
                </div>
                <div className="mt-0.5 truncate text-xs font-medium text-slate-200">
                  {ceo.role}
                </div>
                <div className="mt-1 truncate text-[11px] text-slate-400">
                  {getRoomName(ceo.departmentId)} · {ceo.status}
                </div>
              </div>
            </button>

            {/* Vertical connector stem */}
            <div className="h-6 w-0.5 bg-[#343C4F]" />
            <div className="hidden h-0.5 w-4/5 bg-[#343C4F] md:block" />
          </div>

          {/* Tier 1: Department Heads + Tier 2 Reports */}
          <div className="mt-4 grid grid-cols-1 gap-5 md:mt-0 md:grid-cols-5">
            {departmentHeads.map((head) => {
              const reports = getReports(head.id);
              const room = ROOMS.find((r) => r.id === head.departmentId);
              return (
                <div key={head.id} className="flex flex-col items-center">
                  <div className="hidden h-5 w-0.5 bg-[#343C4F] md:block" />

                  {/* Head Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedId(head.id)}
                    className={`w-full border-2 p-3 text-left transition-colors ${
                      selectedEmployee.id === head.id
                        ? 'border-amber-400 bg-[#23293A]'
                        : 'border-[#343C4F] bg-[#1A1F2B] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <PixelPortrait appearance={head.appearance} size={42} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold text-slate-100">
                          {head.name}
                        </div>
                        <div className="truncate text-[11px] text-slate-400">
                          {head.role}
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-2.5 border-t border-[#2A3142] pt-2 text-[11px] font-medium"
                      style={{ color: room?.accentColor || '#F59E0B' }}
                    >
                      {head.orgGroup} ·{' '}
                      {1 +
                        reports.length +
                        reports.reduce(
                          (acc, r) => acc + getReports(r.id).length,
                          0
                        )}{' '}
                      members
                    </div>
                  </button>

                  {/* Sub-tree reports */}
                  {reports.length > 0 && (
                    <div className="mt-2 w-full space-y-2 border-t border-[#2A3142] pt-2">
                      {reports.map((rep) => {
                        const subReports = getReports(rep.id);
                        return (
                          <div key={rep.id} className="space-y-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedId(rep.id)}
                              className={`flex w-full items-center gap-2.5 border p-2.5 text-left transition-colors ${
                                selectedEmployee.id === rep.id
                                  ? 'border-amber-400 bg-[#23293A]'
                                  : 'border-[#2A3142] bg-[#171B26] hover:border-slate-500'
                              }`}
                            >
                              <PixelPortrait
                                appearance={rep.appearance}
                                size={34}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-medium text-slate-100">
                                  {rep.name}
                                </div>
                                <div className="truncate text-[11px] text-slate-400">
                                  {rep.role}
                                </div>
                              </div>
                            </button>

                            {subReports.length > 0 && (
                              <div className="ml-3 space-y-1 border-l border-[#2A3142] pl-2.5">
                                {subReports.map((sub) => (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => setSelectedId(sub.id)}
                                    className={`flex w-full items-center gap-2 border px-2 py-1.5 text-left transition-colors ${
                                      selectedEmployee.id === sub.id
                                        ? 'border-amber-400 bg-[#23293A]'
                                        : 'border-[#23293F] bg-[#141822] hover:border-slate-500'
                                    }`}
                                  >
                                    <PixelPortrait
                                      appearance={sub.appearance}
                                      size={26}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="truncate text-[11px] font-medium text-slate-200">
                                        {sub.name}
                                      </div>
                                      <div className="truncate text-[10px] text-slate-400">
                                        {sub.role}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Teammate Inspector Panel */}
      <aside className="w-full shrink-0 border-t-2 border-[#2A3142] bg-[#181C26] p-6 lg:w-96 lg:border-t-0 lg:border-l-2 lg:overflow-y-auto">
        <div className="flex items-start gap-4">
          <PixelPortrait
            appearance={selectedEmployee.appearance}
            size={68}
            animateWalk
            className="border-2 border-[#3E4860]"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-pixel text-base text-amber-300">
              {selectedEmployee.name}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-slate-200">
              {selectedEmployee.role}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span>{selectedRoom?.name}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedEmployee.status}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onVisitEmployee(selectedEmployee.id)}
          className="mt-5 flex w-full items-center justify-center gap-2 bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400"
        >
          <MapPin className="h-4 w-4" />
          <span>Walk to {selectedEmployee.name.split(' ')[0]}’s Desk</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="mt-6 space-y-5 border-t border-[#2A3142] pt-5">
          <div>
            <div className="text-xs font-semibold text-slate-300">
              Current Project
            </div>
            <p className="mt-1 text-sm text-slate-100">
              {selectedEmployee.currentProject}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-300">
              Location in HQ
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {selectedEmployee.locationLabel}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-300">
              Focus Areas
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {selectedEmployee.skills.join(' · ')}
            </p>
          </div>

          {selectedManager && (
            <div>
              <div className="text-xs font-semibold text-slate-300">
                Reports To
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(selectedManager.id)}
                className="mt-2 flex w-full items-center gap-3 border border-[#2D3548] bg-[#1E2432] p-2.5 text-left transition-colors hover:border-amber-400/70"
              >
                <PixelPortrait
                  appearance={selectedManager.appearance}
                  size={36}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-slate-100">
                    {selectedManager.name}
                  </div>
                  <div className="truncate text-[11px] text-slate-400">
                    {selectedManager.role}
                  </div>
                </div>
              </button>
            </div>
          )}

          {directReports.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-300">
                Direct Reports ({directReports.length})
              </div>
              <div className="mt-2 space-y-2">
                {directReports.map((rep) => (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => setSelectedId(rep.id)}
                    className="flex w-full items-center gap-3 border border-[#2D3548] bg-[#1E2432] p-2 text-left transition-colors hover:border-amber-400/70"
                  >
                    <PixelPortrait appearance={rep.appearance} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-slate-100">
                        {rep.name}
                      </div>
                      <div className="truncate text-[11px] text-slate-400">
                        {rep.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
