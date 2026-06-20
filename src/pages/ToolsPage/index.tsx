import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { solarToLunar } from '../../core/lunar';
import { LUNAR_MONTH_NAMES, LUNAR_DAY_NAMES } from '../../utils/constants';

function ToolsPage() {
  const { t } = useTranslation('tools');
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <span className="w-1 h-5 rounded-full accent-gradient" />
        {t('title')}
      </h2>
      <DateConverterTool />
      <DateDiffTool />
      <DateAddTool />
    </div>
  );
}

function DateConverterTool() {
  const [solarInput, setSolarInput] = useState('');
  const [result, setResult] = useState<string>('');

  const handleConvert = () => {
    try {
      const parts = solarInput.split('-').map(Number);
      if (parts.length !== 3) return;
      const [y, m, d] = parts as [number, number, number];
      const lunar = solarToLunar(y, m, d);
      const monthName = (lunar.isLeap ? '闰' : '') + LUNAR_MONTH_NAMES[lunar.month - 1] + '月';
      const dayName = LUNAR_DAY_NAMES[lunar.day - 1];
      setResult(`农历 ${lunar.year}年 ${monthName}${dayName}`);
    } catch (e) {
      setResult('日期格式错误，请使用 YYYY-MM-DD');
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
        公历转农历
      </h3>
      <div className="flex gap-2">
        <input
          type="date"
          value={solarInput}
          onChange={(e) => setSolarInput(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
        />
        <button
          onClick={handleConvert}
          className="px-4 py-2.5 accent-gradient text-white text-sm font-medium rounded-xl shadow-sm active:scale-95 transition-transform"
        >
          转换
        </button>
      </div>
      {result && (
        <p className="mt-3 text-sm text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20 px-3 py-2 rounded-lg font-medium">{result}</p>
      )}
    </div>
  );
}

function DateDiffTool() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [diff, setDiff] = useState<number | null>(null);

  const handleCalc = () => {
    if (!date1 || !date2) return;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffDays = Math.abs(Math.floor((d2.getTime() - d1.getTime()) / 86400000));
    setDiff(diffDays);
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
        </svg>
        日期差计算
      </h3>
      <div className="space-y-2">
        <input
          type="date"
          value={date1}
          onChange={(e) => setDate1(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
          placeholder="起始日期"
        />
        <input
          type="date"
          value={date2}
          onChange={(e) => setDate2(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
          placeholder="结束日期"
        />
        <button
          onClick={handleCalc}
          className="w-full px-4 py-2.5 accent-gradient text-white text-sm font-medium rounded-xl shadow-sm active:scale-[0.98] transition-transform"
        >
          计算
        </button>
      </div>
      {diff !== null && (
        <div className="mt-3 text-center py-3 bg-primary-50/50 dark:bg-primary-900/20 rounded-xl">
          <span className="text-sm text-secondary">相差</span>
          <span className="text-2xl font-bold accent-gradient-text mx-2">{diff}</span>
          <span className="text-sm text-secondary">天</span>
        </div>
      )}
    </div>
  );
}

function DateAddTool() {
  const [baseDate, setBaseDate] = useState('');
  const [addDays, setAddDays] = useState('');
  const [result, setResult] = useState('');

  const handleCalc = () => {
    if (!baseDate || !addDays) return;
    const d = new Date(baseDate);
    d.setDate(d.getDate() + parseInt(addDays, 10));
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    setResult(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${weekDays[d.getDay()]}`);
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        日期推算
      </h3>
      <div className="space-y-2">
        <input
          type="date"
          value={baseDate}
          onChange={(e) => setBaseDate(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
        />
        <div className="flex gap-2 items-center">
          <span className="text-sm text-secondary font-medium">加</span>
          <input
            type="number"
            value={addDays}
            onChange={(e) => setAddDays(e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm border border-theme rounded-xl bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 transition-all"
            placeholder="天数"
          />
          <span className="text-sm text-secondary font-medium">天</span>
        </div>
        <button
          onClick={handleCalc}
          className="w-full px-4 py-2.5 accent-gradient text-white text-sm font-medium rounded-xl shadow-sm active:scale-[0.98] transition-transform"
        >
          计算
        </button>
      </div>
      {result && (
        <p className="mt-3 text-sm text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20 px-3 py-2 rounded-lg font-medium text-center">
          {result}
        </p>
      )}
    </div>
  );
}

export default ToolsPage;
