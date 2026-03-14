import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutTemplate, 
  Send, 
  Users, 
  Settings, 
  Sparkles, 
  ChevronRight, 
  Pencil, 
  Plus,
  Monitor,
  Smartphone,
  Palette,
  Type,
  Layout,
  ChevronLeft,
  Grid,
  Repeat,
  Columns,
  Layers,
  Upload,
  FileText,
  Search,
  Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRESET_TEMPLATES } from './templates';
import { EmailTemplate, Recipient, DesignSettings, DEFAULT_DESIGN_SETTINGS, Campaign } from './types';
import { generateEmailTemplate, restyleEmailTemplate } from './services/geminiService';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

type ViewType = 'dashboard' | 'studio' | 'review' | 'audience' | 'ai-gen';

// Sub-components moved outside to avoid re-creation on render
const DashboardView: React.FC<{ 
  campaigns: Campaign[], 
  setActiveView: (view: ViewType) => void 
}> = ({ campaigns, setActiveView }) => (
  <div className="max-w-6xl mx-auto py-12 px-6">
    <div className="flex items-center justify-between mb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Dashboard</h1>
        <p className="text-slate-500">Manage your email campaigns and performance.</p>
      </div>
      <button 
        onClick={() => setActiveView('studio')}
        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
      >
        <Plus size={20} />
        New Campaign
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 mb-4">
          <Send size={24} />
        </div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Total Sent</p>
        <h3 className="text-3xl font-black text-slate-900">12,450</h3>
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 mb-4">
          <Users size={24} />
        </div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Subscribers</p>
        <h3 className="text-3xl font-black text-slate-900">5,280</h3>
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 mb-4">
          <Sparkles size={24} />
        </div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Avg. Open Rate</p>
        <h3 className="text-3xl font-black text-slate-900">24.8%</h3>
      </div>
    </div>

    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">Recent Campaigns</h3>
        <button className="text-slate-400 hover:text-slate-900 transition-colors">View All</button>
      </div>
      <div className="divide-y divide-slate-100">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <LayoutTemplate size={24} />
              </div>
              <div>
                <h4 className="font-black text-slate-900">{campaign.name}</h4>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  {campaign.createdAt} • {campaign.recipientsCount} Recipients
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                campaign.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {campaign.status}
              </span>
              <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <ChevronRight size={20} className="text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StudioView: React.FC<{ 
  onSelectTemplate: (template: EmailTemplate) => void,
  onBlankCanvas: (layout?: string) => void
}> = ({ onSelectTemplate, onBlankCanvas }) => (
  <div className="max-w-6xl mx-auto py-12 px-6">
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Email Studio</h1>
      <p className="text-slate-500 text-lg">Select a pre-designed template or a layout to start your campaign.</p>
    </div>

    <section className="mb-16">
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
        <Layout size={16} />
        Smart Layouts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 'mosaic', name: 'Mosaic Grid', icon: Grid, desc: 'Tiled image gallery' },
          { id: 'alternating', name: 'Alternating', icon: Repeat, desc: 'Zig-zag content' },
          { id: 'triple-column', name: 'Triple Column', icon: Columns, desc: '3-column features' },
          { id: 'card-deck', name: 'Card Deck', icon: Layers, desc: 'Shadowed cards' },
        ].map((layout) => (
          <motion.div
            key={layout.id}
            whileHover={{ y: -5 }}
            onClick={() => onBlankCanvas(layout.id)}
            className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <layout.icon size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">{layout.name}</h3>
            <p className="text-slate-500 text-sm">{layout.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
        <LayoutTemplate size={16} />
        Premium Templates
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRESET_TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={template.thumbnail} 
                alt={template.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2">
                  <Pencil size={18} />
                  Customize
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {template.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-900 mb-2">{template.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2">{template.preheader}</p>
            </div>
          </motion.div>
        ))}

        <motion.div
          whileHover={{ y: -8 }}
          onClick={() => onBlankCanvas()}
          className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center group hover:border-slate-400 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors mb-4">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Blank Canvas</h3>
          <p className="text-slate-500 text-sm">Start from scratch and build your own design.</p>
        </motion.div>
      </div>
    </section>
  </div>
);

const AIGenerationView: React.FC<{
  onGenerate: (prompt: string, layout?: string, styleReference?: string) => Promise<void>,
  onRestyle: (html: string) => Promise<void>,
  isGenerating: boolean,
  onCancel: () => void,
  initialLayout?: string
}> = ({ onGenerate, onRestyle, isGenerating, onCancel, initialLayout }) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'generate' | 'restyle'>('generate');
  const [uploadedHtml, setUploadedHtml] = useState('');
  const [styleReferenceHtml, setStyleReferenceHtml] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'generate' && prompt.trim()) {
      onGenerate(prompt, initialLayout, styleReferenceHtml);
    } else if (mode === 'restyle' && uploadedHtml.trim()) {
      onRestyle(uploadedHtml);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'restyle' | 'reference') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (target === 'restyle') setUploadedHtml(content);
        else setStyleReferenceHtml(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-24 px-6">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
          <Sparkles size={40} className={isGenerating ? 'animate-pulse' : ''} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">AI Email Engine</h1>
        <p className="text-slate-500 text-xl">
          {initialLayout ? `Generating a ${initialLayout} layout.` : 'Describe your email or upload a template to restyle.'}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-2xl flex">
          <button 
            onClick={() => setMode('generate')}
            className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === 'generate' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            Generate
          </button>
          <button 
            onClick={() => setMode('restyle')}
            className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === 'restyle' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            Upload & Style
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'generate' ? (
          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={initialLayout ? `Describe the content for your ${initialLayout} email...` : "e.g., A modern welcome email for a luxury travel agency..."}
                className="w-full h-48 bg-white border-2 border-slate-200 rounded-[2rem] p-8 text-lg outline-none focus:border-slate-900 transition-all shadow-sm resize-none"
                disabled={isGenerating}
              />
            </div>

            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center group hover:border-slate-900 transition-all relative">
              <input 
                type="file" 
                accept=".html,.txt" 
                onChange={(e) => handleFileUpload(e, 'reference')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-slate-900">
                    {styleReferenceHtml ? 'Style Reference Loaded' : 'Add Style Reference (Optional)'}
                  </h4>
                  <p className="text-xs text-slate-500">Upload a template to replicate its style very closely.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition-colors"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center group hover:border-slate-900 transition-all relative">
              <input 
                type="file" 
                accept=".html,.txt" 
                onChange={(e) => handleFileUpload(e, 'restyle')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-slate-900 transition-colors">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {uploadedHtml ? 'Template Uploaded' : 'Upload Email Template'}
              </h3>
              <p className="text-slate-500 text-sm">
                {uploadedHtml ? 'Click to change file' : 'Drag and drop your HTML file here'}
              </p>
            </div>

            {uploadedHtml && (
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-black">Ready to Restyle</h4>
                    <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Applying Oratora Brand Style</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all"
                >
                  {isGenerating ? 'Restyling...' : 'Restyle Now'}
                </button>
              </div>
            )}
          </div>
        )}
      </form>

      {mode === 'generate' && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setPrompt("A professional newsletter for a tech startup announcing a new feature release.")}
            className="p-6 bg-white border border-slate-200 rounded-2xl text-left hover:border-slate-900 transition-all group"
          >
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-900">Example</p>
            <p className="text-slate-600 font-medium">Tech Startup Newsletter</p>
          </button>
          <button 
            onClick={() => setPrompt("A minimalist event invitation for a gallery opening with a focus on elegant typography.")}
            className="p-6 bg-white border border-slate-200 rounded-2xl text-left hover:border-slate-900 transition-all group"
          >
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-900">Example</p>
            <p className="text-slate-600 font-medium">Gallery Opening Invite</p>
          </button>
        </div>
      )}
    </div>
  );
};

