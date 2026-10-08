"use client";

import { useEffect, useState } from "react";
import { fetchSkillsAndLanguages, type SkillLanguageOption } from "@/services/careers/skills-and-languages.service";
import CareersSearchIcon from "./CareersSearchIcon";

export default function CareersSkillsSearch({ placeholder, skills, languages, onSelect }: {
  placeholder: string;
  skills: string[];
  languages: string[];
  onSelect: (option: SkillLanguageOption) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SkillLanguageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await fetchSkillsAndLanguages(search, controller.signal);
        if (!controller.signal.aborted) setOptions(results);
      } catch {
        if (!controller.signal.aborted) setError("Unable to load skills and languages. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, search.trim() ? 300 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [search, open]);

  const available = options.filter((option) =>
    !(option.type === "Skill" ? skills : languages).includes(option.label),
  );

  return (
    <div className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <div className="flex h-14 items-center justify-between bg-[#F2F2F2] p-3">
        <input
          id="careers-skills-languages-search"
          type="text" role="combobox" aria-label="Search skills and languages"
          aria-autocomplete="list" aria-expanded={open}
          aria-controls="careers-skills-languages-search-options"
          value={search} placeholder={placeholder}
          onFocus={() => { if (!open) { setLoading(true); setError(""); setOpen(true); } }}
          onChange={(event) => { setSearch(event.target.value); setLoading(true); setError(""); setOpen(true); }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
            if (event.key === "Escape") setOpen(false);
          }}
          className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:text-[#999999]"
        />
        <CareersSearchIcon />
      </div>
      {open && (
        <div id="careers-skills-languages-search-options" role="listbox" aria-label="Skills and languages"
          aria-busy={loading}
          className="absolute left-0 right-0 top-full z-[90] mt-1 flex max-h-64 flex-col overflow-y-auto bg-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {loading || error || available.length === 0 ? (
            <p role="status" className="p-3 font-gill text-sm">{loading ? "Loading…" : error || "No skills or languages found."}</p>
          ) : available.map((option) => (
            <button key={`${option.type}:${option.label}`} type="button" role="option" aria-selected={false}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => { onSelect(option); setSearch(""); setOpen(false); }}
              className="flex min-h-14 w-full items-center justify-between gap-3 p-3 text-left font-gill text-sm text-darkblack hover:bg-[#DECAA0]">
              <span>{option.label}</span><span>{option.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
