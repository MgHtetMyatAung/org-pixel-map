'use client';

import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { DEFAULT_PLAYER_PROFILE } from '@/lib/companyData';
import {
  AccessoryType,
  Direction,
  HairStyle,
  PlayerProfile,
} from '@/lib/types';
import PixelPortrait from './PixelPortrait';

interface AvatarCustomizerProps {
  profile: PlayerProfile;
  onSave: (nextProfile: PlayerProfile) => void;
  onEnterOffice: () => void;
}

const SKIN_TONES = [
  '#FBE0C8',
  '#F2C19E',
  '#DF9F71',
  '#C68642',
  '#9C6137',
  '#6F4324',
];

const HAIR_COLORS = [
  '#18181B',
  '#3B2820',
  '#7C2D12',
  '#D97706',
  '#4F46E5',
  '#DB2777',
  '#E2E8F0',
];

const SHIRT_COLORS = [
  '#F59E0B',
  '#2563EB',
  '#10B981',
  '#DB2777',
  '#7C3AED',
  '#DC2626',
  '#334155',
];

const PANTS_COLORS = ['#0F172A', '#1E293B', '#2B3A55', '#3F2E26', '#334155'];

const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'parted', label: 'Parted' },
  { id: 'bob', label: 'Bob' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'curly', label: 'Curly' },
  { id: 'spiky', label: 'Spiky' },
  { id: 'cap', label: 'Cap' },
];

const ACCESSORIES: { id: AccessoryType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'headset', label: 'Headset' },
  { id: 'scarf', label: 'Scarf' },
  { id: 'badge', label: 'ID Badge' },
];

export default function AvatarCustomizer({
  profile,
  onSave,
  onEnterOffice,
}: AvatarCustomizerProps) {
  const [draft, setDraft] = useState<PlayerProfile>(profile);
  const [previewDir, setPreviewDir] = useState<Direction>('down');
  const [savedNotice, setSavedNotice] = useState(false);

  const updateAppearance = <K extends keyof PlayerProfile['appearance']>(
    key: K,
    val: PlayerProfile['appearance'][K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: val },
    }));
    setSavedNotice(false);
  };

  const handleApply = () => {
    onSave({
      ...draft,
      name: draft.name.trim() || DEFAULT_PLAYER_PROFILE.name,
      title: draft.title.trim() || DEFAULT_PLAYER_PROFILE.title,
    });
    setSavedNotice(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-[#14171F] p-6 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-[#2A3142] pb-6">
          <h1 className="font-pixel text-xl text-slate-100">
            Customize Your Pixel Avatar
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Personalize your character sprite before strolling through PixelForge
            HQ
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Left: Live Animated Preview */}
          <div className="flex flex-col items-center border border-[#2D3548] bg-[#181C26] p-6 md:col-span-5">
            <PixelPortrait
              appearance={draft.appearance}
              size={144}
              direction={previewDir}
              animateWalk
              bgColor="#23293A"
              className="border-2 border-[#3E4860]"
            />

            <div className="mt-4 text-center">
              <div className="font-pixel text-sm text-amber-300">
                {draft.name || 'Alex Mercer'}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">
                {draft.title || 'Visiting Explorer'}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5">
              {(['down', 'left', 'right', 'up'] as Direction[]).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setPreviewDir(dir)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    previewDir === dir
                      ? 'bg-amber-500 text-slate-950'
                      : 'border border-[#343C4F] bg-[#202634] text-slate-300 hover:text-white'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>

            <div className="mt-6 flex w-full flex-col gap-2 border-t border-[#252B3B] pt-5">
              <button
                type="button"
                onClick={() => {
                  handleApply();
                  onEnterOffice();
                }}
                className="flex w-full items-center justify-center gap-2 bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400"
              >
                <Check className="h-4 w-4" />
                <span>Save & Enter Office</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDraft(DEFAULT_PLAYER_PROFILE);
                  setSavedNotice(false);
                }}
                className="flex w-full items-center justify-center gap-2 border border-[#343C4F] bg-[#202634] px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Default Look</span>
              </button>

              {savedNotice && (
                <div className="text-center text-xs text-emerald-400">
                  Avatar saved!
                </div>
              )}
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="space-y-6 border border-[#2D3548] bg-[#181C26] p-6 md:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Display Name
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1.5 w-full border border-[#343C4F] bg-[#14171F] px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Role / Title
                </label>
                <input
                  type="text"
                  maxLength={32}
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, title: e.target.value }))
                  }
                  className="mt-1.5 w-full border border-[#343C4F] bg-[#14171F] px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Hair Style */}
            <div>
              <div className="text-xs font-semibold text-slate-300">
                Hair Style
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {HAIR_STYLES.map((hs) => (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => updateAppearance('hairStyle', hs.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      draft.appearance.hairStyle === hs.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-[#343C4F] bg-[#202634] text-slate-300 hover:text-white'
                    }`}
                  >
                    {hs.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <div className="text-xs font-semibold text-slate-300">
                Accessory
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => updateAppearance('accessory', acc.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      draft.appearance.accessory === acc.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-[#343C4F] bg-[#202634] text-slate-300 hover:text-white'
                    }`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-300">
                  Skin Tone
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SKIN_TONES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Skin tone ${c}`}
                      onClick={() => updateAppearance('skinColor', c)}
                      style={{ backgroundColor: c }}
                      className={`h-7 w-7 border-2 transition-transform ${
                        draft.appearance.skinColor === c
                          ? 'scale-110 border-amber-400'
                          : 'border-[#2D3548]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300">
                  Hair Color
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {HAIR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Hair color ${c}`}
                      onClick={() => updateAppearance('hairColor', c)}
                      style={{ backgroundColor: c }}
                      className={`h-7 w-7 border-2 transition-transform ${
                        draft.appearance.hairColor === c
                          ? 'scale-110 border-amber-400'
                          : 'border-[#2D3548]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300">
                  Shirt Color
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SHIRT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Shirt color ${c}`}
                      onClick={() => updateAppearance('shirtColor', c)}
                      style={{ backgroundColor: c }}
                      className={`h-7 w-7 border-2 transition-transform ${
                        draft.appearance.shirtColor === c
                          ? 'scale-110 border-amber-400'
                          : 'border-[#2D3548]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300">
                  Pants Color
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PANTS_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Pants color ${c}`}
                      onClick={() => updateAppearance('pantsColor', c)}
                      style={{ backgroundColor: c }}
                      className={`h-7 w-7 border-2 transition-transform ${
                        draft.appearance.pantsColor === c
                          ? 'scale-110 border-amber-400'
                          : 'border-[#2D3548]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
