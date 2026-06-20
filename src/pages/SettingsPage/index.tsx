import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores/settings-store';
import type { AppSettings } from '../../core/types';

function SettingsPage() {
  const settings = useSettingsStore();
  const { updateSettings } = settings;
  const { t, i18n } = useTranslation(['settings', 'common']);
  const currentLang = i18n.language as 'zh-CN' | 'en';

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <span className="w-1 h-5 rounded-full accent-gradient" />
        {t('settings:title')}
      </h2>

      {/* 涓婚�璁剧疆 */}
      <Section title={t('settings:section.appearance')}>
        <SettingRow label={t('settings:theme.label')}>
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as AppSettings['theme'] })}
            className="px-3 py-1.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
          >
            <option value="auto">{t('settings:theme.auto')}</option>
            <option value="system">{t('settings:theme.system')}</option>
            <option value="light">{t('settings:theme.light')}</option>
            <option value="dark">{t('settings:theme.dark')}</option>
          </select>
        </SettingRow>

        <SettingRow label={t('settings:uiTheme.label')}>
          <div className="flex gap-2 flex-wrap">
            <ThemeCard
              active={settings.uiTheme === 'classic'}
              onClick={() => updateSettings({ uiTheme: 'classic' })}
              label={t('settings:uiTheme.classic')}
              preview={
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 p-1.5">
                  <div className="w-full h-1.5 rounded bg-white shadow-sm mb-1" />
                  <div className="grid grid-cols-3 gap-0.5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-1.5 rounded bg-white/80" />
                    ))}
                  </div>
                </div>
              }
            />
            <ThemeCard
              active={settings.uiTheme === 'ios'}
              onClick={() => updateSettings({ uiTheme: 'ios' })}
              label={t('settings:uiTheme.ios')}
              preview={
                <div className="w-full h-full rounded-lg p-1.5 relative overflow-hidden" style={{
                  background: 'linear-gradient(135deg, #d6e4ff 0%, #ead4ff 50%, #ffd6f0 100%)',
                }}>
                  <div className="absolute top-1 left-1.5 right-1.5 h-1.5 rounded-sm bg-white/55 backdrop-blur-sm border border-white/60" />
                  <div className="absolute top-3 left-1.5 right-1.5 bottom-1 rounded-sm bg-white/45 backdrop-blur-sm border border-white/55" />
                </div>
              }
            />
            <ThemeCard
              active={settings.uiTheme === 'google'}
              onClick={() => updateSettings({ uiTheme: 'google' })}
              label={t('settings:uiTheme.google')}
              preview={
                <div className="w-full h-full rounded-lg p-1.5 relative overflow-hidden" style={{
                  background: '#f8f9fa',
                  backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(26,115,232,0.18) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(52,168,83,0.18) 0%, transparent 40%)',
                }}>
                  <div className="w-full h-1.5 rounded-full bg-white shadow-sm mb-1" />
                  <div className="grid grid-cols-4 gap-0.5">
                    {['#4285F4', '#EA4335', '#FBBC04', '#34A853'].map((c, i) => (
                      <div key={i} className="h-1.5 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              }
            />
            <ThemeCard
              active={settings.uiTheme === 'island'}
              onClick={() => updateSettings({ uiTheme: 'island' })}
              label={t('settings:uiTheme.island')}
              preview={
                <div className="w-full h-full rounded-lg p-1.5 relative overflow-hidden" style={{
                  background: 'linear-gradient(180deg, #bae6fd 0%, #e0f2fe 40%, #fef3c7 100%)',
                }}>
                  <div className="absolute top-1 left-1.5 right-1.5 h-1.5 rounded-sm bg-white/80 shadow-sm" />
                  <div className="absolute top-3 left-1.5 right-1.5 bottom-1 rounded-sm bg-white/70 shadow-sm" />
                  <div className="absolute bottom-0.5 left-0 right-0 h-2 opacity-60" style={{
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(6,182,212,0.5) 0%, transparent 70%)',
                  }} />
                </div>
              }
            />
            <ThemeCard
              active={settings.uiTheme === 'taiji'}
              onClick={() => updateSettings({ uiTheme: 'taiji' })}
              label={t('settings:uiTheme.taiji')}
              preview={
                <div className="w-full h-full rounded-lg p-1.5 relative overflow-hidden" style={{
                  background: 'radial-gradient(ellipse at 50% 0%, #f5f0e6 0%, #ebe4d3 100%)',
                }}>
                  <div className="absolute top-1 left-1.5 right-1.5 h-1.5 rounded-sm bg-[#fdfaf2] border border-[#d8cfb8]" />
                  <div className="absolute top-3 left-1.5 right-1.5 bottom-1 rounded-sm bg-[#fdfaf2] border border-[#d8cfb8] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <circle cx="12" cy="12" r="9" fill="#1a1a1a" />
                      <path d="M12 3 A9 9 0 0 1 12 21 A4.5 4.5 0 0 0 12 12 A4.5 4.5 0 0 1 12 3 Z" fill="#fdfaf2" />
                      <circle cx="12" cy="7.5" r="1.4" fill="#1a1a1a" />
                      <circle cx="12" cy="16.5" r="1.4" fill="#fdfaf2" />
                    </svg>
                  </div>
                </div>
              }
            />
            <ThemeCard
              active={settings.uiTheme === 'buddhist'}
              onClick={() => updateSettings({ uiTheme: 'buddhist' })}
              label={t('settings:uiTheme.buddhist')}
              preview={
                <div className="w-full h-full rounded-lg p-1.5 relative overflow-hidden" style={{
                  background: 'radial-gradient(ellipse at 50% -10%, #f8e8a8 0%, #faf3e0 40%, #f0e4c3 100%)',
                }}>
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.7) 0%, transparent 70%)',
                  }} />
                  <div className="absolute top-1 left-1.5 right-1.5 h-1.5 rounded-sm bg-[#fffbf0] border border-[#d9b878]" />
                  <div className="absolute top-3 left-1.5 right-1.5 bottom-1 rounded-sm bg-[#fffbf0] border border-[#d9b878] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M3 17 Q5 19 7 17 Q9 19 12 17 Q15 19 17 17 Q19 19 21 17 L21 19 L3 19 Z" fill="#c1272d" opacity="0.85" />
                      <g fill="#b8860b" transform="translate(12 11)">
                        <path d="M-3 -3 L-3 -1 L-1 -1 L-1 1 L1 1 L1 -1 L3 -1 L3 -3 L1 -3 L1 -5 L-1 -5 L-1 -3 Z" />
                        <rect x="-0.6" y="-0.6" width="1.2" height="1.2" />
                      </g>
                    </svg>
                  </div>
                </div>
              }
            />
          </div>
        </SettingRow>

        <SettingRow label={t('settings:fontSize.label')}>
          <select
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: e.target.value as AppSettings['fontSize'] })}
            className="px-3 py-1.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
          >
            <option value="sm">{t('settings:fontSize.sm')}</option>
            <option value="md">{t('settings:fontSize.md')}</option>
            <option value="lg">{t('settings:fontSize.lg')}</option>
          </select>
        </SettingRow>

        {/* 璇�█閫夋嫨 */}
        <SettingRow label={t('settings:language.label')}>
          <div className="flex gap-1.5 p-0.5 bg-secondary/40 rounded-xl">
            <LangButton
              active={settings.language === 'auto'}
              onClick={() => updateSettings({ language: 'auto' })}
              label={t('settings:language.auto')}
            />
            <LangButton
              active={settings.language === 'zh-CN' || (settings.language === 'auto' && currentLang === 'zh-CN')}
              onClick={() => updateSettings({ language: 'zh-CN' })}
              label="中"
            />
            <LangButton
              active={settings.language === 'en' || (settings.language === 'auto' && currentLang === 'en')}
              onClick={() => updateSettings({ language: 'en' })}
              label="EN"
            />
          </div>
        </SettingRow>
      </Section>

      {/* 鏃ュ巻璁剧疆 */}
      <Section title={t('settings:section.calendar')}>
        <SettingRow label={t('settings:weekStart.label')}>
          <select
            value={settings.weekStart}
            onChange={(e) => updateSettings({ weekStart: Number(e.target.value) as 0 | 1 })}
            className="px-3 py-1.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
          >
            <option value={1}>{t('settings:weekStart.mon')}</option>
            <option value={0}>{t('settings:weekStart.sun')}</option>
          </select>
        </SettingRow>
        <SettingRow label={t('settings:zodiacMode.label')}>
          <select
            value={settings.zodiacMode}
            onChange={(e) => updateSettings({ zodiacMode: e.target.value as AppSettings['zodiacMode'] })}
            className="px-3 py-1.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
          >
            <option value="newyear">{t('settings:zodiacMode.newyear')}</option>
            <option value="spring">{t('settings:zodiacMode.spring')}</option>
          </select>
        </SettingRow>
      </Section>

      {/* 鏁版嵁绠＄悊 */}
      <Section title={t('settings:section.data')}>
        <SettingRow label={t('settings:data.export')}>
          <button className="px-3 py-1.5 text-sm accent-gradient text-white rounded-xl shadow-sm active:scale-95 transition-transform">
            {t('common:action.export')}
          </button>
        </SettingRow>
        <SettingRow label={t('settings:data.import')}>
          <button className="px-3 py-1.5 text-sm bg-secondary/60 text-secondary rounded-xl active:scale-95 transition-transform">
            {t('common:action.import')}
          </button>
        </SettingRow>
      </Section>

      {/* 鍏充簬 */}
      <Section title={t('settings:section.about')}>
        <SettingRow label={t('settings:about.version')}>
          <span className="text-sm text-tertiary">v1.0.0</span>
        </SettingRow>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden">
      <h3 className="px-4 pt-3 pb-1.5 text-xxs text-tertiary font-medium uppercase tracking-wider">{title}</h3>
      <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

function LangButton({
  active, onClick, label,
}: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
        active
          ? 'bg-card text-primary-500 shadow-sm font-medium'
          : 'text-secondary active:scale-95'
      }`}
    >
      {label}
    </button>
  );
}

function ThemeCard({
  active, onClick, label, preview,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  preview: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
        active
          ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-bg-card'
          : 'hover:bg-secondary/40'
      }`}
    >
      <div className="w-16 h-12 rounded-xl overflow-hidden">
        {preview}
      </div>
      <span className={`text-xxs ${active ? 'text-primary-500 font-semibold' : 'text-tertiary'}`}>
        {label}
      </span>
    </button>
  );
}

export default SettingsPage;