const AudienceView: React.FC<{
  recipients: Recipient[],
  setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>
}> = ({ recipients, setRecipients }) => {
  const [isUploading, setIsUploading] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const processData = (data: Record<string, unknown>[]) => {
    let validCount = 0;
    let invalidCount = 0;

    const newRecipients = data.map((row) => {
      const email = String(row.email || row.Email || '').trim();
      const name = String(row.name || row.Name || row.first_name || '').trim();
      
      if (email && validateEmail(email)) {
        validCount++;
        return {
          email,
          name,
          ...row
        } as Recipient;
      } else {
        if (email) invalidCount++;
        return null;
      }
    }).filter((r): r is Recipient => r !== null);

    if (newRecipients.length > 0) {
      setRecipients(prev => {
        // Avoid duplicates by email
        const existingEmails = new Set(prev.map(r => r.email.toLowerCase()));
        const uniqueNew = newRecipients.filter(r => !existingEmails.has(r.email.toLowerCase()));
        return [...prev, ...uniqueNew];
      });
      alert(`Import complete! ${validCount} recipients processed.${invalidCount > 0 ? ` ${invalidCount} invalid emails skipped.` : ''}`);
    } else if (invalidCount > 0) {
      alert(`Import failed. All ${invalidCount} emails found were invalid.`);
    } else {
      alert("No recipients found in the file.");
    }
    setIsUploading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processData(results.data as Record<string, unknown>[]);
        },
        error: (error) => {
          console.error("CSV Parsing Error:", error);
          alert("Failed to parse CSV. Please check the file format.");
          setIsUploading(false);
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];
          processData(data);
        } catch (error) {
          console.error("Excel Parsing Error:", error);
          alert("Failed to parse Excel file. Please check the file format.");
          setIsUploading(false);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file format. Please upload a CSV or Excel file.");
      setIsUploading(false);
    }
    
    // Reset input value to allow re-uploading the same file
    e.target.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Audience</h1>
          <p className="text-slate-500">Manage your subscribers and import new contacts.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <button className="bg-white border-2 border-slate-200 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:border-slate-900 transition-all">
              <Upload size={18} />
              {isUploading ? 'Importing...' : 'Import CSV/Excel'}
            </button>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={18} />
            Add Subscriber
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">All Contacts ({recipients.length})</h3>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contacts..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Name</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recipients.map((recipient, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs">
                        {recipient.name?.charAt(0) || recipient.email.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{recipient.name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-slate-500 text-sm">{recipient.email}</td>
                  <td className="px-8 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors">
                      <Settings size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ReviewView: React.FC<{
  selectedTemplate: EmailTemplate | null,
  setActiveView: (view: ViewType) => void,
  previewMode: 'desktop' | 'mobile',
  setPreviewMode: (mode: 'desktop' | 'mobile') => void,
  designSettings: DesignSettings,
  setDesignSettings: (settings: DesignSettings) => void,
  processedHtml: string,
  editingImage: { id: string, src: string } | null,
  setEditingImage: (val: { id: string, src: string } | null) => void,
  onUpdateImage: (newSrc: string) => void,
  onLaunchCampaign: () => void,
  isLaunching: boolean
}> = ({ 
  selectedTemplate, 
  setActiveView, 
  previewMode, 
  setPreviewMode, 
  designSettings, 
  setDesignSettings, 
  processedHtml,
  editingImage,
  setEditingImage,
  onUpdateImage,
  onLaunchCampaign,
  isLaunching
}) => {
  const [newUrl, setNewUrl] = useState(editingImage?.src || '');

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col relative">
      <AnimatePresence>
        {editingImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6"
          >
            <motion.div 
              key={editingImage.id}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit Image</h3>
                <button onClick={() => setEditingImage(null)} className="text-slate-400 hover:text-slate-900">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 mb-6 bg-slate-50">
                <img src={newUrl || editingImage.src} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Image URL</label>
                  <input 
                    type="text" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setEditingImage(null)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => onUpdateImage(newUrl)}
                    className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
                  >
                    Update Image
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveView('studio')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedTemplate?.name}</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Design Lab</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-slate-100 p-1 rounded-xl flex">
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            <Monitor size={18} />
          </button>
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            <Smartphone size={18} />
          </button>
        </div>
        <button 
          onClick={onLaunchCampaign}
          disabled={isLaunching}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLaunching ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {isLaunching ? 'Launching...' : 'Launch Campaign'}
        </button>
      </div>
    </div>

    <div className="flex-1 flex overflow-hidden">
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar p-6 space-y-8">
        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Type size={14} />
            Content
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Subject Line</label>
              <input 
                type="text" 
                defaultValue={selectedTemplate?.subject}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Preheader</label>
              <textarea 
                defaultValue={selectedTemplate?.preheader}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-900 transition-all h-20 resize-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={14} />
            Sender Info
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sender Name</label>
              <input 
                type="text" 
                value={designSettings.senderName}
                onChange={(e) => setDesignSettings({...designSettings, senderName: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sender Email</label>
              <input 
                type="email" 
                value={designSettings.senderEmail}
                onChange={(e) => setDesignSettings({...designSettings, senderEmail: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-900 transition-all"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Palette size={14} />
            Theme Settings
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={designSettings.primaryColor} onChange={(e) => setDesignSettings({...designSettings, primaryColor: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer" />
                <span className="text-xs font-mono text-slate-500 uppercase">{designSettings.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={designSettings.backgroundColor} onChange={(e) => setDesignSettings({...designSettings, backgroundColor: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer" />
                <span className="text-xs font-mono text-slate-500 uppercase">{designSettings.backgroundColor}</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Custom Font</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Font Family Name"
                    value={designSettings.customFont?.name || ''}
                    onChange={(e) => setDesignSettings({
                      ...designSettings, 
                      customFont: designSettings.customFont ? { ...designSettings.customFont, name: e.target.value } : { name: e.target.value, data: '', format: 'truetype' }
                    })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-slate-900 transition-all"
                  />
                  <label className="bg-slate-900 text-white p-2 rounded-xl cursor-pointer hover:scale-105 transition-all">
                    <Upload size={14} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".ttf,.woff,.woff2,.otf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const data = event.target?.result as string;
                            const format = file.name.endsWith('.woff') ? 'woff' : 
                                           file.name.endsWith('.woff2') ? 'woff2' : 
                                           file.name.endsWith('.otf') ? 'opentype' : 'truetype';
                            setDesignSettings({
                              ...designSettings,
                              customFont: {
                                name: designSettings.customFont?.name || file.name.split('.')[0],
                                data,
                                format
                              }
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {designSettings.customFont && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[120px]">
                      {designSettings.customFont.name} active
                    </span>
                    <button 
                      onClick={() => setDesignSettings({ ...designSettings, customFont: undefined })}
                      className="text-emerald-700 hover:text-emerald-900"
                    >
                      <Plus size={12} className="rotate-45" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Image size={14} />
            Image Assets
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=200',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200',
                'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=200',
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=200'
              ].map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-200 group relative cursor-pointer">
                  <img src={url} alt="Asset" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => alert("Copy this URL to use in your template: " + url)}
                      className="bg-white text-slate-900 p-2 rounded-lg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Paste image URL..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-slate-900 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Layout size={14} />
            Structure
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left text-sm font-bold flex items-center justify-between group hover:border-slate-900 transition-all">
              Edit HTML Directly
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>
            <button className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left text-sm font-bold flex items-center justify-between group hover:border-slate-900 transition-all">
              Manage Assets
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>
          </div>
        </section>
      </div>

      <div className="flex-1 bg-slate-100 overflow-y-auto p-12 flex flex-col items-center">
        <div className="mb-6 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} />
          Canvas Mode Active: Click text or images to edit directly
        </div>
        <div 
          className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden rounded-[2rem] ${previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[800px]'}`}
          style={{ height: 'fit-content', minHeight: '100%' }}
        >
          <iframe 
            srcDoc={processedHtml}
            className="w-full h-full border-none"
            title="Email Preview"
            style={{ minHeight: '800px' }}
          />
        </div>
      </div>
    </div>
  </div>
);
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: 'john@example.com', name: 'John Doe' },
    { email: 'jane@example.com', name: 'Jane Smith' },
  ]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: 'Spring Launch', templateId: 'elite-invite', status: 'draft', createdAt: '2026-03-10', recipientsCount: 150 },
    { id: '2', name: 'Workshop Reminder', templateId: 'workshop-series', status: 'sent', createdAt: '2026-03-05', recipientsCount: 45 },
  ]);
  const [designSettings, setDesignSettings] = useState<DesignSettings>(DEFAULT_DESIGN_SETTINGS);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<string | undefined>(undefined);
  const [editingImage, setEditingImage] = useState<{ id: string, src: string } | null>(null);

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setActiveView('review');
  };

  const handleGenerateAI = async (prompt: string, layout?: string, styleReference?: string) => {
    setIsGenerating(true);
    try {
      const html = await generateEmailTemplate(prompt, layout, styleReference);
      const newTemplate: EmailTemplate = {
        id: `ai-${Date.now()}`,
        name: layout ? `${layout.charAt(0).toUpperCase() + layout.slice(1)} Design` : 'AI Generated Design',
        subject: 'Your AI Generated Email',
        htmlContent: html,
        category: 'AI Generated',
        preheader: 'Custom design generated by Oratora AI',
        layoutType: layout as 'mosaic' | 'alternating' | 'triple-column' | 'card-deck' | 'standard'
      };
      setSelectedTemplate(newTemplate);
      setActiveView('review');
    } catch (error) {
      console.error("Failed to generate template:", error);
      alert("Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestyleAI = async (html: string) => {
    setIsGenerating(true);
    try {
      const restyledHtml = await restyleEmailTemplate(html);
      const newTemplate: EmailTemplate = {
        id: `restyle-${Date.now()}`,
        name: 'Restyled Template',
        subject: 'Your Restyled Email',
        htmlContent: restyledHtml,
        category: 'Restyled',
        preheader: 'Template restyled to Oratora Brand'
      };
      setSelectedTemplate(newTemplate);
      setActiveView('review');
    } catch (error) {
      console.error("Failed to restyle template:", error);
      alert("Something went wrong during restyling. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBlankCanvas = (layout?: string) => {
    setSelectedLayout(layout);
    setActiveView('ai-gen');
  };

  const processedHtml = useMemo(() => {
    if (!selectedTemplate) return '';
    let html = selectedTemplate.htmlContent;
    
    // Inject custom font if present
    if (designSettings.customFont) {
      const fontFace = `
        <style>
          @font-face {
            font-family: '${designSettings.customFont.name}';
            src: url('${designSettings.customFont.data}') format('${designSettings.customFont.format}');
            font-weight: normal;
            font-style: normal;
          }
          body, p, h1, h2, h3, h4, h5, h6, span, a, td {
            font-family: '${designSettings.customFont.name}', ${designSettings.fontFamily} !important;
          }
        </style>
      `;
      html = html.replace('</head>', `${fontFace}</head>`);
    } else {
      // Inject standard font family
      const fontStyle = `
        <style>
          body, p, h1, h2, h3, h4, h5, h6, span, a, td {
            font-family: ${designSettings.fontFamily} !important;
          }
        </style>
      `;
      html = html.replace('</head>', `${fontStyle}</head>`);
    }

    // Add IDs to images if they don't have them for targeting
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('img').forEach((img, idx) => {
      if (!img.getAttribute('data-editor-id')) {
        img.setAttribute('data-editor-id', `img-${idx}`);
      }
    });
    
    // Make text elements editable
    doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, td').forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.children.length === 0 || (htmlEl.tagName === 'A' && htmlEl.textContent?.trim() !== '')) {
        htmlEl.setAttribute('contenteditable', 'true');
        htmlEl.style.outline = 'none';
      }
    });

    const firstRecipient = recipients[0] || { name: 'Valued Participant' };
    let finalHtml = doc.documentElement.outerHTML;
    finalHtml = finalHtml.replace(/\{\{name\}\}/gi, firstRecipient.name || 'Valued Participant');

    // Inject Editor Script
    const script = `
      <script>
        document.addEventListener('click', (e) => {
          if (e.target.tagName === 'IMG') {
            e.preventDefault();
            window.parent.postMessage({ 
              type: 'IMAGE_CLICKED', 
              id: e.target.getAttribute('data-editor-id'),
              src: e.target.src 
            }, '*');
          }
        });

        document.addEventListener('blur', (e) => {
          if (e.target.hasAttribute('contenteditable')) {
            // Remove contenteditable before sending back to keep it clean
            const clone = document.documentElement.cloneNode(true);
            clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
            window.parent.postMessage({ 
              type: 'CONTENT_UPDATED', 
              html: clone.outerHTML 
            }, '*');
          }
        }, true);

        // Hover effects
        document.addEventListener('mouseover', (e) => {
          if (e.target.tagName === 'IMG' || e.target.hasAttribute('contenteditable')) {
            e.target.style.boxShadow = '0 0 0 2px #11B018';
            e.target.style.cursor = 'pointer';
          }
        });
        document.addEventListener('mouseout', (e) => {
          if (e.target.tagName === 'IMG' || e.target.hasAttribute('contenteditable')) {
            e.target.style.boxShadow = 'none';
          }
        });
      </script>
    `;

    return finalHtml + script;
  }, [selectedTemplate, recipients, designSettings]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'IMAGE_CLICKED') {
        setEditingImage({ id: event.data.id, src: event.data.src });
      }
      if (event.data.type === 'CONTENT_UPDATED') {
        setSelectedTemplate(prev => prev ? { ...prev, htmlContent: event.data.html } : null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleUpdateImage = (newSrc: string) => {
    if (!editingImage || !selectedTemplate) return;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(selectedTemplate.htmlContent, 'text/html');
    const img = doc.querySelector(`img[data-editor-id="${editingImage.id}"]`);
    if (img) {
      img.setAttribute('src', newSrc);
      setSelectedTemplate({ ...selectedTemplate, htmlContent: doc.documentElement.outerHTML });
    }
    setEditingImage(null);
  };

  const handleLaunchCampaign = async () => {
    if (!selectedTemplate || recipients.length === 0) {
      alert("Please select a template and ensure you have recipients.");
      return;
    }

    const confirmLaunch = window.confirm(`Are you sure you want to launch this campaign to ${recipients.length} recipients?`);
    if (!confirmLaunch) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: selectedTemplate.subject,
          htmlContent: selectedTemplate.htmlContent,
          senderName: designSettings.senderName,
          senderEmail: designSettings.senderEmail
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send emails');
      }

      const newCampaign: Campaign = {
        id: `campaign-${Date.now()}`,
        name: selectedTemplate.name,
        templateId: selectedTemplate.id,
        status: 'sent',
        createdAt: new Date().toISOString().split('T')[0],
        recipientsCount: recipients.length
      };

      setCampaigns(prev => [newCampaign, ...prev]);
      alert("Campaign launched successfully!");
      setActiveView('dashboard');
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Launch Error:", err);
      alert(`Failed to launch campaign: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <LayoutTemplate size={24} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Oratora</span>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`text-sm font-black uppercase tracking-widest transition-colors ${activeView === 'dashboard' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('studio')}
            className={`text-sm font-black uppercase tracking-widest transition-colors ${activeView === 'studio' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Studio
          </button>
          <button 
            onClick={() => setActiveView('audience')}
            className={`text-sm font-black uppercase tracking-widest transition-colors ${activeView === 'audience' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Audience
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </nav>

      <main>
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DashboardView campaigns={campaigns} setActiveView={setActiveView} />
            </motion.div>
          )}
          {activeView === 'studio' && (
            <motion.div
              key="studio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StudioView 
                onSelectTemplate={handleSelectTemplate} 
                onBlankCanvas={handleBlankCanvas}
              />
            </motion.div>
          )}
          {activeView === 'ai-gen' && (
            <motion.div
              key="ai-gen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <AIGenerationView 
                onGenerate={handleGenerateAI}
                onRestyle={handleRestyleAI}
                isGenerating={isGenerating}
                onCancel={() => setActiveView('studio')}
                initialLayout={selectedLayout}
              />
            </motion.div>
          )}
          {activeView === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full"
            >
              <ReviewView 
                selectedTemplate={selectedTemplate}
                setActiveView={setActiveView}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
                designSettings={designSettings}
                setDesignSettings={setDesignSettings}
                processedHtml={processedHtml}
                editingImage={editingImage}
                setEditingImage={setEditingImage}
                onUpdateImage={handleUpdateImage}
                onLaunchCampaign={handleLaunchCampaign}
                isLaunching={isGenerating}
              />
            </motion.div>
          )}
          {activeView === 'audience' && (
            <motion.div
              key="audience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AudienceView 
                recipients={recipients}
                setRecipients={setRecipients}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
