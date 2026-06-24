import React, { useState } from "react";
import { X, Wallet, AlertTriangle, UploadCloud, FileText } from "lucide-react";
import { api } from "../../../utils/api";
import { toast } from "react-toastify";

export default function RecordPaymentModal({
  selectedPayment,
  assignedAmount,
  totalPaid,
  remainingBidBalance,
  onClose,
  onSuccess,
}) {
  const [paymentAmount, setPaymentAmount] = useState(
    selectedPayment.amount ? selectedPayment.amount.toString() : "",
  );
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [isProofDragActive, setIsProofDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProofDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsProofDragActive(true);
    } else if (e.type === "dragleave") {
      setIsProofDragActive(false);
    }
  };

  const handleProofDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProofDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProofFile(e.dataTransfer.files[0]);
    }
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      toast.error("Transaction reference is required.");
      return;
    }
    const formData = new FormData();
    formData.append("payment_method", paymentMethod);
    formData.append("transaction_reference", transactionRef);
    formData.append("remarks", paymentRemarks);
    if (paymentAmount) {
      formData.append("amount", paymentAmount);
    }
    if (proofFile) {
      formData.append("proof", proofFile);
    }

    setIsSubmitting(true);
    try {
      await api.postFile(
        `/projects/payments/${selectedPayment.id}/pay`,
        formData,
      );
      toast.success("Milestone payment recorded successfully!");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Record Milestone Payment
            </h3>
            <p className="text-gray-500 text-[0.75rem] m-0 mt-1">
              Enter payment release and transaction details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white border-none bg-transparent cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={handleRecordPaymentSubmit}
          className="p-5 flex flex-col gap-4 m-0 overflow-y-auto flex-1"
        >
          {assignedAmount !== null && (
            <div className="bg-[#1f1d18] border border-amber-500/20 px-4 py-3.5 rounded-[10px] text-[0.78rem] flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <AlertTriangle size={15} />
                <span>Contract / Bid Budget Reference</span>
              </div>
              <div className="text-gray-300 flex flex-col gap-1 mt-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Accepted Bid:</span>
                  <span className="font-semibold text-white">
                    ₹{assignedAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Paid So Far:</span>
                  <span className="font-semibold text-white">
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-800 pt-1 mt-1">
                  <span className="text-gray-500 font-bold">
                    Remaining Bid Budget:
                  </span>
                  <span className="font-black text-[#70d64d]">
                    ₹{remainingBidBalance.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 bg-[#182318] border border-[#70d64d]/20 px-4 py-3.5 rounded-[10px]">
            <div className="bg-[#70d64d]/10 p-2 rounded-[8px]">
              <Wallet className="text-[#70d64d]" size={20} />
            </div>
            <div className="flex-1">
              <span className="text-gray-400 text-[0.75rem] uppercase font-bold tracking-[0.5px] block">
                Default Milestone Budget
              </span>
              <span className="text-[1.15rem] text-[#70d64d] font-bold leading-none block mt-1">
                ₹{Number(selectedPayment.amount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Payment Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount to pay..."
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors cursor-pointer"
            >
              <option value="bank_transfer">
                Bank Transfer (NEFT/RTGS/IMPS)
              </option>
              <option value="upi">UPI (GPay/PhonePe/etc)</option>
              <option value="cash">Cash Payment</option>
              <option value="card">Credit/Debit Card</option>
              <option value="other">Other Payment Mode</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Transaction Reference ID *
            </label>
            <input
              type="text"
              required
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="Enter transaction reference code..."
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Payment Remarks
            </label>
            <textarea
              value={paymentRemarks}
              onChange={(e) => setPaymentRemarks(e.target.value)}
              placeholder="Add optional notes, remarks or details..."
              rows={3}
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none resize-none focus:border-[#70d64d] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Payment Proof / Receipt{" "}
              <span className="text-gray-600 font-normal">(Optional)</span>
            </label>
            <label
              className={`flex items-center justify-center flex-col gap-2 border border-dashed rounded-[8px] p-5 cursor-pointer transition-colors group ${
                isProofDragActive
                  ? "border-[#b5ff14] bg-[#b5ff14]/5"
                  : "bg-[#0c0c0e] border-[#23232a] hover:border-[#70d64d]/40"
              }`}
              onDragEnter={handleProofDrag}
              onDragOver={handleProofDrag}
              onDragLeave={handleProofDrag}
              onDrop={handleProofDrop}
            >
              <input
                type="file"
                onChange={(e) => setProofFile(e.target.files[0] || null)}
                className="hidden"
              />
              {proofFile ? (
                <div className="flex items-center gap-2 text-[#70d64d]">
                  <FileText size={20} />
                  <span className="text-[0.82rem] font-bold truncate max-w-[240px]">
                    {proofFile.name}
                  </span>
                  <span className="text-gray-500 text-[0.72rem]">
                    ({(proofFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <UploadCloud
                    size={24}
                    className="text-gray-500 group-hover:text-gray-300 transition-colors"
                  />
                  <span className="text-gray-400 text-[0.8rem] font-medium group-hover:text-gray-200 transition-colors">
                    Select payment receipt or PDF proof
                  </span>
                  <span className="text-gray-600 text-[0.7rem]">
                    PDF, JPG, PNG, WEBP
                  </span>
                </>
              )}
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#23232a] pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border border-[#23232a] text-gray-300 hover:text-white rounded-[6px] px-5 py-2.5 text-[0.8rem] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-6 py-2.5 text-[0.8rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
            >
              {isSubmitting ? "Recording..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
