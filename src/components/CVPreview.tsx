import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from "lucide-react";

interface CVPreviewProps {
  data: any;
  config: {
    template: "classic" | "modern" | "minimal" | "bold";
    primaryColor: string;
    fontFamily: "serif" | "sans";
  };
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data, config }) => {
  const { personalInfo, experience, education, skills } = data;
  const { template, primaryColor, fontFamily } = config;

  const fontClass = fontFamily === "serif" ? "font-serif" : "font-sans";
  
  const colors: Record<string, { text: string; bg: string; border: string; light: string }> = {
    indigo: { text: "text-indigo-600", bg: "bg-indigo-600", border: "border-indigo-600", light: "bg-indigo-50" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-600", border: "border-emerald-600", light: "bg-emerald-50" },
    rose: { text: "text-rose-600", bg: "bg-rose-600", border: "border-rose-600", light: "bg-rose-50" },
    amber: { text: "text-amber-600", bg: "bg-amber-600", border: "border-amber-600", light: "bg-amber-50" },
  };

  const theme = colors[primaryColor] || colors.indigo;

  const renderClassic = () => (
    <div className={`p-10 md:p-14 flex flex-col space-y-10 ${fontClass}`}>
      <header className={`flex flex-col md:flex-row md:items-end justify-between border-b-2 ${theme.border.replace("text", "border")} pb-8 gap-6`}>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-none">
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p className={`text-xl md:text-2xl font-light ${theme.text}`}>
            {personalInfo.jobTitle || "Your Dream Job"}
          </p>
        </div>
        <div className="flex flex-wrap md:flex-col items-start md:items-end gap-x-4 gap-y-1 text-xs md:text-sm font-medium text-slate-500 font-sans">
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {personalInfo.email}</span>
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {personalInfo.phone}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {personalInfo.location}</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10 flex-1">
        <div className="col-span-12 md:col-span-8 space-y-10">
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-2">Profile</h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              {personalInfo.summary}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-2">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp: any) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-500 italic">
                    <span>{exp.company}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60 font-sans">{exp.location}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line pt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-12 md:col-span-4 space-y-10">
          <section className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string, idx: number) => (
                <span key={idx} className={`px-2 py-1 ${theme.bg} text-white text-[10px] font-bold uppercase tracking-wider rounded`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-2">Education</h2>
            <div className="space-y-5">
              {education.map((edu: any) => (
                <div key={edu.id} className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{edu.school}</h3>
                  <p className="text-xs text-slate-600 font-medium">{edu.degree}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{edu.graduationDate}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderModern = () => (
    <div className={`flex flex-col md:flex-row h-full min-h-[1100px] ${fontClass}`}>
      <div className={`w-full md:w-[320px] ${theme.bg} text-white p-12 space-y-12 flex flex-col`}>
        <div className="space-y-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
            {personalInfo.fullName?.charAt(0)}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight uppercase leading-none">
              {personalInfo.fullName?.split(" ")[0]}<br/>
              <span className="font-light opacity-80">{personalInfo.fullName?.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
              {personalInfo.jobTitle}
            </p>
          </div>
        </div>

        <div className="space-y-10 flex-1">
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Contact</h2>
            <div className="space-y-4 text-xs font-medium">
              <span className="flex items-center gap-3 bg-white/10 p-2 rounded-lg"><Mail className="w-4 h-4 opacity-70" /> {personalInfo.email}</span>
              <span className="flex items-center gap-3 bg-white/10 p-2 rounded-lg"><Phone className="w-4 h-4 opacity-70" /> {personalInfo.phone}</span>
              <span className="flex items-center gap-3 bg-white/10 p-2 rounded-lg"><MapPin className="w-4 h-4 opacity-70" /> {personalInfo.location}</span>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Top Skills</h2>
            <div className="flex flex-col gap-2">
              {skills.map((skill: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      <div className="flex-1 bg-white p-12 md:p-14 space-y-12 overflow-y-auto">
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.4em] ${theme.text}`}>About</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <p className="text-sm md:text-base leading-relaxed text-slate-600 font-medium italic opacity-80">
            "{personalInfo.summary}"
          </p>
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.4em] ${theme.text}`}>Experience</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="space-y-10">
            {experience.map((exp: any) => (
              <div key={exp.id} className="relative pl-8 border-l-2 border-slate-50 flex flex-col gap-1">
                <div className={`absolute left-[-6px] top-0 w-2.5 h-2.5 rounded-full ${theme.bg} ring-4 ring-white`} />
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{exp.position}</h3>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group">
                  <span>{exp.company}</span>
                  <span className="opacity-30">•</span>
                  <span className="text-[10px] uppercase tracking-wider">{exp.location}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500 mt-3 font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.4em] ${theme.text}`}>Education</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu: any) => (
              <div key={edu.id} className={`${theme.light} p-5 rounded-2xl border border-white space-y-1`}>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{edu.school}</h3>
                <p className={`text-xs font-bold ${theme.text}`}>{edu.degree}</p>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 pt-2 uppercase tracking-tighter">
                  <span>{edu.location}</span>
                  <span>{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white transition-all overflow-hidden">
      {template === "classic" ? renderClassic() : renderModern()}
    </div>
  );
};
