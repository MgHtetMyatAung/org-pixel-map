'use client';

import React from 'react';
import { Compass, Megaphone } from 'lucide-react';
import { BULLETIN_POSTS, INTERACTIVE_PROPS, ROOMS } from '@/lib/companyData';

interface BulletinViewProps {
  onExploreOffice: () => void;
}

export default function BulletinView({ onExploreOffice }: BulletinViewProps) {
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-[#14171F] p-6 lg:p-10">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#2A3142] pb-6">
          <div>
            <h1 className="font-pixel text-xl text-slate-100">
              HQ Town Square Bulletin
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Company announcements, weekly rituals, and interactive office
              landmarks to discover
            </p>
          </div>

          <button
            type="button"
            onClick={onExploreOffice}
            className="flex items-center gap-2 bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400 whitespace-nowrap shrink-0"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Office Map</span>
          </button>
        </div>

        {/* Announcements */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Megaphone className="h-4 w-4 text-amber-400" />
            <span>Pinned Notices</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {BULLETIN_POSTS.map((post) => (
              <article
                key={post.id}
                className="border border-[#2D3548] bg-[#181C26] p-5"
              >
                <div className="text-xs text-slate-400">
                  {post.department} · {post.date}
                </div>
                <h2 className="mt-1.5 text-base font-semibold text-slate-100">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {post.summary}
                </p>
                <div className="mt-4 border-t border-[#252B3B] pt-3 text-xs text-slate-400">
                  Posted by {post.author}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive Office Landmarks */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              Interactive Office Landmarks (Press E nearby in HQ)
            </h2>
            <span className="text-xs text-slate-400 tabular-nums">
              {INTERACTIVE_PROPS.length} locations
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {INTERACTIVE_PROPS.map((prop) => {
              const room = ROOMS.find((r) => r.id === prop.roomId);
              return (
                <div
                  key={prop.id}
                  className="flex flex-col justify-between border border-[#2D3548] bg-[#181C26] p-5"
                >
                  <div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: room?.accentColor || '#38BDF8' }}
                    >
                      {room?.name || prop.subtitle}
                    </div>
                    <h3 className="mt-1 font-pixel text-sm text-slate-100">
                      {prop.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {prop.details[0]}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-[#252B3B] pt-3 text-xs text-emerald-400">
                    Action: {prop.actionLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
