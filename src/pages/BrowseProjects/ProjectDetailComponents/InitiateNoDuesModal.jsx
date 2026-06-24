import React, { useState } from "react";
import { X, FileText, UploadCloud } from "lucide-react";
import { api } from "../../../utils/api";
import { toast } from "react-toastify";

export default function InitiateNoDuesModal({
  projectId,
  noDues,
  onClose,
  onSuccess,
}) {
  const getInitialFormState = () => {
    const hasSavedSig = !!noDues?.saved_signature_url;
    if (noDues && noDues.prefill) {
      return {
        recipient_name: noDues.prefill.recipient_name || "",
        pan_number: noDues.prefill.pan_number || "",
        payment_amount: noDues.prefill.payment_amount || "",
        payment_date: noDues.prefill.payment_date
          ? new Date(noDues.prefill.payment_date).toISOString().split("T")[0]
          : "",
        signature: null,
        use_saved_signature: hasSavedSig,
        save_signature: false,
      };
    } else if (noDues && noDues.certificate) {
      return {
        recipient_name: noDues.certificate.recipient_name || "",
        pan_number: noDues.certificate.pan_number || "",
        payment_amount: noDues.certificate.payment_amount || "",
        payment_date: noDues.certificate.payment_date
          ? new Date(noDues.certificate.payment_date).toISOString().split("T")[0]
          : "",
        signature: null,
        use_saved_signature: hasSavedSig,
        save_signature: false,
      };
    }
    return {
      recipient_name: "",
      pan_number: "",
      payment_amount: "",
      payment_date: "",
      signature: null,
      use_saved_signature: hasSavedSig,
      save_signature: false,
    };
  };

  const [form, setForm] = useState(getInitialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNoDuesSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipient_name || !form.payment_amount || !form.payment_date) {
      toast.error("Recipient Name, Payment Amount, and Date are required.");
      return;
    }

    const formData = new FormData();
    formData.append("recipient_name", form.recipient_name);
    formData.append("pan_number", form.pan_number);
    formData.append("payment_amount", form.payment_amount);
    formData.append("payment_date", form.payment_date);
    formData.append("use_saved_signature", form.use_saved_signature);
    formData.append("save_signature", form.save_signature);
    if (form.signature) {
      formData.append("signature", form.signature);
    }

    setIsSubmitting(true);
    try {
      await api.postFile(`/projects/${projectId}/no-dues/initiate`, formData);
      toast.success("No Dues Certificate process initiated!");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to initiate No Dues process.");
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
              Initiate No Dues Certificate
            </h3>
            <p className="text-gray-500 text-[0.75rem] m-0 mt-1">
              Confirm recipient details and release amount.
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
          onSubmit={handleNoDuesSubmit}
          className="p-5 flex flex-col gap-4 m-0 overflow-y-auto flex-1"
        >
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Recipient Legal Name *
            </label>
            <input
              type="text"
              required
              value={form.recipient_name}
              onChange={(e) =>
                setForm({ ...form, recipient_name: e.target.value })
              }
              placeholder="Enter recipient full legal name..."
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Recipient PAN Number
            </label>
            <input
              type="text"
              value={form.pan_number}
              onChange={(e) =>
                setForm({ ...form, pan_number: e.target.value })
              }
              placeholder="Enter recipient PAN card number..."
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Payment Release Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={form.payment_amount}
              onChange={(e) =>
                setForm({ ...form, payment_amount: e.target.value })
              }
              placeholder="Enter total finalized amount..."
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Payment Release Date *
            </label>
            <input
              type="date"
              required
              value={form.payment_date}
              onChange={(e) =>
                setForm({ ...form, payment_date: e.target.value })
              }
              className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-[0.78rem] font-semibold">
              Your Authorized Signature{" "}
              <span className="text-gray-600 font-normal">(Optional)</span>
            </label>

            {noDues?.saved_signature_url && (
              <div className="flex flex-col gap-2 p-3 bg-[#0c0c0e] border border-[#23232a] rounded-[8px]">
                <label className="flex items-center gap-2 text-[0.8rem] text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.use_saved_signature}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        use_saved_signature: e.target.checked,
                      })
                    }
                    className="accent-[#70d64d]"
                  />
                  Use my securely saved signature
                </label>
                {form.use_saved_signature && (
                  <div className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-[6px] max-w-[160px] h-[55px] mx-auto justify-center border border-gray-200 mt-1">
                    <img
                      src={noDues.saved_signature_url}
                      alt="Saved Signature"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {!form.use_saved_signature && (
              <>
                <div className="flex items-center justify-center flex-col gap-2 border border-dashed border-[#23232a] bg-[#0c0c0e] hover:border-[#70d64d]/40 rounded-[8px] p-5 cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        signature: e.target.files[0] || null,
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {form.signature ? (
                    <div className="flex items-center gap-2 text-[#70d64d]">
                      <FileText size={20} />
                      <span className="text-[0.82rem] font-bold truncate max-w-[240px]">
                        {form.signature.name}
                      </span>
                      <span className="text-gray-500 text-[0.72rem]">
                        ({(form.signature.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-gray-400">
                      <UploadCloud size={20} className="text-gray-500" />
                      <span className="text-[0.75rem] font-semibold text-white">
                        Click or drag signature image
                      </span>
                      <span className="text-[0.68rem] text-gray-500">
                        Supports PNG, JPG, JPEG
                      </span>
                    </div>
                  )}
                </div>

                {form.signature && (
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer mt-1 bg-[#0c0c0e] border border-[#23232a] p-2.5 rounded-[6px]">
                    <input
                      type="checkbox"
                      checked={form.save_signature}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          save_signature: e.target.checked,
                        })
                      }
                      className="accent-[#70d64d]"
                    />
                    Save signature securely in system for future use
                  </label>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-[#23232a] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#1a1a20] hover:bg-[#252530] border border-[#2d2d38] text-gray-300 hover:text-white rounded-[6px] px-5 py-2.5 text-[0.78rem] font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-5 py-2.5 text-[0.78rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
            >
              {isSubmitting ? "Generating..." : "Initiate No Dues"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
