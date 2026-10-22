import { useRef, useState } from "react";
import { hiringLanguages } from "../../../../../../../shared/hiring.mjs";
import { saveHiringImage } from "../../../../../api/hiringMedia";
import { VacancyImage } from "../../../../../features/engagement/components/VacancyImage";
import { HiringHint } from "../HiringPrimitives";
import { useHiringNotification } from "../../HiringNotificationContext";

export function VacancyImagesStep({
  form,
  pending,
  input,
  update,
  setUploading,
  updateImage,
  updateContent,
}) {
  return (
    <>
          <fieldset className="hiring-image-choice"><legend>How should images be used?</legend>
            {[["shared", "Use one image for card and detail"], ["separate", "Use separate images"]].map(([value, label]) => <label key={value}><input type="radio" name="image-mode" value={value} checked={form.image_mode === value} onChange={() => update("image_mode", value)} disabled={pending} />{label}</label>)}
          </fieldset>
          <p className="hiring-wizard-help">Images are optional. Upload JPG, PNG or WebP, up to 2 MB. A vacancy without an image uses a text-only card.</p>
          <div className="hiring-media-grid">
            <ImageUpload title={form.image_mode === "shared" ? "Card and detail image" : "Card image"} id={form.images.card} disabled={pending}
              onPendingChange={setUploading} onChange={(id) => updateImage("card", id)} />
            {form.image_mode === "separate" && <ImageUpload title="Detail image" id={form.images.detail} disabled={pending} onPendingChange={setUploading} onChange={(id) => updateImage("detail", id)} />}
          </div>
          <div className="hiring-form-grid">
            {hiringLanguages.map((language) => <div key={language}>
              {form.images.card && input("content." + language + ".image_alt", "Card image description — " + (language === "en" ? "English" : "Ukrainian") + " *", form.content[language].image_alt, (value) => updateContent(language, "image_alt", value), { maxLength: 200, helper: "Describe what the image shows in this language. Screen readers use this description; it is not a visible caption. Up to 200 characters." })}
              {form.image_mode === "separate" && form.images.detail && input("content." + language + ".detail_image_alt", "Detail image description — " + (language === "en" ? "English" : "Ukrainian") + " *", form.content[language].detail_image_alt, (value) => updateContent(language, "detail_image_alt", value), { maxLength: 200, helper: "Describe the full-page image in this language for people using screen readers. Up to 200 characters." })}
            </div>)}
          </div>
        </>
  );
}

function ImageUpload({ title, id, onChange, onPendingChange, disabled }) {
  const notify = useHiringNotification();
  const [pending, setPending] = useState(false), [error, setError] = useState("");
  const fileInput = useRef(null);
  return <section className="hiring-upload"><div className="hiring-field__label-row"><h3>{title}</h3><HiringHint id={"upload-" + title.replaceAll(" ", "-")} label={title}>Choose your own JPG, PNG or WebP, up to 2 MB. This image is saved in this browser and appears in the view named here. No external image link is needed.</HiringHint></div>
    {id && <VacancyImage id={id} alt={title} onError={setError} />}
    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label={"Upload " + title.toLowerCase()} disabled={disabled || pending} onChange={async (event) => {
      const file = event.target.files?.[0]; if (!file) return;
      setPending(true); onPendingChange(true); setError("");
      try { const asset = await saveHiringImage(file); onChange(asset); }
      catch (failure) { setError(failure.message); notify?.({ title: "Image could not be uploaded", description: failure.message, tone: "error" }); }
      finally { setPending(false); onPendingChange(false); if (fileInput.current) fileInput.current.value = ""; }
    }} />
    {pending && <p role="status">Saving image…</p>}
    {error && <p role="alert" className="hiring-field__error">{error}</p>}
    {id && <button type="button" disabled={disabled || pending} onClick={() => { onChange(null); setError(""); }}>Remove image</button>}
  </section>;
}
