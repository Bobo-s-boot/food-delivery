import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getHiringImage } from "../../../api/hiringMedia";

export function VacancyImage({ id, alt = "", className, onError }) {
  const [asset, setAsset] = useState(null);
  const [failed, setFailed] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (!id || id.startsWith("/img/engagement/")) return;
    let active = true, url;
    getHiringImage(id).then((record) => {
      if (!active) return;
      if (!record) { setFailed(id); onError?.("The uploaded image is missing from this browser."); return; }
      url = URL.createObjectURL(record.file);
      setAsset({ id, url });
    }).catch(() => { if (active) { setFailed(id); onError?.("The uploaded image could not be loaded."); } });
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [id, onError]);
  if (!id) return null;
  if (id.startsWith("/img/engagement/")) return <img src={id} alt={alt} className={className} loading="lazy" />;
  if (failed === id) return <span className="eng-image-pending">{t("engagement.hiring.imageUnavailable")}</span>;
  if (asset?.id !== id) return <span className="eng-image-pending" role="status">{t("engagement.hiring.imageLoading")}</span>;
  return <img src={asset.url} alt={alt} className={className} loading="lazy" />;
}
