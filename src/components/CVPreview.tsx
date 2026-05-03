import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from "lucide-react";

interface CVPreviewProps {
  data: any;
  config: {
    template: "classic" | "modern" | "minimal" | "bold" | "sidebar" | "professional" | "creative";
    primaryColor: string;
    fontFamily: "serif" | "sans" | "mono";
  };
  mode?: "cv" | "letter";
}

export const CVPreview: React.FC<CVPreviewProps> = ({ data, config, mode = "cv" }) => {
  const { personalInfo, experience, education, skills, testimonials, coverLetter } = data;
  const { template, primaryColor, fontFamily } = config;

  const fontClass = fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans";
  
  const colors: Record<string, { text: string; bg: string; border: string; light: string; accent: string }> = {
    indigo: { text: "text-indigo-600", bg: "bg-indigo-600", border: "border-indigo-600", light: "bg-indigo-50", accent: "text-indigo-400" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-600", border: "border-emerald-600", light: "bg-emerald-50", accent: "text-emerald-400" },
    rose: { text: "text-rose-600", bg: "bg-rose-600", border: "border-rose-600", light: "bg-rose-50", accent: "text-rose-400" },
    amber: { text: "text-amber-600", bg: "bg-amber-600", border: "border-amber-600", light: "bg-amber-50", accent: "text-amber-400" },
    slate: { text: "text-slate-800", bg: "bg-slate-800", border: "border-slate-800", light: "bg-slate-100", accent: "text-slate-500" },
    violet: { text: "text-violet-600", bg: "bg-violet-600", border: "border-violet-600", light: "bg-violet-50", accent: "text-violet-400" },
  };

  const theme = colors[primaryColor] || colors.indigo;

  const Avatar = () => (
    personalInfo.avatar ? (
      <img src={personalInfo.avatar} alt={personalInfo.fullName} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white" />
    ) : null
  );

  const TestimonialsSection = () => (
    testimonials && testimonials.length > 0 ? (
      <section className="space-y-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-2">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t: any) => (
            <div key={t.id} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 italic">
              <p className="text-[11px] leading-relaxed text-slate-600">"{t.quote}"</p>
              <div className="text-[9px] font-bold text-slate-400 uppercase">
                {t.name} — {t.position}
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null
  );

  const renderClassic = () => (
    <div className={`p-10 md:p-14 flex flex-col space-y-10 ${fontClass}`}>
      <header className={`flex flex-col md:flex-row md:items-end justify-between border-b-2 ${theme.border} pb-8 gap-6`}>
        <div className="flex items-center gap-6">
          <Avatar />
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-none">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <p className={`text-xl md:text-2xl font-light ${theme.text}`}>
              {personalInfo.jobTitle || "Your Dream Job"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap md:flex-col items-start md:items-end gap-x-4 gap-y-1 text-xs md:text-sm font-medium text-slate-500 font-sans">
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {personalInfo.email}</span>
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {personalInfo.phone}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {personalInfo.location}</span>
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> {personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {personalInfo.website}</span>}
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
          
          <TestimonialsSection />
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

        <TestimonialsSection />
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className={`p-16 md:p-24 space-y-20 ${fontClass} max-w-4xl mx-auto`}>
      <header className="space-y-6 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">
          {personalInfo.fullName}
        </h1>
        <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          <span>{personalInfo.location}</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span>{personalInfo.email}</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span>{personalInfo.phone}</span>
        </div>
      </header>

      <div className="space-y-16">
        <section className="space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 text-center">Experience</h2>
          <div className="space-y-12">
            {experience.map((exp: any) => (
              <article key={exp.id} className="grid grid-cols-4 gap-8">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest pt-1">{exp.startDate} – {exp.endDate}</div>
                <div className="col-span-3 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 leading-none">{exp.position}</h3>
                  <div className={`text-sm font-bold ${theme.text}`}>{exp.company}</div>
                  <p className="text-sm leading-relaxed text-slate-500 font-medium">{exp.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-16">
          <section className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Education</h2>
            <div className="space-y-6">
              {education.map((edu: any) => (
                <div key={edu.id} className="space-y-1">
                  <h3 className="font-bold text-slate-900 leading-tight">{edu.school}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{edu.degree}</p>
                  <p className="text-[10px] text-slate-300 font-black uppercase">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Expertise</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {skills.map((skill: string, idx: number) => (
                <span key={idx} className="text-xs font-bold text-slate-600 border-b border-slate-100 pb-1 italic">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderBold = () => (
    <div className={`flex flex-col h-full bg-slate-900 text-white ${fontClass}`}>
      <header className="p-16 md:p-20 bg-white text-slate-900 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <div className={`w-12 h-2 ${theme.bg} mb-6`} />
          <h1 className="text-6xl font-black tracking-tighter leading-[0.9]">
            {personalInfo.fullName?.split(" ")[0]}<br/>
            <span className={theme.text}>{personalInfo.fullName?.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">{personalInfo.jobTitle}</p>
        </div>
        <div className="flex flex-col gap-4 text-sm font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-3"><Mail className={`w-5 h-5 ${theme.text}`} /> {personalInfo.email}</div>
          <div className="flex items-center gap-3"><Phone className={`w-5 h-5 ${theme.text}`} /> {personalInfo.phone}</div>
          <div className="flex items-center gap-3"><MapPin className={`w-5 h-5 ${theme.text}`} /> {personalInfo.location}</div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12">
        <aside className="col-span-12 md:col-span-4 p-16 space-y-12 border-r border-white/10">
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">About</h2>
            <p className="text-sm leading-relaxed font-bold italic text-white/80">
              {personalInfo.summary}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Skills</h2>
            <div className="space-y-3">
              {skills.map((skill: string, idx: number) => (
                <div key={idx} className="flex items-center justify-between group">
                  <span className="text-sm font-bold group-hover:translate-x-2 transition-transform">{skill}</span>
                  <div className={`w-8 h-1 ${theme.bg} rounded-full opacity-50`} />
                </div>
              ))}
            </div>
          </section>
        </aside>

        <main className="col-span-12 md:col-span-8 p-16 space-y-16 bg-slate-900">
          <section className="space-y-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Experience</h2>
            <div className="space-y-12">
              {experience.map((exp: any) => (
                <div key={exp.id} className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`text-2xl font-black tracking-tight ${theme.text}`}>{exp.position}</h3>
                    <span className="text-xs font-bold text-white/40">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white/60">{exp.company}</h4>
                  <p className="text-sm leading-relaxed text-white/70 font-medium">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className={`flex h-full min-h-[1100px] border-[20px] ${theme.border.replace("border", "border-slate-50")} ${fontClass}`}>
       <div className="w-[80px] bg-slate-900 flex flex-col items-center py-10 gap-10">
          <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center text-white font-bold`}>{personalInfo.fullName?.charAt(0)}</div>
          <div className="flex-1 flex flex-col justify-center gap-12 [writing-mode:vertical-lr] rotate-180">
            <span className="text-[10px] font-black uppercase tracking-[1em] text-white/20 whitespace-nowrap">CURRICULUM VITAE</span>
            <span className="text-[10px] font-black uppercase tracking-[1em] text-white/20 whitespace-nowrap">{personalInfo.fullName}</span>
          </div>
       </div>
       <div className="flex-1 bg-white p-16 flex flex-col space-y-16">
          <header className="space-y-2">
            <h1 className="text-6xl font-black tracking-tight text-slate-900 leading-[0.8]">{personalInfo.fullName}</h1>
            <p className={`text-2xl font-bold ${theme.text}`}>{personalInfo.jobTitle}</p>
          </header>

          <div className="grid grid-cols-2 gap-16">
            <section className="col-span-2 space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Profile</h2>
              <p className="text-lg leading-relaxed text-slate-700 font-medium italic">"{personalInfo.summary}"</p>
            </section>

            <section className="space-y-10">
               <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Experience</h2>
               <div className="space-y-8">
                  {experience.map((exp: any) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 bg-slate-50 inline-block px-2 py-0.5 rounded uppercase tracking-wider">{exp.startDate} — {exp.endDate}</div>
                      <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                      <p className={`text-sm font-black uppercase tracking-tight ${theme.text}`}>{exp.company}</p>
                      <p className="text-sm text-slate-500 leading-relaxed pt-2">{exp.description}</p>
                    </div>
                  ))}
               </div>
            </section>

            <div className="space-y-16">
              <section className="space-y-6">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Education</h2>
                 <div className="space-y-6">
                    {education.map((edu: any) => (
                      <div key={edu.id} className="space-y-1 border-l-2 pl-4 border-slate-100">
                        <h3 className="font-bold text-slate-900">{edu.school}</h3>
                        <p className="text-xs font-bold text-slate-500">{edu.degree}</p>
                        <p className="text-[10px] font-black text-slate-300 uppercase">{edu.graduationDate}</p>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="space-y-6">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Technical</h2>
                 <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string, idx: number) => (
                      <span key={idx} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-100 hover:bg-slate-50 transition-colors`}>{skill}</span>
                    ))}
                 </div>
              </section>
            </div>
          </div>

          <footer className="mt-auto pt-10 border-t border-slate-100 grid grid-cols-3 gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {personalInfo.email}</div>
             <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {personalInfo.phone}</div>
             <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {personalInfo.location}</div>
          </footer>
       </div>
    </div>
  );

  const renderCreative = () => (
    <div className={`h-full min-h-[1100px] bg-slate-50 p-10 md:p-14 ${fontClass} relative overflow-hidden`}>
       <div className={`absolute top-[-100px] right-[-100px] w-80 h-80 ${theme.bg} rounded-full opacity-10 blur-[100px]`} />
       <div className={`absolute bottom-[-100px] left-[-100px] w-80 h-80 ${theme.bg} rounded-full opacity-10 blur-[100px]`} />
       
       <div className="bg-white rounded-[40px] shadow-2xl h-full flex flex-col overflow-hidden border border-white relative z-10">
          <header className={`p-12 md:p-16 ${theme.bg} text-white flex flex-col md:flex-row justify-between items-center gap-10`}>
             <div className="space-y-4 text-center md:text-left">
                <h1 className="text-6xl font-black tracking-tighter leading-none">{personalInfo.fullName}</h1>
                <p className="text-xl font-bold opacity-80 uppercase tracking-[0.2em]">{personalInfo.jobTitle}</p>
             </div>
             <div className="grid grid-cols-1 gap-3 text-xs font-black uppercase tracking-widest opacity-80">
                <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2"><Mail className="w-4 h-4" /> {personalInfo.email}</div>
                <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2"><Phone className="w-4 h-4" /> {personalInfo.phone}</div>
                <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2"><MapPin className="w-4 h-4" /> {personalInfo.location}</div>
             </div>
          </header>

          <div className="flex-1 p-12 md:p-16 grid grid-cols-12 gap-16">
             <div className="col-span-12 md:col-span-7 space-y-16">
                <section className="space-y-6">
                   <h2 className={`text-xs font-black uppercase tracking-[0.5em] ${theme.text}`}>My Story</h2>
                   <p className="text-lg leading-relaxed text-slate-600 font-medium">{personalInfo.summary}</p>
                </section>

                <section className="space-y-10">
                   <h2 className={`text-xs font-black uppercase tracking-[0.5em] ${theme.text}`}>Experience</h2>
                   <div className="space-y-12">
                      {experience.map((exp: any) => (
                        <div key={exp.id} className="relative pl-10 border-l-4 border-slate-50">
                           <div className={`absolute left-[-11px] top-0 w-5 h-5 rounded-full ${theme.bg} border-4 border-white shadow-lg`} />
                           <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{exp.startDate} — {exp.endDate}</span>
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{exp.position}</h3>
                              <h4 className={`text-sm font-black uppercase tracking-wider ${theme.text} mb-3`}>{exp.company}</h4>
                              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{exp.description}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
             </div>

             <div className="col-span-12 md:col-span-5 space-y-16">
                <section className="space-y-8">
                   <h2 className={`text-xs font-black uppercase tracking-[0.5em] ${theme.text}`}>Aura & Skills</h2>
                   <div className="flex flex-wrap gap-3">
                      {skills.map((skill: string, idx: number) => (
                        <div key={idx} className={`px-5 py-3 rounded-2xl ${theme.light} text-sm font-bold ${theme.text} border border-white shadow-sm`}>{skill}</div>
                      ))}
                   </div>
                </section>

                <section className="space-y-8">
                   <h2 className={`text-xs font-black uppercase tracking-[0.5em] ${theme.text}`}>Education</h2>
                   <div className="space-y-6">
                      {education.map((edu: any) => (
                        <div key={edu.id} className="p-6 bg-slate-50 rounded-3xl space-y-2 border border-slate-100">
                           <h3 className="font-extrabold text-slate-900 leading-tight">{edu.school}</h3>
                           <p className="text-xs font-bold text-slate-500">{edu.degree}</p>
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{edu.graduationDate}</p>
                        </div>
                      ))}
                   </div>
                </section>
             </div>
          </div>
       </div>
    </div>
  );

  const renderProfessional = () => (
    <div className={`p-16 flex flex-col space-y-12 ${fontClass} bg-white text-slate-800`}>
       <header className="border-b-4 border-slate-800 pb-10 grid grid-cols-12 gap-8 items-end">
          <div className="col-span-8 space-y-2">
             <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase">{personalInfo.fullName}</h1>
             <p className={`text-2xl font-bold tracking-widest uppercase ${theme.text}`}>{personalInfo.jobTitle}</p>
          </div>
          <div className="col-span-4 flex flex-col items-end gap-1 text-xs font-bold text-slate-500 uppercase tracking-tight">
             <span>{personalInfo.location}</span>
             <span>{personalInfo.email}</span>
             <span>{personalInfo.phone}</span>
          </div>
       </header>

       <div className="grid grid-cols-12 gap-16">
          <div className="col-span-8 space-y-12">
             <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] bg-slate-800 text-white px-3 py-1 inline-block">Professional Summary</h2>
                <p className="text-base leading-relaxed text-slate-600 font-medium">{personalInfo.summary}</p>
             </section>

             <section className="space-y-8">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] bg-slate-800 text-white px-3 py-1 inline-block">Experience</h2>
                <div className="space-y-10">
                   {experience.map((exp: any) => (
                      <div key={exp.id} className="space-y-3">
                         <div className="flex justify-between items-baseline">
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{exp.position}</h3>
                            <span className="text-xs font-black text-slate-400 uppercase">{exp.startDate} – {exp.endDate}</span>
                         </div>
                         <div className="flex justify-between text-sm font-black text-slate-500 uppercase tracking-widest italic border-b border-slate-100 pb-1">
                            <span>{exp.company}</span>
                            <span>{exp.location}</span>
                         </div>
                         <p className="text-sm leading-relaxed text-slate-600 font-medium">{exp.description}</p>
                      </div>
                   ))}
                </div>
             </section>
             <TestimonialsSection />
          </div>

          <div className="col-span-4 space-y-12">
             <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b-2 border-slate-800 pb-1">Core Skills</h2>
                <div className="grid grid-cols-1 gap-2">
                   {skills.map((skill: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                         <div className={`w-2 h-2 ${theme.bg}`} />
                         {skill}
                      </div>
                   ))}
                </div>
             </section>

             <section className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] border-b-2 border-slate-800 pb-1">Education</h2>
                <div className="space-y-6">
                   {education.map((edu: any) => (
                      <div key={edu.id} className="space-y-1">
                         <h3 className="font-bold text-slate-900 text-sm uppercase">{edu.school}</h3>
                         <p className="text-xs font-bold text-slate-500">{edu.degree}</p>
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{edu.graduationDate}</p>
                      </div>
                   ))}
                </div>
             </section>
          </div>
       </div>
    </div>
  );

  const renderLetter = () => (
    <div className={`p-16 md:p-24 space-y-12 ${fontClass} max-w-3xl mx-auto`}>
      <header className="flex justify-between items-start border-b pb-12 border-slate-100">
        <div className="space-y-4">
           <Avatar />
           <div>
             <h1 className="text-4xl font-black text-slate-900">{personalInfo.fullName}</h1>
             <p className={`text-lg font-bold ${theme.text}`}>{personalInfo.jobTitle}</p>
           </div>
        </div>
        <div className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest space-y-1">
          <div>{personalInfo.location}</div>
          <div>{personalInfo.email}</div>
          <div>{personalInfo.phone}</div>
          <div className="pt-4 text-slate-900">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </header>

      <div className="space-y-8">
        <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">Subject: Application for {personalInfo.jobTitle} position</div>
        <div className="text-base leading-relaxed text-slate-700 whitespace-pre-line font-serif">
          {coverLetter || "Your cover letter content will appear here..."}
        </div>
      </div>

      <footer className="pt-12 space-y-6">
        <div className="space-y-4">
          <p className="text-base font-medium text-slate-900">Sincerely,</p>
          <div className={`text-2xl font-serif italic ${theme.text}`}>{personalInfo.fullName}</div>
        </div>
      </footer>
    </div>
  );

  const renderTemplate = () => {
    if (mode === "letter") return renderLetter();
    switch (template) {
      case "modern": return renderModern();
      case "minimal": return renderMinimal();
      case "bold": return renderBold();
      case "sidebar": return renderSidebar();
      case "creative": return renderCreative();
      case "professional": return renderProfessional();
      default: return renderClassic();
    }
  };

  return (
    <div className="h-full bg-white transition-all overflow-hidden">
      {renderTemplate()}
    </div>
  );
};

