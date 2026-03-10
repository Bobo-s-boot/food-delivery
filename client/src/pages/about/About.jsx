import ReactMarkdown from "react-markdown";
import { aboutContent } from "./const";

export function About() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md prose prose-green max-w-none text-left">
      <ReactMarkdown>{aboutContent}</ReactMarkdown>
    </div>
  );
}
