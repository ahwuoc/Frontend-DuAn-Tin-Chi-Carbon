import { FileText, Leaf } from "lucide-react";

export const ProjectIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "forestry":
      return <Leaf className="w-6 h-6 text-green-600" />;
    case "renewable":
      return <FileText className="w-6 h-6 text-blue-600" />;
    case "conservation":
      return <FileText className="w-6 h-6 text-yellow-600" />;
    case "waste":
      return <FileText className="w-6 h-6 text-purple-600" />;
    default:
      return <FileText className="w-6 h-6 text-blue-600" />;
  }
};
