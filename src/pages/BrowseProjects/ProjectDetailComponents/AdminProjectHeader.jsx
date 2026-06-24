import React from "react";
import { Briefcase, Calendar, Clock, Users, Wallet, Share2, Check, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { ShareButton } from "react-share-utilities";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function AdminProjectHeader({ project, applications }) {
  return (
    <div className="bg-[#121215] border-l-4 border-0 border-[#70d64d] rounded-[6px] p-[28px] relative">
      <div className="flex flex-col md:flex-row justify-between gap-[20px] items-start md:items-center">
        <div>
          {/* Badges */}
          <div className="flex items-center gap-[8px] flex-wrap">
            <span className="bg-[#202024] border border-[#2d2d34] text-white text-[0.65rem] px-[10px] py-[4px] rounded-[4px] font-bold uppercase tracking-wider">
              {project.project_type || "FIXED"}
            </span>
            <span
              className={`uppercase font-bold text-[0.65rem] px-[10px] py-[4px] rounded-[4px] tracking-wider border ${
                project.priority === "high"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {project.priority || "MEDIUM"} PRIORITY
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2 leading-tight">
            {project.title}
          </h1>

          {/* Sub-label/Company */}
          <div className="flex items-center gap-2 text-[#8a8a8a] text-[0.85rem] mt-3">
            <Briefcase size={14} className="text-gray-500" />
            <span className="font-semibold text-gray-300">
              {project.client || "Internal Client"}
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="text-left md:text-right shrink-0 flex flex-col items-start md:items-end gap-2">
          <div>
            <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block mb-2">
              Project Status
            </span>
            <span
              className={`inline-flex items-center gap-[6px] uppercase font-bold text-[0.7rem] px-[12px] py-[6px] rounded-[6px] border ${
                project.status === "completed"
                  ? "bg-[#182318] text-[#70d64d] border-[#70d64d]/30"
                  : project.status === "assigned"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  project.status === "completed"
                    ? "bg-[#70d64d]"
                    : project.status === "assigned"
                      ? "bg-blue-400"
                      : "bg-amber-400"
                }`}
              />
              {project.status === "completed"
                ? "Completed"
                : project.status === "assigned"
                  ? "In Progress"
                  : "Not Started"}
            </span>
          </div>
          <ShareButton
            variant="custom"
            className="bg-[#0c0c0e] hover:bg-[#1a1a22] border border-[#23232a] text-white py-[6px] px-[12px] rounded-[6px] text-[0.78rem] font-semibold flex items-center gap-[6px] transition-colors cursor-pointer mt-1"
            data={{ url: `${window.location.origin}/public-projects/${project.id}` }}
            options={{ preferNative: false, fallback: 'clipboard' }}
            customLabelIcons={{
              default: <Share2 size={13} />,
              success: <Check size={13} />,
              busy: <Loader2 size={13} />,
              error: <X size={13} />
            }}
            label="Share Project"
            successLabel="Copied!"
            busyLabel="Copying..."
            onSuccess={() => {
              toast.success('Public project link copied to clipboard!');
            }}
            onError={() => {
              toast.error('Failed to copy project link.');
            }}
          />
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-[#23232a]">
        {/* Budget */}
        <div className="flex items-start gap-3">
          <Wallet className="text-[#8a8a8a] mt-1" size={18} />
          <div>
            <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">
              Budget
            </span>
            <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
              {project.budget
                ? `₹${Number(project.budget).toLocaleString("en-IN")}`
                : "₹0"}
            </span>
          </div>
        </div>
        {/* Deadline */}
        <div className="flex items-start gap-3">
          <Calendar className="text-[#8a8a8a] mt-1" size={18} />
          <div>
            <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">
              Deadline
            </span>
            <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
              {fmtDate(project.end_date)}
            </span>
          </div>
        </div>
        {/* Posted On */}
        <div className="flex items-start gap-3">
          <Clock className="text-[#8a8a8a] mt-1" size={18} />
          <div>
            <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">
              Posted On
            </span>
            <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
              {fmtDate(project.created_at)}
            </span>
          </div>
        </div>
        {/* Applicants */}
        <div className="flex items-start gap-3">
          <Users className="text-[#8a8a8a] mt-1" size={18} />
          <div>
            <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">
              Applicants
            </span>
            <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
              {applications ? applications.length : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
