"use client"

import { motion } from "framer-motion"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"
import { useSettings } from "../hooks/use-settings"

interface SettingsPanelProps {
  onClose: () => void
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme } = useTheme()
  const { animationsEnabled, toggleAnimations } = useAnimations()
  const { settings, updateSettings, resetSettings } = useSettings()
  const isDark = theme === "dark"

  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
      >
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/5 text-[#666]" : "hover:bg-black/5 text-gray-400"
            }`}
            whileHover={animationsEnabled ? { scale: 1.1 } : {}}
            whileTap={animationsEnabled ? { scale: 0.95 } : {}}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h2 className={`text-lg font-medium ${isDark ? "text-white" : "text-black"}`}>Command Palette Settings</h2>
        </div>
        <motion.button
          onClick={resetSettings}
          className={`p-1.5 rounded-lg text-sm flex items-center gap-1.5 ${
            isDark ? "text-[#666] hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-black hover:bg-black/5"
          }`}
          whileHover={animationsEnabled ? { scale: 1.05 } : {}}
          whileTap={animationsEnabled ? { scale: 0.95 } : {}}
          title="Reset to defaults"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </motion.button>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        <div className="space-y-6">
          <section>
            <h3 className={`text-sm font-medium mb-2 ${isDark ? "text-white" : "text-black"}`}>Display</h3>
            <div className="space-y-3">
              <ToggleSetting
                label="Show Command History"
                checked={settings.showCommandHistory}
                onChange={(checked) => updateSettings({ showCommandHistory: checked })}
              />
              <ToggleSetting
                label="Compact Mode"
                checked={settings.compactMode}
                onChange={(checked) => updateSettings({ compactMode: checked })}
              />
              <ToggleSetting
                label="Show Shortcuts"
                checked={settings.showShortcuts}
                onChange={(checked) => updateSettings({ showShortcuts: checked })}
              />
              <ToggleSetting
                label="Show Descriptions"
                checked={settings.showDescriptions}
                onChange={(checked) => updateSettings({ showDescriptions: checked })}
              />
              <ToggleSetting
                label="Show Icons"
                checked={settings.showIcons}
                onChange={(checked) => updateSettings({ showIcons: checked })}
              />
              <ToggleSetting
                label="Show Badges"
                checked={settings.showBadges}
                onChange={(checked) => updateSettings({ showBadges: checked })}
              />
            </div>
          </section>

          <section>
            <h3 className={`text-sm font-medium mb-2 ${isDark ? "text-white" : "text-black"}`}>Appearance</h3>
            <div className="space-y-3">
              <SelectSetting
                label="Animation Speed"
                value={settings.animationSpeed}
                options={[
                  { value: "slow", label: "Slow" },
                  { value: "normal", label: "Normal" },
                  { value: "fast", label: "Fast" },
                ]}
                onChange={(value) => updateSettings({ animationSpeed: value as "slow" | "normal" | "fast" })}
              />
              <SelectSetting
                label="Position"
                value={settings.position}
                options={[
                  { value: "top", label: "Top" },
                  { value: "center", label: "Center" },
                  { value: "bottom", label: "Bottom" },
                ]}
                onChange={(value) => updateSettings({ position: value as "top" | "center" | "bottom" })}
              />
              <SelectSetting
                label="Width"
                value={settings.width}
                options={[
                  { value: "narrow", label: "Narrow" },
                  { value: "normal", label: "Normal" },
                  { value: "wide", label: "Wide" },
                ]}
                onChange={(value) => updateSettings({ width: value as "narrow" | "normal" | "wide" })}
              />
            </div>
          </section>

          <section>
            <h3 className={`text-sm font-medium mb-2 ${isDark ? "text-white" : "text-black"}`}>Limits</h3>
            <div className="space-y-3">
              <RangeSetting
                label="Max Recent Searches"
                value={settings.maxRecentSearches}
                min={0}
                max={10}
                onChange={(value) => updateSettings({ maxRecentSearches: value })}
              />
              <RangeSetting
                label="Max Favorites"
                value={settings.maxFavorites}
                min={5}
                max={20}
                onChange={(value) => updateSettings({ maxFavorites: value })}
              />
              <RangeSetting
                label="Max Command History"
                value={settings.maxCommandHistory}
                min={0}
                max={20}
                onChange={(value) => updateSettings({ maxCommandHistory: value })}
              />
              <RangeSetting
                label="Search Delay (ms)"
                value={settings.searchDelay}
                min={0}
                max={500}
                step={50}
                onChange={(value) => updateSettings({ searchDelay: value })}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

interface ToggleSettingProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleSetting({ label, checked, onChange }: ToggleSettingProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="flex items-center justify-between">
      <label className={`text-sm ${isDark ? "text-[#ccc]" : "text-gray-700"}`}>{label}</label>
      <button
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
          checked ? (isDark ? "bg-blue-600" : "bg-blue-600") : isDark ? "bg-[#333]" : "bg-gray-200"
        }`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

interface SelectSettingProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

function SelectSetting({ label, value, options, onChange }: SelectSettingProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="flex items-center justify-between">
      <label className={`text-sm ${isDark ? "text-[#ccc]" : "text-gray-700"}`}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-md border px-2 py-1 text-sm ${
          isDark ? "bg-[#222] border-[#444] text-white" : "bg-white border-gray-200 text-black"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface RangeSettingProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

function RangeSetting({ label, value, min, max, step = 1, onChange }: RangeSettingProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className={`text-sm ${isDark ? "text-[#ccc]" : "text-gray-700"}`}>{label}</label>
        <span className={`text-sm ${isDark ? "text-[#999]" : "text-gray-500"}`}>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
