import React from "react";
import { FileText, Paperclip } from "lucide-react";

export default function AdminNoDuesCard({
  activeAssignment,
  noDues,
  onInitiateNoDues,
}) {
  if (!activeAssignment) return null;

  return (
    <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px] flex flex-col gap-[16px]">
      <div className="flex justify-between items-center border-b border-[#23232a] pb-3">
        <div className="flex items-center gap-[10px]">
          <FileText className="text-[#70d64d]" size={18} />
          <h2 className="text-white font-bold text-[1rem] m-0">
            No Dues Certificate
          </h2>
        </div>
        {!noDues?.exists && (
          <button
            onClick={onInitiateNoDues}
            className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-[14px] py-[7px] text-[0.8rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
          >
            Initiate Certificate
          </button>
        )}
      </div>

      {noDues?.exists ? (
        <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] flex flex-col gap-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className="text-[#8a8a8a] text-[0.65rem] font-bold uppercase block">
                Recipient
              </span>
              <span className="text-white font-semibold text-sm mt-1 block">
                {noDues.certificate.recipient_name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#8a8a8a] text-[0.65rem] font-bold uppercase block">
                Amount Released
              </span>
              <span className="text-[#70d64d] font-bold text-sm mt-1 block">
                ₹
                {Number(noDues.certificate.payment_amount).toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-[#1a1a22] pt-3 flex-wrap gap-2">
            <div>
              <span className="text-[#8a8a8a] text-[0.65rem] font-bold uppercase block">
                Certificate Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase mt-1 ${
                  noDues.certificate.status === "signed"
                    ? "text-[#70d64d]"
                    : "text-amber-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    noDues.certificate.status === "signed"
                      ? "bg-[#70d64d]"
                      : "bg-amber-500"
                  }`}
                />
                {noDues.certificate.status === "signed"
                  ? "Signed & Completed"
                  : "Pending Recipient Signature"}
              </span>
            </div>

            <div className="flex gap-2">
              {noDues.certificate.status === "pending_signature" && (
                <button
                  onClick={onInitiateNoDues}
                  className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-gray-300 font-bold rounded-[6px] px-3 py-1.5 text-xs cursor-pointer transition-colors"
                >
                  Re-initiate / Edit
                </button>
              )}

              <a
                href={
                  noDues.certificate.status === "signed"
                    ? noDues.certificate.signed_doc_url
                    : noDues.certificate.unsigned_doc_url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#70d64d]/10 hover:bg-[#70d64d]/20 text-[#70d64d] border border-[#70d64d]/30 font-bold rounded-[6px] px-3 py-1.5 text-xs text-center cursor-pointer transition-colors no-underline flex items-center gap-1"
              >
                <Paperclip size={12} />
                {noDues.certificate.status === "signed"
                  ? "Download Signed"
                  : "Download Draft"}
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] text-center text-gray-500 text-[0.82rem] italic">
          No Dues Certificate has not been initiated for this completed/assigned
          project.
        </div>
      )}
    </div>
  );
}
