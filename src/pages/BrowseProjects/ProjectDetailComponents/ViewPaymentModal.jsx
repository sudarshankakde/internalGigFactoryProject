import React from "react";
import { X, Wallet, Paperclip } from "lucide-react";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function ViewPaymentModal({
  paymentDetailsToView,
  viewingMilestoneTitle,
  onClose,
}) {
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-[4px] z-[800]"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[500px] max-h-[90vh] bg-[#121215] border border-[#23232a] rounded-[16px] shadow-2xl z-[801] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#23232a] bg-[#0c0c0e] shrink-0">
          <div>
            <h3 className="text-white font-extrabold text-[1.1rem] m-0">
              Payment Receipt
            </h3>
            <p className="text-gray-500 text-[0.75rem] m-0 mt-1">
              Transaction proof and release logs for milestone.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white border-none bg-transparent cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4 m-0 overflow-y-auto flex-1 text-[0.85rem] text-gray-300">
          {/* Milestone Details */}
          <div>
            <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px]">
              Milestone
            </span>
            <span className="text-white font-bold text-[0.95rem] block mt-0.5">
              {viewingMilestoneTitle}
            </span>
          </div>

          {/* Amount Released */}
          <div className="flex items-center gap-3 bg-[#182318] border border-[#70d64d]/20 px-4 py-3 rounded-[10px]">
            <div className="bg-[#70d64d]/10 p-2 rounded-[8px]">
              <Wallet className="text-[#70d64d]" size={18} />
            </div>
            <div className="flex-1">
              <span className="text-gray-400 text-[0.7rem] uppercase font-bold tracking-[0.5px] block">
                Amount Paid
              </span>
              <span className="text-[1.25rem] text-[#70d64d] font-black leading-none block mt-0.5">
                ₹{Number(paymentDetailsToView.amount).toLocaleString("en-IN")}
              </span>
            </div>
            <span className="bg-[#70d64d]/10 text-[#70d64d] border border-[#70d64d]/30 text-[0.65rem] font-bold px-[8px] py-[3px] rounded-[4px] uppercase tracking-wider">
              Paid
            </span>
          </div>

          {/* Info Fields Grid */}
          <div className="grid grid-cols-2 gap-4 bg-[#0c0c0e] border border-[#23232a] p-4 rounded-[10px]">
            <div>
              <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px] block">
                Method
              </span>
              <span className="text-white font-semibold block mt-0.5 capitalize">
                {paymentDetailsToView.payment_method?.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px] block">
                Ref Number
              </span>
              <span className="text-white font-mono font-semibold block mt-0.5 select-all">
                {paymentDetailsToView.transaction_reference}
              </span>
            </div>
            <div className="col-span-2 border-t border-[#1a1a22] pt-3 mt-1">
              <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px] block">
                Released On
              </span>
              <span className="text-white font-semibold block mt-0.5">
                {fmtDate(paymentDetailsToView.payment_date)}
              </span>
            </div>
          </div>

          {/* Remarks */}
          {paymentDetailsToView.remarks && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px]">
                Payment Remarks
              </span>
              <div className="bg-[#0c0c0e] border border-[#23232a] p-3 rounded-[8px] text-gray-400 italic">
                "{paymentDetailsToView.remarks}"
              </div>
            </div>
          )}

          {/* Receipt Upload / Proofs */}
          {paymentDetailsToView.milestone_payment_proofs &&
          paymentDetailsToView.milestone_payment_proofs.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px]">
                Receipt / Proof Attachment
              </span>
              <div className="flex flex-col gap-2">
                {paymentDetailsToView.milestone_payment_proofs.map((proof) => {
                  const isImg =
                    proof.file_type?.startsWith("image/") ||
                    ["png", "jpg", "jpeg", "gif", "webp"].includes(
                      proof.file_name.split(".").pop().toLowerCase(),
                    );
                  return (
                    <div
                      key={proof.id}
                      className="flex flex-col gap-2 bg-[#0c0c0e] border border-[#23232a] p-3 rounded-[8px]"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip size={14} className="text-gray-500 shrink-0" />
                          <span
                            className="text-white text-[0.8rem] font-semibold truncate"
                            title={proof.file_name}
                          >
                            {proof.file_name}
                          </span>
                        </div>
                        <a
                          href={proof.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-gray-300 hover:text-white rounded-[6px] px-3 py-1.5 text-[0.7rem] font-bold cursor-pointer transition-colors no-underline shrink-0"
                        >
                          View File
                        </a>
                      </div>
                      {isImg && (
                        <div className="mt-1 border border-[#23232a] rounded-[6px] overflow-hidden bg-[#000] flex justify-center max-h-[180px]">
                          <img
                            src={proof.file_url}
                            alt={proof.file_name}
                            className="object-contain max-w-full max-h-[180px]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-[0.75rem] italic">
              No receipt file attached.
            </div>
          )}

          <div className="flex justify-end border-t border-[#23232a] pt-4 mt-2">
            <button
              onClick={onClose}
              className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-gray-300 hover:text-white rounded-[6px] px-5 py-2 text-[0.78rem] font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
