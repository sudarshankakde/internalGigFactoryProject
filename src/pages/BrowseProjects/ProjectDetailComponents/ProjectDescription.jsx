import React from "react";
import { Briefcase, Paperclip, Tag } from "lucide-react";

export default function ProjectDescription({ project, files }) {
  return (
    <>
      {/* Description card */}
      <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
        <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
          <Briefcase size={18} className="text-[#70d64d]" />
          <h3 className="text-white font-bold text-[1rem] m-0">
            Project Description
          </h3>
        </div>
        <div
          className="text-[#8a8a8a] text-[0.85rem] m-0 leading-relaxed whitespace-pre-wrap rich-text-content ql-editor-display break-words max-w-full overflow-x-auto"
          dangerouslySetInnerHTML={{
            __html:
              project.description ||
              "No description available for this project.",
          }}
        />
      </section>

      {/* Required Skills & Expertise */}
      {project.project_skills && project.project_skills.length > 0 && (
        <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
          <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
            <Tag className="text-[#70d64d]" size={18} />
            <h3 className="text-white font-bold text-[1rem] m-0">
              Required Skills & Expertise
            </h3>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {project.project_skills.map((sk) => (
              <span
                key={sk.id}
                className="bg-[#0c0c0e] border border-[#23232a] text-white text-[0.78rem] px-[12px] py-[6px] rounded-[4px] font-medium"
              >
                {sk.skill_name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Project Deliverables / Tags */}
      {project.project_tags && project.project_tags.length > 0 && (
        <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
          <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
            <Briefcase className="text-[#70d64d]" size={18} />
            <h3 className="text-white font-bold text-[1rem] m-0">
              Project Deliverables
            </h3>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {project.project_tags.map((t) => (
              <span
                key={t.id}
                className="bg-transparent border border-dashed border-[#23232a] text-[#70d64d] text-[0.78rem] px-[12px] py-[6px] rounded-[4px] font-medium"
              >
                {t.tag_name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Project Documents/Files card */}
      {files.length > 0 && (
        <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
          <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
            <Paperclip size={18} className="text-[#70d64d]" />
            <h3 className="text-white font-bold text-[1rem] m-0">
              Supporting Documents
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0c0c0e] border border-[#23232a] hover:border-gray-500 hover:bg-[#1a1a20] rounded-[6px] p-3 flex items-center justify-between transition-all duration-150  text-decoration-none cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0 pr-4 w-full">
                  <Paperclip size={14} className="text-gray-500 shrink-0" />
                  <span className="text-xs text-gray-300 truncate font-semibold">
                    {file.file_name}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">
                  VIEW
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
