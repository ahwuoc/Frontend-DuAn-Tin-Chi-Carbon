"use client";
import ProjectsList from "@/components/dashboard/projects-list";
import { useLanguage } from "@/context/language-context";
import projectsPageTranslations from "./langauge-page";

export default function ProjectsPage() {
  const { language } = useLanguage();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {projectsPageTranslations.pageTitle[language]}
        </h1>
        <p className="text-gray-600">
          {projectsPageTranslations.pageDescription[language]}
        </p>
      </div>
      <ProjectsList />
    </div>
  );
}
