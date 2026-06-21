import React, { useMemo } from 'react';
import { ArrowLeft, BookOpen, Brain, ExternalLink, Layers, Microscope, Stethoscope } from 'lucide-react';
import { anatomyData } from '../data';
import { AnatomyIllustrations } from './AnatomyIllustrations';
import { organStudyData } from '../organStudyData';

interface OrganStudyPageProps {
  organId: string;
  onBack: () => void;
  onOpen3D: (organId: string) => void;
}

const organImagePath = (organId: string) => `/assets/anatomy-real/${organId}.jpg`;

const SectionCard = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
    <h3 className="text-lg font-extrabold text-slate-900 mb-4">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
          <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0 mt-2" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const OrganStudyPage: React.FC<OrganStudyPageProps> = ({ organId, onBack, onOpen3D }) => {
  const organ = useMemo(() => anatomyData.organs.find((item) => item.id === organId), [organId]);
  const study = organ ? organStudyData[organ.id] : undefined;

  if (!organ || !study) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-lg bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Organ page not found</h2>
          <p className="text-slate-600 mb-6">The requested anatomy study page could not be loaded.</p>
          <button onClick={onBack} className="px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold cursor-pointer">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">MBBS organ study page</div>
              <h1 className="text-2xl font-black text-slate-950">{organ.name}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-2 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold border border-cyan-100">{organ.system}</span>
            <button
              onClick={() => onOpen3D(organ.id)}
              className="px-4 py-2.5 rounded-2xl bg-slate-950 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in 3D Viewer</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-500 mb-4">
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span>Overview</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              <div className="bg-slate-50 rounded-3xl border border-slate-200 min-h-[260px] flex items-center justify-center p-4">
                <img
                  src={organImagePath(organ.id)}
                  alt={organ.name}
                  className="max-w-full max-h-64 object-contain"
                  onError={(event) => {
                    (event.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="hidden"><AnatomyIllustrations id={organ.id} size={180} /></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-1">Location</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{organ.location}</p>
                </div>
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-1">Basic structure</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{organ.structure}</p>
                </div>
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-1">Main function</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{organ.function}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-cyan-50 border border-cyan-100 p-5">
              <div className="flex items-center gap-2 text-cyan-700 font-extrabold text-sm mb-3">
                <Brain className="w-4 h-4" />
                <span>MBBS-level summary</span>
              </div>
              <p className="text-sm text-slate-700 leading-7">{study.summary}</p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Gross anatomy" items={study.grossAnatomy} />
            <SectionCard title="Vascular supply & drainage" items={study.vascularSupply} />
            <SectionCard title="Innervation" items={study.innervation} />
            <SectionCard title="Histology" items={study.histology} />
            <SectionCard title="Embryology" items={study.embryology} />
            <SectionCard title="Clinical correlation" items={study.clinicalCorrelation} />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Layers,
              title: 'Related organs',
              content: organ.relatedOrgans.join(', '),
            },
            {
              icon: Microscope,
              title: 'Quick academic facts',
              content: organ.quickFacts.join(' • '),
            },
            {
              icon: Stethoscope,
              title: 'Clinical learning tip',
              content: 'For exam preparation, correlate this organ with surface anatomy, blood supply, nerve supply, histology, and at least three common diseases.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-cyan-600 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};
