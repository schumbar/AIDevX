import {
  FileJson,
  FileType,
  FileCode,
  FileCss,
  FileHtml,
  FileText,
  Package,
  FileCode2
} from "lucide-react";

export const EXTENSION_ICON_MAP: Record<string, React.ReactNode> = {
  js: <FileCode size={16} />,
  ts: <FileType size={16} />,
  py: <FileCode2 size={16} />,
  css: <FileCss size={16} />,
  json: <FileJson size={16} />,
  npmignore: <Package size={16} />,
  html: <FileHtml size={16} />,
  md: <FileText size={16} />,
};
