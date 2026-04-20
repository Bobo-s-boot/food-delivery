import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

export function About() {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-8 rounded-xl shadow-md prose prose-green max-w-none text-left">
      <ReactMarkdown>{t("about.content")}</ReactMarkdown>
    </div>
  );
}
