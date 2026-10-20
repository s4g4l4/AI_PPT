import React, { useState, useEffect } from 'react';
import { AIProviderConfig, AIProviderType } from '../types/presentation';
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Star,
  Trash2,
} from 'lucide-react';

interface AISettingsViewProps {
  configs: AIProviderConfig[];
  onRefreshConfigs: () => Promise<void>;
  onSelectDefaultConfig: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const PROVIDER_META: Record<
  AIProviderType,
  {
    label: string;
    badge: string;
    defaultBaseUrl: string;
    keyPlaceholder: string;
    keyPrefixHint: string;
    models: { id: string; label: string }[];
  }
> = {
  gemini: {
    label: 'Google Gemini (3.5, 3.6 & 3.1)',
    badge: 'GEMINI',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com',
    keyPlaceholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyPrefixHint: 'Masukkan API Key Google Gemini Anda (format AIzaSy...)',
    models: [
      { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (Cepat & Seimbang)' },
      { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (Generasi Terbaru)' },
      { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite (Kuota Tinggi & Ringan)' },
      { id: 'gemini-3.5-pro', label: 'Gemini 3.5 Pro (Analisis Mendalam)' },
      { id: 'gemini-3.6-pro', label: 'Gemini 3.6 Pro (Penalaran Lanjut)' },
      { id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro (Akademik & Struktur)' },
    ],
  },
  nvidia: {
    label: 'NVIDIA NIM (Nemotron, Llama Vision, Cosmos & Riva)',
    badge: 'NVIDIA',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
    keyPlaceholder: 'nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyPrefixHint: 'Masukkan API Key NVIDIA NIM Anda (format nvapi-... dari build.nvidia.com)',
    models: [
      { id: 'nemotron-3-super-120b-a12b', label: 'nemotron-3-super-120b-a12b' },
      { id: 'nemotron-3-ultra-550b-a55b', label: 'nemotron-3-ultra-550b-a55b' },
      {
        id: 'nemotron-3-nano-omni-30b-a3b-reasoning',
        label: 'nemotron-3-nano-omni-30b-a3b-reasoning',
      },
      { id: 'llama-3.2-90b-vision-instruct', label: 'llama-3.2-90b-vision-instruct' },
      { id: 'llama-3.2-11b-vision-instruct', label: 'llama-3.2-11b-vision-instruct' },
      { id: 'nemotron-3.5-content-safety', label: 'nemotron-3.5-content-safety' },
      { id: 'ising-calibration-1-35b-a3b', label: 'ising-calibration-1-35b-a3b' },
      { id: 'llama-guard-4-12b', label: 'llama-guard-4-12b' },
      {
        id: 'llama-3.1-nemotron-safety-guard-8b-v3',
        label: 'llama-3.1-nemotron-safety-guard-8b-v3',
      },
      { id: 'synthetic-video-detector', label: 'synthetic-video-detector' },
      { id: 'magpie-tts-zeroshot', label: 'magpie-tts-zeroshot' },
      { id: 'Studio Voice', label: 'Studio Voice' },
      { id: 'cosmos3-nano-reasoner', label: 'cosmos3-nano-reasoner' },
      { id: 'cosmos3-nano', label: 'cosmos3-nano' },
      { id: 'Active Speaker Detection', label: 'Active Speaker Detection' },
      { id: 'Background Noise Removal', label: 'Background Noise Removal' },
      { id: 'nemotron-voicechat', label: 'nemotron-voicechat' },
      { id: 'streampetr', label: 'streampetr' },
      { id: 'bevformer', label: 'bevformer' },
      { id: 'sparsedrive', label: 'sparsedrive' },
      { id: '3D Body Pose', label: '3D Body Pose' },
      { id: 'cosmos-transfer2.5-2b', label: 'cosmos-transfer2.5-2b' },
      { id: 'ising-calibration-1.5-31b', label: 'ising-calibration-1.5-31b' },
      { id: 'Kumo Tabular', label: 'Kumo Tabular' },
      { id: 'muse-glimmer-30b', label: 'muse-glimmer-30b' },
      { id: 'nemotron-3-embed-1b', label: 'nemotron-3-embed-1b' },
      { id: 'nemotron-3.5-lightning-30b-a3b', label: 'nemotron-3.5-lightning-30b-a3b' },
      { id: 'nemotron-3.5-super-vl-120b-a12b', label: 'nemotron-3.5-super-vl-120b-a12b' },
      { id: 'riva-translate-4b-instruct-v2', label: 'riva-translate-4b-instruct-v2' },
    ],
  },
  huggingface: {
    label: 'Hugging Face (Hanya DeepSeek-V4.1-Flash & Llama-3.1-8B)',
    badge: 'HUGGING FACE',
    defaultBaseUrl: 'https://router.huggingface.co/v1',
    keyPlaceholder: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyPrefixHint: 'Masukkan Access Token Hugging Face Anda (format hf_... dari huggingface.co/settings/tokens)',
    models: [
      { id: 'deepseek-ai/DeepSeek-V4.1-Flash', label: 'deepseek-ai/DeepSeek-V4.1-Flash' },
      { id: 'meta-llama/Llama-3.1-8B-Instruct', label: 'meta-llama/Llama-3.1-8B-Instruct' },
    ],
  },
};

export const AISettingsView: React.FC<AISettingsViewProps> = ({
  configs,
  onRefreshConfigs,
  onSelectDefaultConfig,
  onNotify,
}) => {
  const [selectedConfigId, setSelectedConfigId] = useState<string>(
    configs.find((c) => c.isDefault)?.id || configs[0]?.id || ''
  );
  const [formState, setFormState] = useState<Partial<AIProviderConfig>>({
    name: 'Google Gemini',
    provider: 'gemini',
    baseUrl: PROVIDER_META.gemini.defaultBaseUrl,
    outlineModel: 'gemini-3.5-flash',
    slideModel: 'gemini-3.5-flash',
    rewriteModel: 'gemini-3.1-flash-lite',
    documentModel: 'gemini-3.5-flash',
    temperature: 0.7,
    topP: 0.95,
    isDefault: false,
  });

  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    latencyMs?: number;
    sampleResponse?: string;
  } | null>(null);

  useEffect(() => {
    const found = configs.find((c) => c.id === selectedConfigId);
    if (found) {
      setFormState({ ...found });
      setApiKeyInput('');
      setTestResult(null);
    } else if (configs.length > 0 && !selectedConfigId) {
      const initial = configs.find((c) => c.isDefault) || configs[0];
      setSelectedConfigId(initial.id);
    }
  }, [selectedConfigId, configs]);

  const currentProvider: AIProviderType =
    formState.provider === 'nvidia' || formState.provider === 'huggingface'
      ? formState.provider
      : 'gemini';

  const currentMeta = PROVIDER_META[currentProvider];

  const handleProviderChange = (provider: AIProviderType) => {
    const meta = PROVIDER_META[provider];
    const firstModel = meta.models[0].id;
    setFormState((prev) => ({
      ...prev,
      provider,
      name:
        provider === 'gemini'
          ? 'Google Gemini (3.5 / 3.6 / 3.1)'
          : provider === 'nvidia'
          ? 'NVIDIA NIM (Model Gratis)'
          : 'Hugging Face (Model Gratis)',
      baseUrl: meta.defaultBaseUrl,
      outlineModel: firstModel,
      slideModel: firstModel,
      rewriteModel: firstModel,
      documentModel: firstModel,
    }));
    setApiKeyInput('');
    setTestResult(null);
  };

  const handleSetAllTasksModel = (modelId: string) => {
    setFormState((prev) => ({
      ...prev,
      outlineModel: modelId,
      slideModel: modelId,
      rewriteModel: modelId,
      documentModel: modelId,
    }));
  };

  const handleSetDefaultProfile = async (cfg: AIProviderConfig, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSettingDefaultId(cfg.id);
    try {
      const response = await fetch('/api/ai/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cfg,
          isDefault: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengubah profil default.');
      }
      await onRefreshConfigs();
      onSelectDefaultConfig(cfg.id);
      if (formState.id === cfg.id) {
        setFormState((prev) => ({ ...prev, isDefault: true }));
      }
      onNotify(`"${cfg.name}" ditetapkan sebagai penyedia AI aktif (Default).`, 'success');
    } catch (err: any) {
      onNotify(err.message || 'Gagal mengatur default.', 'error');
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          provider: currentProvider,
          apiKeyInput: apiKeyInput.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setTestResult({
          ok: false,
          message: data.error || 'Pengujian koneksi ke penyedia AI gagal.',
          latencyMs: data.latencyMs,
        });
        onNotify(data.error || 'Tes koneksi gagal.', 'error');
      } else {
        setTestResult({
          ok: true,
          message: data.message,
          latencyMs: data.latencyMs,
          sampleResponse: data.sampleResponse,
        });
        setApiKeyInput('');
        onNotify(data.message, 'success');
        await onRefreshConfigs();
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err.message || 'Kesalahan jaringan saat menguji koneksi.',
      });
      onNotify('Kesalahan jaringan saat menguji koneksi.', 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!formState.name?.trim()) {
      onNotify('Nama konfigurasi wajib diisi.', 'error');
      return;
    }
    setSavingConfig(true);
    try {
      const response = await fetch('/api/ai/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          provider: currentProvider,
          apiKeyInput: apiKeyInput.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan konfigurasi AI.');
      }
      setApiKeyInput('');
      await onRefreshConfigs();
      if (data.config?.id) {
        setSelectedConfigId(data.config.id);
        if (data.config.isDefault) {
          onSelectDefaultConfig(data.config.id);
        }
      }
      onNotify(
        `Konfigurasi "${formState.name}" beserta API Key berhasil disimpan sesuai input Anda.`,
        'success'
      );
    } catch (err: any) {
      onNotify(err.message || 'Gagal menyimpan konfigurasi.', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (configs.length <= 1) {
      onNotify('Minimal satu konfigurasi AI harus dipertahankan.', 'error');
      return;
    }
    try {
      const response = await fetch(`/api/ai/configs/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus konfigurasi.');
      }
      await onRefreshConfigs();
      const remaining = data.configs || [];
      if (remaining.length > 0) {
        setSelectedConfigId(remaining[0].id);
      }
      onNotify('Profil konfigurasi AI berhasil dihapus.', 'info');
    } catch (err: any) {
      onNotify(err.message || 'Gagal menghapus konfigurasi.', 'error');
    }
  };

  const createNewConfigDraft = (providerType: AIProviderType) => {
    const meta = PROVIDER_META[providerType];
    const firstModel = meta.models[0].id;
    const newId = `cfg-${providerType}-${Date.now()}`;
    setSelectedConfigId('');
    setApiKeyInput('');
    setFormState({
      id: newId,
      name:
        providerType === 'gemini'
          ? 'Google Gemini (3.5 / 3.6 / 3.1)'
          : providerType === 'nvidia'
          ? 'NVIDIA NIM (Model Gratis)'
          : 'Hugging Face (Model Gratis)',
      provider: providerType,
      baseUrl: meta.defaultBaseUrl,
      outlineModel: firstModel,
      slideModel: firstModel,
      rewriteModel: firstModel,
      documentModel: firstModel,
      temperature: 0.6,
      topP: 0.95,
      isDefault: false,
    });
    setTestResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pengaturan API Key & Model AI (Gemini, NVIDIA & Hugging Face)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Hanya mendukung <strong>Google Gemini (3.5, 3.6, 3.1)</strong>,{' '}
            <strong>NVIDIA NIM (Gratis)</strong>, dan <strong>Hugging Face (Gratis)</strong>. Anda
            yang menentukan profil mana yang menjadi Default, dan API Key disimpan persis sesuai
            yang Anda isi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => createNewConfigDraft('gemini')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Gemini</span>
          </button>
          <button
            type="button"
            onClick={() => createNewConfigDraft('nvidia')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ NVIDIA (Gratis)</span>
          </button>
          <button
            type="button"
            onClick={() => createNewConfigDraft('huggingface')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Hugging Face (Gratis)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Saved Profiles List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Daftar Profil AI (Pilih Default Anda)
              </span>
            </div>

            <div className="space-y-2.5">
              {configs.map((cfg) => {
                const isSelected = cfg.id === formState.id;
                const badgeLabel =
                  cfg.provider === 'nvidia'
                    ? 'NVIDIA NIM (GRATIS)'
                    : cfg.provider === 'huggingface'
                    ? 'HUGGING FACE (GRATIS)'
                    : 'GEMINI (3.5 / 3.6 / 3.1)';
                return (
                  <div
                    key={cfg.id}
                    onClick={() => setSelectedConfigId(cfg.id)}
                    className={`p-3 rounded-md border cursor-pointer transition-colors space-y-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {cfg.name}
                      </span>
                      {cfg.isDefault ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>AKTIF (DEFAULT)</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleSetDefaultProfile(cfg, e)}
                          disabled={settingDefaultId === cfg.id}
                          className="px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800 rounded hover:bg-blue-50 dark:hover:bg-blue-950"
                        >
                          {settingDefaultId === cfg.id ? '...' : 'Jadikan Default'}
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span className="font-mono font-semibold">{badgeLabel}</span>
                      <span>
                        {cfg.hasSavedKey ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Key Tersimpan ({cfg.maskedKey || '••••'})
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">
                            Key Belum Diisi
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      Model: {cfg.outlineModel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Penyimpanan API Key Sesuai Input</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Setiap API Key yang Anda ketik pada kolom <strong>API Key</strong> disimpan terenkripsi
              (AES-256-GCM) langsung pada profil tersebut dan digunakan persis sesuai pilihan Anda
              tanpa diubah oleh sistem.
            </p>
          </div>
        </div>

        {/* Right Column: Configuration Form (8 cols) */}
        <div className="lg:col-span-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Konfigurasi Penyedia AI, API Key & Model
              </h3>
            </div>
            {formState.id && configs.some((c) => c.id === formState.id) && (
              <button
                type="button"
                onClick={() => handleDeleteConfig(formState.id!)}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Profil</span>
              </button>
            )}
          </div>

          {/* Provider Selector (Only Gemini, NVIDIA, Hugging Face) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pilih Penyedia AI (Hanya Gemini, NVIDIA, atau Hugging Face)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {(['gemini', 'nvidia', 'huggingface'] as AIProviderType[]).map((prov) => {
                const active = currentProvider === prov;
                return (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => handleProviderChange(prov)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      active
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase font-mono">
                      {PROVIDER_META[prov].badge}
                    </div>
                    <div className="text-[11px] mt-0.5 font-medium">
                      {PROVIDER_META[prov].label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Profil Konfigurasi
              </label>
              <input
                type="text"
                value={formState.name || ''}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="Nama profil..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Base URL Endpoint
              </label>
              <input
                type="text"
                value={formState.baseUrl || currentMeta.defaultBaseUrl}
                onChange={(e) => setFormState({ ...formState, baseUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Direct API Key Input for ALL 3 Providers */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                API Key untuk {currentMeta.badge} (Disimpan Sesuai yang Anda Isi)
              </label>
              {formState.hasSavedKey && formState.maskedKey && (
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  API Key Tersimpan: {formState.maskedKey}
                </span>
              )}
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={
                  formState.hasSavedKey
                    ? `API Key sudah tersimpan (${formState.maskedKey}). Ketik di sini jika ingin mengganti dengan API Key baru...`
                    : currentMeta.keyPlaceholder
                }
                autoComplete="off"
                className="w-full pl-9 pr-10 py-2.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowApiKey((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title={showApiKey ? 'Sembunyikan API Key' : 'Tampilkan API Key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-[11px] text-slate-500">{currentMeta.keyPrefixHint}</div>
          </div>

          {/* Model Selection Section */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Pilihan Model {currentMeta.badge}
                </div>
                <div className="text-[11px] text-slate-500">
                  {currentProvider === 'gemini'
                    ? 'Tersedia seri Gemini 3.5, Gemini 3.6, dan Gemini 3.1'
                    : currentProvider === 'nvidia'
                    ? 'Daftar model gratis (Free Tier) di NVIDIA NIM'
                    : 'Daftar model gratis (Free Serverless Inference) di Hugging Face'}
                </div>
              </div>

              {/* Quick apply model to all 4 tasks */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Terapkan ke Semua Tugas:
                </span>
                <select
                  value={formState.outlineModel || currentMeta.models[0].id}
                  onChange={(e) => handleSetAllTasksModel(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-mono border border-blue-300 dark:border-blue-800 rounded bg-blue-50/50 dark:bg-blue-950/40 text-slate-900 dark:text-white"
                >
                  {currentMeta.models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} — {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: 'outlineModel',
                  label: '1. Model Pembuat Outline',
                  desc: 'Merancang struktur & alur slide presentasi',
                },
                {
                  key: 'slideModel',
                  label: '2. Model Pembuat Isi Slide',
                  desc: 'Menyusun poin, tabel, grafik, linimasa & catatan',
                },
                {
                  key: 'rewriteModel',
                  label: '3. Model Penulis Ulang (AI Tools)',
                  desc: 'Meringkas, memperluas, dan menerjemahkan slide',
                },
                {
                  key: 'documentModel',
                  label: '4. Model Analisis Dokumen & Gaya Visual',
                  desc: 'Mengekstrak PDF/DOCX/PPTX & Visual Style Reference',
                },
              ].map((task) => (
                <div
                  key={task.key}
                  className="p-3 border border-slate-200 dark:border-slate-800 rounded-md space-y-2 bg-slate-50/40 dark:bg-slate-950/40"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {task.label}
                    </div>
                    <div className="text-[11px] text-slate-500">{task.desc}</div>
                  </div>
                  <select
                    value={(formState as any)[task.key] || currentMeta.models[0].id}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        [task.key]: e.target.value,
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {currentMeta.models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} ({m.label})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={(formState as any)[task.key] || ''}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        [task.key]: e.target.value,
                      })
                    }
                    placeholder="Atau ketik ID model secara manual..."
                    className="w-full px-2.5 py-1 text-[11px] font-mono border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Generation Parameters & User-Chosen Default Checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 tabular-nums">
                Temperature ({formState.temperature ?? 0.6})
              </label>
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.1}
                value={formState.temperature ?? 0.6}
                onChange={(e) =>
                  setFormState({ ...formState, temperature: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 tabular-nums">
                Top-P ({formState.topP ?? 0.95})
              </label>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={formState.topP ?? 0.95}
                onChange={(e) => setFormState({ ...formState, topP: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex items-center pt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formState.isDefault)}
                  onChange={(e) => setFormState({ ...formState, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                <span>Jadikan Profil Ini Sebagai Default Pilihan Saya</span>
              </label>
            </div>
          </div>

          {/* Connection Test Output Banner */}
          {testResult && (
            <div
              className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
                testResult.ok
                  ? 'border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-red-300 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold">{testResult.message}</div>
                {testResult.sampleResponse && (
                  <div className="font-mono text-[11px] opacity-80">
                    Respons Verifikasi Server: &quot;{testResult.sampleResponse}&quot;
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Menguji Koneksi & Menyimpan Key...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>Tes Koneksi Nyata</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {savingConfig ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan API Key & Konfigurasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
