import React from "react";
import { Link } from "react-router-dom";
import { Award, Users, ExternalLink } from "lucide-react";
import { CompletionBar } from "../../../components/AdminShared";

export default function AdminProjectSidebar({ project, assignments }) {
  return (
    <div className="flex flex-col gap-[20px]">
      {/* Overall Progress Card */}
      <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
        <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
          <Award className="text-[#70d64d]" size={18} />
          <h3 className="text-white font-bold text-[1rem] m-0">
            Overall Progress
          </h3>
        </div>
        <div className="mb-4">
          <CompletionBar
            value={project.progress_percentage || 0}
            label="Completion"
          />
        </div>
        <p className="text-gray-500 text-[0.75rem] m-0 mt-2 leading-relaxed">
          This progress bar indicates the current stage of the project based on
          completed milestones.
        </p>
      </div>

      {/* Assigned Members Card */}
      <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
        <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
          <Users className="text-[#70d64d]" size={18} />
          <h3 className="text-white font-bold text-[1rem] m-0">
            Assigned Members
          </h3>
        </div>
        {assignments.length === 0 ? (
          <p className="text-gray-500 text-[0.78rem] m-0 italic">
            No assigned members yet. Review bids under Bids / Applications card.
          </p>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {assignments.map((as) => (
              <div
                key={as.id}
                className="flex flex-col gap-1 border-b border-[#1a1a22] pb-2 last:border-none last:pb-0"
              >
                {as.assigned_to ? (
                  <Link
                    to={`/admin/users/${as.assigned_to.id}/profile?from=Assigned+Project`}
                    className="text-white hover:text-[#70d64d] font-semibold text-[0.85rem] flex items-center gap-1.5 transition-colors no-underline"
                  >
                    {as.assigned_to.full_name}
                    <ExternalLink size={12} className="text-gray-400" />
                  </Link>
                ) : (
                  <span className="text-white font-semibold text-[0.85rem]">
                    Unknown Member
                  </span>
                )}
                <span className="text-[#8a8a8a] text-[0.75rem]">
                  {as.assigned_to?.email || "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
