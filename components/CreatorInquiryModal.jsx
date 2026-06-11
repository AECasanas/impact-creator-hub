"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreatorInquiryModal({
  creatorProfileId,
  creatorSlug,
  creatorName,
  creatorFirstName,
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    brandName: "",
    contactName: "",
    contactEmail: "",
    campaignType: "",
    budgetRange: "",
    timeline: "",
    message: "",
  });

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus("");
    setErrorMessage("");

    if (!form.brandName.trim()) {
      setErrorMessage("Brand name is required.");
      return;
    }

    if (!form.contactName.trim()) {
      setErrorMessage("Your name is required.");
      return;
    }

    if (!form.contactEmail.trim()) {
      setErrorMessage("Email is required.");
      return;
    }

    if (!form.message.trim()) {
      setErrorMessage("Message is required.");
      return;
    }

    try {
      setSending(true);

      const payload = {
        creator_profile_id: creatorProfileId || null,
        creator_slug: creatorSlug,
        creator_name: creatorName,
        brand_name: form.brandName.trim(),
        contact_name: form.contactName.trim(),
        contact_email: form.contactEmail.trim(),
        campaign_type: form.campaignType,
        budget_range: form.budgetRange,
        timeline: form.timeline,
        message: form.message.trim(),
        status: "new",
      };

      const { error } = await supabase.from("brand_inquiries").insert(payload);

      if (error) {
        throw error;
      }

      setStatus("Inquiry sent. The creator can now review your message.");
      setForm({
        brandName: "",
        contactName: "",
        contactEmail: "",
        campaignType: "",
        budgetRange: "",
        timeline: "",
        message: "",
      });
    } catch (error) {
      console.warn("SEND INQUIRY ERROR:", error);

      setErrorMessage(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Something went wrong while sending your inquiry."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="workWithBtn"
        onClick={() => {
          setOpen(true);
          setStatus("");
          setErrorMessage("");
        }}
      >
        Contact
      </button>

      {open && (
        <div className="inquiryOverlay" role="dialog" aria-modal="true">
          <div className="inquiryModal">
            <button
              type="button"
              className="inquiryClose"
              onClick={() => setOpen(false)}
              aria-label="Close inquiry form"
            >
              ×
            </button>

            <p className="inquiryEyebrow">Brand inquiry</p>

            <h2>Work with {creatorFirstName || creatorName || "this creator"}</h2>

            <p className="inquiryIntro">
              Send a campaign idea, collaboration request, or partnership note.
              Your message will stay inside Impact Creator Hub.
            </p>

            <form className="inquiryForm" onSubmit={handleSubmit}>
              <label>
                Brand / company
                <input
                  value={form.brandName}
                  placeholder="Your brand name"
                  onChange={(event) =>
                    updateForm("brandName", event.target.value)
                  }
                />
              </label>

              <label>
                Your name
                <input
                  value={form.contactName}
                  placeholder="Your full name"
                  onChange={(event) =>
                    updateForm("contactName", event.target.value)
                  }
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={form.contactEmail}
                  placeholder="you@brand.com"
                  onChange={(event) =>
                    updateForm("contactEmail", event.target.value)
                  }
                />
              </label>

              <label>
                Campaign type
                <select
                  value={form.campaignType}
                  onChange={(event) =>
                    updateForm("campaignType", event.target.value)
                  }
                >
                  <option value="">Select type</option>
                  <option>Sponsored post</option>
                  <option>UGC content</option>
                  <option>Brand partnership</option>
                  <option>Event / appearance</option>
                  <option>Product review</option>
                  <option>Affiliate campaign</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Budget range
                <select
                  value={form.budgetRange}
                  onChange={(event) =>
                    updateForm("budgetRange", event.target.value)
                  }
                >
                  <option value="">Select range</option>
                  <option>Under $500</option>
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $2,500</option>
                  <option>$2,500 - $5,000</option>
                  <option>$5,000+</option>
                  <option>Not sure yet</option>
                </select>
              </label>

              <label>
                Timeline
                <select
                  value={form.timeline}
                  onChange={(event) => updateForm("timeline", event.target.value)}
                >
                  <option value="">Select timeline</option>
                  <option>ASAP</option>
                  <option>This month</option>
                  <option>Next month</option>
                  <option>Next 3 months</option>
                  <option>Flexible</option>
                </select>
              </label>

              <label className="wide">
                Message
                <textarea
                  value={form.message}
                  placeholder="Tell the creator what you are looking for, the campaign goal, deliverables, and anything they should know."
                  onChange={(event) => updateForm("message", event.target.value)}
                />
              </label>

              {status && <p className="inquirySuccess">{status}</p>}
              {errorMessage && <p className="inquiryError">{errorMessage}</p>}

              <div className="inquiryActions">
                <button
                  type="button"
                  className="inquiryCancel"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="inquirySubmit" disabled={sending}>
                  {sending ? "Sending..." : "Send inquiry"}
                </button>
              </div>
            </form>
          </div>

          <style jsx>{`
            .inquiryOverlay {
              position: fixed;
              inset: 0;
              z-index: 100;
              display: grid;
              place-items: center;
              background: rgba(2, 6, 23, 0.64);
              padding: 22px;
              backdrop-filter: blur(12px);
            }

            .inquiryModal {
              position: relative;
              width: min(720px, 100%);
              max-height: min(86vh, 920px);
              overflow: auto;
              border: 1px solid rgba(16, 23, 47, 0.12);
              border-radius: 30px;
              background:
                radial-gradient(
                  circle at 92% 10%,
                  color-mix(in srgb, var(--accent, #00e8f0) 16%, transparent),
                  transparent 28%
                ),
                #fffaf7;
              color: #10172f;
              padding: 30px;
              box-shadow: 0 30px 100px rgba(0, 0, 0, 0.28);
            }

            .inquiryClose {
              position: absolute;
              top: 16px;
              right: 16px;
              width: 36px;
              height: 36px;
              border: 0;
              border-radius: 50%;
              background: rgba(16, 23, 47, 0.08);
              color: #10172f;
              cursor: pointer;
              font-size: 1.5rem;
              line-height: 1;
            }

            .inquiryEyebrow {
              margin: 0;
              color: var(--accent, #00e8f0);
              font-size: 0.72rem;
              font-weight: 950;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }

            .inquiryModal h2 {
              margin: 10px 0 0;
              font-family: Georgia, "Times New Roman", serif;
              font-size: clamp(2rem, 6vw, 3.2rem);
              letter-spacing: -0.06em;
              line-height: 0.98;
            }

            .inquiryIntro {
              margin: 14px 0 0;
              max-width: 560px;
              color: rgba(16, 23, 47, 0.62);
              line-height: 1.6;
              font-weight: 700;
            }

            .inquiryForm {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 14px;
              margin-top: 24px;
            }

            label {
              display: grid;
              gap: 7px;
              font-size: 0.82rem;
              font-weight: 950;
              color: #10172f;
            }

            .wide {
              grid-column: span 2;
            }

            input,
            select,
            textarea {
              width: 100%;
              min-height: 46px;
              border: 1px solid rgba(16, 23, 47, 0.12);
              border-radius: 14px;
              background: rgba(255, 255, 255, 0.78);
              color: #10172f;
              font: inherit;
              font-weight: 800;
              outline: none;
              padding: 0 13px;
            }

            textarea {
              min-height: 130px;
              padding: 13px;
              resize: vertical;
            }

            input:focus,
            select:focus,
            textarea:focus {
              border-color: var(--accent, #00e8f0);
              box-shadow: 0 0 0 4px
                color-mix(in srgb, var(--accent, #00e8f0) 20%, transparent);
            }

            .inquirySuccess,
            .inquiryError {
              grid-column: span 2;
              margin: 0;
              font-size: 0.86rem;
              font-weight: 900;
              line-height: 1.45;
            }

            .inquirySuccess {
              color: #00a854;
            }

            .inquiryError {
              color: #c0392b;
            }

            .inquiryActions {
              grid-column: span 2;
              display: flex;
              justify-content: flex-end;
              gap: 10px;
              margin-top: 4px;
            }

            .inquiryCancel,
            .inquirySubmit {
              min-height: 42px;
              border: 0;
              border-radius: 999px;
              cursor: pointer;
              font: inherit;
              font-weight: 950;
              padding: 0 18px;
            }

            .inquiryCancel {
              background: rgba(16, 23, 47, 0.08);
              color: #10172f;
            }

            .inquirySubmit {
              background: var(--accent, #00e8f0);
              color: #020617;
            }

            .inquirySubmit:disabled {
              opacity: 0.62;
              cursor: not-allowed;
            }

            @media (max-width: 640px) {
              .inquiryModal {
                padding: 24px;
              }

              .inquiryForm {
                grid-template-columns: 1fr;
              }

              .wide,
              .inquirySuccess,
              .inquiryError,
              .inquiryActions {
                grid-column: span 1;
              }

              .inquiryActions {
                flex-direction: column-reverse;
              }

              .inquiryCancel,
              .inquirySubmit {
                width: 100%;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}