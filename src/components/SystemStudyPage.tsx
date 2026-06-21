import React, { useMemo } from 'react';
import { ArrowLeft, BookOpen, ExternalLink, Layers, Microscope, Stethoscope, Activity, GraduationCap } from 'lucide-react';
import { anatomyData } from '../data';
import { AnatomyIllustrations } from './AnatomyIllustrations';
import { systemStudyData } from '../systemStudyData';

interface SystemStudyPageProps {
  systemId: string;
  onBack: () => void;
  onOpen3D: (systemId: string) => void;
}

const systemImagePath = (systemId: string) => `/assets/anatomy-real/${systemId}.jpg`;

const SectionCard = ({ title, items, icon: Icon }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-9 h-9 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
    </div>
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

export const SystemStudyPage: React.FC<SystemStudyPageProps> = ({ systemId, onBack, onOpen3D }) => {
  const system = useMemo(() => anatomyData.systems.find((item) => item.id === systemId), [systemId]);
  const study = system ? systemStudyData[system.id] : undefined;
  const relatedOrgans = useMemo(() => {
    if (!system) return [];
    return anatomyData.organs.filter((organ) => organ.system === system.name);
  }, [system]);

  if (!system || !study) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-lg bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-3">System page not found</h2>
          <p className="text-slate-600 mb-6">The requested body-system study page could not be loaded.</p>
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
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">MBBS body-system study page</div>
              <h1 className="text-2xl font-black text-slate-950">{system.name}</h1>
            </div>
          </div>

          <button
            onClick={() => onOpen3D(system.id)}
            className="px-4 py-2.5 rounded-2xl bg-slate-950 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in 3D Viewer</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-extrabold text-slate-500 mb-4">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>System overview</span>
            </div>

            <div className="bg-slate-50 rounded-3xl border border-slate-200 min-h-[280px] flex items-center justify-center p-5 mb-6">
              <img
                src={systemImagePath(system.id)}
                alt={system.name}
                className="max-w-full max-h-72 object-contain"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="hidden"><AnatomyIllustrations id={system.id} size={200} /></div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3">{system.name}</h2>
            <p className="text-sm text-slate-700 leading-7 mb-5">{study.summary}</p>

            <div className="rounded-3xl bg-cyan-50 border border-cyan-100 p-5">
              <div className="flex items-center gap-2 text-cyan-700 font-extrabold text-sm mb-3">
                <BookOpen className="w-4 h-4" />
                <span>Core components</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {system.organs.map((organName) => (
                  <span key={organName} className="px-3 py-1.5 rounded-xl bg-white border border-cyan-100 text-xs font-bold text-slate-700">
                    {organName}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Gross anatomy" items={study.grossAnatomy} icon={Layers} />
            <SectionCard title="Core physiology" items={study.physiology} icon={Activity} />
            <SectionCard title="Histology & microanatomy" items={study.histology} icon={Microscope} />
            <SectionCard title="Embryology & development" items={study.embryology} icon={BookOpen} />
            <SectionCard title="Clinical correlation" items={study.clinicalCorrelation} icon={Stethoscope} />
            <SectionCard title="MBBS exam focus" items={study.mbbsExamFocus} icon={GraduationCap} />
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cyan-700">Connected organ pages</div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Organs inside this system</h2>
            </div>
            <span className="text-xs font-bold text-slate-500">{relatedOrgans.length} indexed organs</span>
          </div>

          {relatedOrgans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedOrgans.map((organ) => (
                <div key={organ.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-extrabold text-slate-900 text-sm">{organ.name}</div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-3">{organ.function}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">This system currently has no individual organ cards linked in the index.</p>
          )}
        </section>
      </main>
    </div>
  );
};
