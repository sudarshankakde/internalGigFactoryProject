import React from "react";
import { FileText, Paperclip, UploadCloud, Eye } from "lucide-react";

export default function NoDuesCard({
  isAssigned,
  noDues,
  signMethod,
  setSignMethod,
  signatureFile,
  handleSignatureChange,
  signaturePreview,
  isSigning,
  handleSignNoDues,
  useSavedSignature,
  setUseSavedSignature,
  saveSignature,
  setSaveSignature,
  isPreviewing,
  handlePreviewOnDoc,
}) {
  if (!isAssigned || !noDues?.exists) return null;

  return (
    <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
      <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
        <FileText className="text-[#70d64d]" size={18} />
        <h3 className="text-white font-bold text-[1rem] m-0">
          No Dues Certificate
        </h3>
      </div>

      {noDues.certificate.status === "signed" ? (
        <div className="bg-[#0c0c0e] border border-[#70d64d]/20 rounded-[8px] p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="text-[#70d64d] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#70d64d]" />
              Signed &amp; Completed
            </span>
            <h4 className="text-white font-bold text-sm mt-1">
              Full &amp; Final Settlement Complete
            </h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Both parties have signed the certificate. A copy has been emailed to you.
            </p>
          </div>
          <a
            href={noDues.certificate.signed_doc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#70d64d] hover:bg-[#8ee67b] text-black font-bold rounded-[6px] px-4 py-2 text-xs text-decoration-none transition-colors shrink-0 flex items-center gap-1"
          >
            <Paperclip size={13} />
            Download Signed PDF
          </a>
        </div>
      ) : (
        <div className="bg-[#0c0c0e] border border-amber-500/20 rounded-[8px] p-5 space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-2 border-b border-[#1c1c24] pb-3">
            <div className="space-y-1">
              <span className="text-amber-500 font-bold text-[0.7rem] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Signature Required
              </span>
              <h4 className="text-white font-extrabold text-sm mt-1">
                Please sign the No Dues &amp; F&amp;F Settlement Certificate
              </h4>
            </div>
            <a
              href={noDues.certificate.unsigned_doc_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-gray-300 font-bold rounded-[4px] px-3 py-1.5 text-xs text-decoration-none transition-colors flex items-center gap-1"
            >
              <Paperclip size={12} />
              Download Draft to Review
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block uppercase font-bold tracking-[0.5px]">
                Amount Confirmed:
              </span>
              <span className="text-white font-extrabold text-sm block mt-0.5">
                ₹{Number(noDues.certificate.payment_amount).toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase font-bold tracking-[0.5px]">
                Date Confirmed:
              </span>
              <span className="text-white font-extrabold text-sm block mt-0.5">
                {new Date(noDues.certificate.payment_date).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short", year: "numeric" },
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase font-bold tracking-[0.5px]">
                Recipient:
              </span>
              <span className="text-white font-semibold block mt-0.5">
                {noDues.certificate.recipient_name}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase font-bold tracking-[0.5px]">
                PAN:
              </span>
              <span className="text-white font-semibold block mt-0.5">
                {noDues.certificate.pan_number || "N/A"}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSignNoDues}
            className="border-t border-[#1c1c24] pt-4 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-gray-400 text-xs font-semibold">
                Choose Signing Option:
              </span>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="signMethod"
                    checked={signMethod === "electronic"}
                    onChange={() => setSignMethod("electronic")}
                    className="accent-[#70d64d]"
                  />
                  Upload signature image (we will overlay it on PDF)
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="signMethod"
                    checked={signMethod === "manual"}
                    onChange={() => setSignMethod("manual")}
                    className="accent-[#70d64d]"
                  />
                  Print, sign physically, &amp; upload signed document
                </label>
              </div>
            </div>

            {signMethod === "electronic" && noDues?.saved_signature_url && (
              <div className="flex flex-col gap-2 p-3 bg-[#0c0c0e] border border-[#23232a] rounded-[8px]">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSavedSignature}
                    onChange={(e) => setUseSavedSignature(e.target.checked)}
                    className="accent-[#70d64d]"
                  />
                  Use my securely saved signature
                </label>
                {useSavedSignature && (
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

            {/* Render Upload area if manual mode OR if electronic mode and not using saved signature */}
            {(signMethod === "manual" || !useSavedSignature) && (
              <div className="flex flex-col gap-2">
                <span className="text-gray-400 text-xs font-semibold">
                  {signMethod === "electronic"
                    ? "Upload Signature Image *"
                    : "Upload Signed PDF/Image *"}
                </span>
                <div className="flex items-center justify-center flex-col gap-2 border border-dashed border-[#23232a] bg-[#0c0c0e] hover:border-[#70d64d]/30 rounded-[8px] p-6 cursor-pointer transition-colors relative min-h-[110px]">
                  <input
                    type="file"
                    accept={signMethod === "electronic" ? "image/*" : ".pdf,image/*"}
                    onChange={handleSignatureChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {signatureFile ? (
                    <div className="flex items-center gap-2 text-[#70d64d]">
                      <FileText size={20} />
                      <span className="text-xs font-bold truncate max-w-[240px]">
                        {signatureFile.name}
                      </span>
                      <span className="text-gray-500 text-[10px]">
                        ({(signatureFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-gray-400">
                      <UploadCloud size={20} className="text-gray-500" />
                      <span className="text-xs font-semibold text-white">
                        Click or drag file to upload
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {signMethod === "electronic"
                          ? "Supports PNG, JPG, JPEG"
                          : "Supports PDF, PNG, JPG, JPEG"}
                      </span>
                    </div>
                  )}
                </div>

                {signMethod === "electronic" && signatureFile && (
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer mt-1 bg-[#0c0c0e] border border-[#23232a] p-2.5 rounded-[6px]">
                    <input
                      type="checkbox"
                      checked={saveSignature}
                      onChange={(e) => setSaveSignature(e.target.checked)}
                      className="accent-[#70d64d]"
                    />
                    Save signature securely in system for future use
                  </label>
                )}
              </div>
            )}

            {signMethod === "electronic" && !useSavedSignature && signaturePreview && (
              <div className="flex flex-col gap-1.5 bg-[#121215] border border-[#23232a] rounded-[8px] p-4 items-center">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.5px]">
                  Signature Preview
                </span>
                <div className="bg-white p-2 rounded border border-gray-200 mt-1 max-w-[180px] h-[60px] flex items-center justify-center">
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              {signMethod === "electronic" && (useSavedSignature || signatureFile) && (
                <button
                  type="button"
                  onClick={handlePreviewOnDoc}
                  disabled={isPreviewing}
                  className="bg-transparent text-[#70d64d] border border-[#70d64d] font-bold rounded-[6px] px-5 py-2.5 text-xs cursor-pointer hover:bg-[#70d64d]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Eye size={13} />
                  {isPreviewing ? "Generating Preview..." : "Preview on Document"}
                </button>
              )}
              <button
                type="submit"
                disabled={isSigning || (signMethod === "electronic" ? (!useSavedSignature && !signatureFile) : !signatureFile)}
                className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-6 py-2.5 text-xs cursor-pointer hover:bg-[#8ee67b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigning ? "Signing & Sending..." : "Submit & Sign Certificate"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
