import React, { useState, useRef } from "react";
import {
  Check,
  FileText,
  Folder,
  Paperclip,
  Plus,
  Tag,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { api } from "../../../utils/api";
import { toast } from "react-toastify";

export default function AdminProjectDescription({
  project,
  handleDeleteDocument,
  projectId,
  onDocumentUploaded,
}) {
  const [docFile, setDocFile] = useState(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isDocDragActive, setIsDocDragActive] = useState(false);
  const docFileInputRef = useRef(null);

  const handleDocDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDocDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDocDragActive(false);
    }
  };

  const handleDocDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDocDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setDocFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFile) return;

    const formData = new FormData();
    formData.append("file", docFile);

    setIsUploadingDoc(true);
    try {
      await api.postFile(`/projects/${projectId}/files`, formData);
      toast.success("Document uploaded successfully!");
      setDocFile(null);
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload document.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Project Description Card */}
      <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
        <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
          <FileText className="text-[#70d64d]" size={18} />
          <h3 className="text-white font-bold text-[1rem] m-0">
            Project Description
          </h3>
        </div>
        <div
          className="text-[#8a8a8a] text-[0.85rem] m-0 leading-relaxed whitespace-pre-wrap rich-text-content ql-editor-display break-words max-w-full overflow-x-auto"
          dangerouslySetInnerHTML={{
            __html:
              project.description || "No description available for this project.",
          }}
        />
      </div>

      {/* Required Skills & Expertise Card */}
      <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
        <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
          <Tag className="text-[#70d64d]" size={18} />
          <h3 className="text-white font-bold text-[1rem] m-0">
            Required Skills & Expertise
          </h3>
        </div>
        {!project.project_skills || project.project_skills.length === 0 ? (
          <p className="text-gray-500 text-[0.78rem] m-0 italic">
            No specific skills listed.
          </p>
        ) : (
          <div className="flex flex-wrap gap-[8px]">
            {project.project_skills.map((sk) => (
              <span
                key={sk.id}
                className="bg-[#202024] border border-[#2d2d34] text-white text-[0.78rem] px-[12px] py-[6px] rounded-[99px] font-medium"
              >
                {sk.skill_name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Project Deliverables Card */}
      <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
        <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
          <Check className="text-[#70d64d]" size={18} />
          <h3 className="text-white font-bold text-[1rem] m-0">
            Project Deliverables
          </h3>
        </div>
        {!project.project_tags || project.project_tags.length === 0 ? (
          <p className="text-gray-500 text-[0.78rem] m-0 italic">
            No deliverables tags listed.
          </p>
        ) : (
          <div className="flex flex-wrap gap-[8px]">
            {project.project_tags.map((t) => (
              <span
                key={t.id}
                className="bg-[#182318] border border-[#70d64d]/30 text-[#70d64d] text-[0.78rem] px-[12px] py-[6px] rounded-[99px] font-medium"
              >
                {t.tag_name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Supporting Documents Card */}
      <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
        <div className="flex items-center justify-between gap-[10px] mb-4 border-b border-[#23232a] pb-3">
          <div className="flex items-center gap-[10px]">
            <Folder className="text-[#70d64d]" size={18} />
            <h3 className="text-white font-bold text-[1rem] m-0">
              Supporting Documents
            </h3>
          </div>
        </div>

        {!project.files || project.files.length === 0 ? (
          <p className="text-gray-500 text-[0.78rem] m-0 italic">
            No supporting documents uploaded.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {project.files.map((f) => (
              <div
                key={f.id}
                className="flex justify-between items-center bg-[#0c0c0e] border border-[#23232a] p-3 rounded-[6px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip size={14} className="text-gray-500 shrink-0" />
                  <a
                    href={f.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-[0.8rem] font-semibold hover:text-[#70d64d] hover:underline truncate"
                  >
                    {f.file_name}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteDocument(f.id)}
                  className="bg-transparent border-none text-[#ef4444] hover:text-red-500 cursor-pointer p-1"
                  title="Delete Document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inline Drag and Drop Zone */}
        <form
          onSubmit={handleUploadDocument}
          className="mt-4 pt-4 border-t border-[#23232a]/50"
        >
          <div
            className={`dropzone-container border border-dashed rounded-[8px] p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] ${
              isDocDragActive
                ? "border-[#b5ff14] bg-[#b5ff14]/5"
                : "border-[#23232a] bg-[#0c0c0e] hover:border-[#2f2f38]"
            }`}
            onDragEnter={handleDocDrag}
            onDragOver={handleDocDrag}
            onDragLeave={handleDocDrag}
            onDrop={handleDocDrop}
            onClick={() =>
              docFileInputRef.current && docFileInputRef.current.click()
            }
          >
            <input
              type="file"
              ref={docFileInputRef}
              className="hidden"
              onChange={(e) => setDocFile(e.target.files[0] || null)}
            />
            {docFile ? (
              <div
                className="flex flex-col items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText size={20} className="text-[#b5ff14]" />
                <span className="text-[0.78rem] font-bold text-white max-w-[240px] truncate">
                  {docFile.name}
                </span>
                <span className="text-[0.68rem] text-gray-500">
                  ({(docFile.size / 1024).toFixed(1)} KB)
                </span>
                <div className="flex gap-2 mt-1">
                  <button
                    type="submit"
                    disabled={isUploadingDoc}
                    className="bg-[#70d64d] text-black border-none font-bold rounded-[4px] px-[12px] py-[5px] text-[0.7rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
                  >
                    {isUploadingDoc ? "Uploading..." : "Save File"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocFile(null)}
                    className="bg-transparent border border-[#ef444433] text-[#ef4444] font-bold rounded-[4px] px-[10px] py-[5px] text-[0.7rem] cursor-pointer hover:bg-[#ef444411] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <Plus size={20} className="text-gray-500" />
                <span className="text-[0.78rem] font-semibold text-white">
                  Drag &amp; drop document, or{" "}
                  <span className="text-[#b5ff14] hover:underline font-bold">
                    browse
                  </span>
                </span>
                <span className="text-[0.68rem] text-gray-500">
                  Add pdf, doc, dwg, or image
                </span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
