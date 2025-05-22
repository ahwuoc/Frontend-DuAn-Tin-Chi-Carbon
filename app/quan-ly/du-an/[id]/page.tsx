// src/app/admin/projects-carbon/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  uploadToCloudinary,
  formatDateUtil,
  getUserFromLocalStorage,
} from "@/app/utils/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Leaf,
  MapPin,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  FileUp,
  FileBadge,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context"; // Import useLanguage hook

// NHẬP CÁC KIỂU DỮ LIỆU CƠ BẢN
import {
  apiProjects,
  IProject,
  IProjectDocument,
  IKmlFile,
  IActivity,
} from "@/app/fetch/fetch.projects";
import { ProjectIcon } from "./_components";
import {
  ProjectStatus,
  getStatusText,
  getStatusBadge,
  getProjectTypeText, // Keeping these for consistency, though getStatusBadge/getProjectTypeText should probably be translated
} from "@/app/components/projects/project";
import projectDetailPageTranslations from "./language-page";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage(); // Get current language

  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileTypeToUpload, setFileTypeToUpload] = useState<
    "landDocument" | "kmlFile"
  >("landDocument");

  // These might be better to be translated directly if used as labels/strings
  const projectStatusOrder: ProjectStatus[] = [
    "surveying",
    "designing",
    "verifying",
    "implementing",
    "credit_issuing",
    "trading",
  ];

  const fetchProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await apiProjects.getProject(id);
      if (response.status === 200 && response.payload) {
        setProject(response.payload as IProject);
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải dự án:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      console.log("Đã chọn tệp:", event.target.files[0]);
      setSelectedFile(event.target.files[0]);
      setUploadError(null);
      setUploadSuccess(false);
    } else {
      console.log("Không có tệp nào được chọn hoặc đã xóa tệp.");
      setSelectedFile(null);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile || !project?._id) {
      setUploadError(
        projectDetailPageTranslations.documentsTab.uploadNewFileCard
          .uploadError[language],
      );
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const fileUrl = await uploadToCloudinary(selectedFile);
      const user = getUserFromLocalStorage();
      const userId = user?.userId;

      if (fileTypeToUpload === "landDocument") {
        const newDocument: IProjectDocument = {
          name: selectedFile.name,
          url: fileUrl,
          type: selectedFile.type || "unknown",
          createdAt: new Date().toISOString(),
          userId: userId,
        };
        const updatedLandDocuments = project.landDocuments
          ? [...project.landDocuments, newDocument]
          : [newDocument];

        const response = await apiProjects.updateProject(project._id, {
          landDocuments: updatedLandDocuments,
        });

        if (response && response.payload) {
          setProject((prevProject) => ({
            ...(prevProject as IProject),
            landDocuments:
              (response.payload as IProject).landDocuments ||
              updatedLandDocuments,
          }));
          setUploadSuccess(true);
          setSelectedFile(null);
          alert(
            projectDetailPageTranslations.documentsTab.uploadNewFileCard
              .uploadSuccessMessage[language],
          );
        } else {
          setUploadError(
            projectDetailPageTranslations.documentsTab.uploadNewFileCard
              .updateProjectError[language],
          );
        }
      } else if (fileTypeToUpload === "kmlFile") {
        if (!selectedFile.name.toLowerCase().endsWith(".kml")) {
          setUploadError(
            projectDetailPageTranslations.documentsTab.uploadNewFileCard
              .invalidKml[language],
          );
          setUploading(false);
          return;
        }

        const newKmlFile: IKmlFile = {
          name: selectedFile.name,
          url: fileUrl,
          createdAt: new Date().toISOString(),
        };

        const response = await apiProjects.updateProject(project._id, {
          kmlFile: newKmlFile,
        });

        if (response && response.payload) {
          setProject((prevProject) => ({
            ...(prevProject as IProject),
            kmlFile: (response.payload as IProject).kmlFile || newKmlFile,
          }));
          setUploadSuccess(true);
          setSelectedFile(null);
          alert(
            projectDetailPageTranslations.documentsTab.uploadNewFileCard
              .uploadSuccessMessage[language],
          );
        } else {
          setUploadError(
            projectDetailPageTranslations.documentsTab.uploadNewFileCard
              .updateKmlError[language],
          );
        }
      }
    } catch (error) {
      setUploadError(
        projectDetailPageTranslations.documentsTab.uploadNewFileCard
          .uploadFailure[language],
      );
      console.error("Lỗi tải tài liệu:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLandDocument = async (docUrl: string) => {
    if (!project?._id) return;

    if (
      !confirm(
        projectDetailPageTranslations.documentsTab.landDocumentsCard
          .deleteConfirm[language],
      )
    ) {
      return;
    }

    try {
      const updatedLandDocuments =
        project.landDocuments?.filter((doc) => doc.url !== docUrl) || [];
      const response = await apiProjects.updateProject(project._id, {
        landDocuments: updatedLandDocuments,
      });

      if (response && response.payload) {
        setProject((prevProject) => ({
          ...(prevProject as IProject),
          landDocuments:
            (response.payload as IProject).landDocuments ||
            updatedLandDocuments,
        }));
        alert(
          projectDetailPageTranslations.documentsTab.landDocumentsCard
            .deleteSuccess[language],
        );
      } else {
        alert(
          projectDetailPageTranslations.documentsTab.landDocumentsCard
            .deleteError[language],
        );
        console.error("Lỗi khi xóa tài liệu:", response);
      }
    } catch (error) {
      alert(
        projectDetailPageTranslations.documentsTab.landDocumentsCard
          .deleteGeneralError[language],
      );
      console.error("Lỗi xóa tài liệu:", error);
    }
  };

  const handleDeleteKmlFile = async () => {
    if (!project?._id) return;

    if (
      !confirm(
        projectDetailPageTranslations.documentsTab.kmlFileCard.deleteConfirm[
          language
        ],
      )
    ) {
      return;
    }

    try {
      const response = await apiProjects.updateProject(project._id, {
        kmlFile: null,
      });

      if (response && response.payload) {
        setProject((prevProject) => ({
          ...(prevProject as IProject),
          kmlFile: (response.payload as IProject).kmlFile || null,
        }));
        alert(
          projectDetailPageTranslations.documentsTab.kmlFileCard.deleteSuccess[
            language
          ],
        );
      } else {
        alert(
          projectDetailPageTranslations.documentsTab.kmlFileCard.deleteError[
            language
          ],
        );
        console.error("Lỗi khi xóa tệp KML:", response);
      }
    } catch (error) {
      alert(
        projectDetailPageTranslations.documentsTab.kmlFileCard
          .deleteGeneralError[language],
      );
      console.error("Lỗi xóa tệp KML:", error);
    }
  };

  const handleViewFile = (url: string) => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
  }, [params.id, fetchProject]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {projectDetailPageTranslations.projectNotFound.title[language]}
        </h2>
        <p className="text-gray-500 mb-6">
          {projectDetailPageTranslations.projectNotFound.message[language]}
        </p>
        <Button onClick={() => router.push("/quan-ly")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {
            projectDetailPageTranslations.projectNotFound.backToManagement[
              language
            ]
          }
        </Button>
      </div>
    );
  }

  const landDocuments = project.landDocuments || [];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link
          href="/quan-ly"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {projectDetailPageTranslations.backToManagementLink[language]}
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <ProjectIcon type={project.projectType} />
          <div className="ml-3">
            <h1 className="text-3xl font-bold">
              {projectDetailPageTranslations.projectTitle[language](
                getProjectTypeText(project.projectType),
                project.name,
              )}
            </h1>
            <p className="text-gray-500">
              {projectDetailPageTranslations.registrationDate[language]}{" "}
              {formatDateUtil(project.createdAt || new Date().toISOString())}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          {getStatusBadge(project.status || "surveying")}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            {projectDetailPageTranslations.tabs.overview.label[language]}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            {projectDetailPageTranslations.tabs.documents.label[language]}
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Clock className="w-4 h-4 mr-2" />
            {projectDetailPageTranslations.tabs.activities.label[language]}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {
                  projectDetailPageTranslations.overviewTab.projectInfoCard
                    .title[language]
                }
              </CardTitle>
              <CardDescription>
                {
                  projectDetailPageTranslations.overviewTab.projectInfoCard
                    .description[language]
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {
                      projectDetailPageTranslations.overviewTab.projectInfoCard
                        .projectTypeLabel[language]
                    }
                  </h3>
                  <p className="font-medium">
                    {getProjectTypeText(project.projectType)}
                  </p>
                </div>

                {project.projectType === "forest" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.forestLocation.vi
                        }
                      </h3>
                      <p className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.forestLocation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.forestArea.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.forestArea || "N/A"} ha
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.treeSpecies.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.treeSpecies || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.plantingAge.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.plantingAge || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.averageHeight.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.averageHeight || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.averageCircumference.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.averageCircumference || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.previousDeforestation.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.previousDeforestation === "no"
                          ? projectDetailPageTranslations.overviewTab
                              .projectInfoCard.fields
                              .previousDeforestationOptions.no[language]
                          : project.details?.previousDeforestation === "yes"
                            ? projectDetailPageTranslations.overviewTab
                                .projectInfoCard.fields
                                .previousDeforestationOptions.yes[language]
                            : project.details?.previousDeforestation ===
                                "unknown"
                              ? projectDetailPageTranslations.overviewTab
                                  .projectInfoCard.fields
                                  .previousDeforestationOptions.unknown[
                                  language
                                ]
                              : "N/A"}
                      </p>
                    </div>
                  </>
                )}

                {project.projectType === "rice" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.riceLocation.vi
                        }
                      </h3>
                      <p className="font-medium flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.riceLocation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.riceArea.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceArea || "N/A"} ha
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.riceTerrain.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceTerrain || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.riceClimate.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceClimate || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.riceSoilType.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.riceSoilType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.riceStartDate.vi
                        }
                      </h3>
                      <p className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.riceStartDate
                          ? formatDateUtil(project.details.riceStartDate)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.riceEndDate.vi
                        }
                      </h3>
                      <p className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {project.details?.riceEndDate
                          ? formatDateUtil(project.details.riceEndDate)
                          : "N/A"}
                      </p>
                    </div>
                  </>
                )}

                {project.projectType === "biochar" && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.biocharRawMaterial.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharRawMaterial || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.biocharCarbonContent.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharCarbonContent || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.biocharLandArea.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharLandArea || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectInfoCard.fields.biocharApplicationMethod.vi
                        }
                      </h3>
                      <p className="font-medium">
                        {project.details?.biocharApplicationMethod || "N/A"}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {
                      projectDetailPageTranslations.overviewTab.projectInfoCard
                        .fields.applicantName.vi
                    }
                  </h3>
                  <p className="font-medium">{project.name || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {
                      projectDetailPageTranslations.overviewTab.projectInfoCard
                        .fields.organization.vi
                    }
                  </h3>
                  <p className="font-medium">{project.organization || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {
                      projectDetailPageTranslations.overviewTab.projectInfoCard
                        .fields.contactEmail.vi
                    }
                  </h3>
                  <p className="font-medium">{project.email || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {
                      projectDetailPageTranslations.overviewTab.projectInfoCard
                        .fields.phoneNumber.vi
                    }
                  </h3>
                  <p className="font-medium">{project.phone || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {
                      projectDetailPageTranslations.overviewTab.projectInfoCard
                        .fields.address.vi
                    }
                  </h3>
                  <p className="font-medium">{project.address || "N/A"}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {
                    projectDetailPageTranslations.overviewTab.projectInfoCard
                      .fields.additionalInfo.vi
                  }
                </h3>
                <p className="text-gray-700">
                  {project.additionalInfo ||
                    projectDetailPageTranslations.overviewTab.projectInfoCard
                      .fields.noAdditionalInfo[language]}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button>
                {
                  projectDetailPageTranslations.overviewTab.projectInfoCard
                    .updateButton[language]
                }
              </Button>
              <Button variant="outline">
                {
                  projectDetailPageTranslations.overviewTab.projectInfoCard
                    .downloadReportButton[language]
                }
              </Button>
            </CardFooter>
          </Card>

          {project.carbonCreditsTotal !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {
                    projectDetailPageTranslations.overviewTab.carbonInfoCard
                      .title[language]
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      {
                        projectDetailPageTranslations.overviewTab.carbonInfoCard
                          .totalCredits[language]
                      }
                    </h3>
                    <p className="font-medium">
                      {project.carbonCreditsTotal?.toLocaleString() || "N/A"}{" "}
                      {
                        projectDetailPageTranslations.overviewTab.carbonInfoCard
                          .tonsCo2[language]
                      }
                    </p>
                  </div>
                  {project.carbonCredits !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .carbonInfoCard.availableCredits[language]
                        }
                      </h3>
                      <p className="font-medium">
                        {project.carbonCredits?.toLocaleString() || "N/A"}{" "}
                        {
                          projectDetailPageTranslations.overviewTab
                            .carbonInfoCard.tonsCo2[language]
                        }
                      </p>
                    </div>
                  )}
                  {project.carbonCreditsClaimed !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        {
                          projectDetailPageTranslations.overviewTab
                            .carbonInfoCard.claimedCredits[language]
                        }
                      </h3>
                      <p className="font-medium">
                        {project.carbonCreditsClaimed?.toLocaleString() ||
                          "N/A"}{" "}
                        {
                          projectDetailPageTranslations.overviewTab
                            .carbonInfoCard.tonsCo2[language]
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {typeof project.progress === "number" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {
                    projectDetailPageTranslations.overviewTab
                      .projectProgressCard.title[language]
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {
                          projectDetailPageTranslations.overviewTab
                            .projectProgressCard.overallProgress[language]
                        }
                      </span>
                      <span className="text-sm font-medium">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {
                  projectDetailPageTranslations.documentsTab.landDocumentsCard
                    .title[language]
                }
              </CardTitle>
              <CardDescription>
                {
                  projectDetailPageTranslations.documentsTab.landDocumentsCard
                    .description[language]
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {landDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {
                            projectDetailPageTranslations.documentsTab
                              .landDocumentsCard.tableHeaders.docName[language]
                          }
                        </TableHead>
                        <TableHead>
                          {
                            projectDetailPageTranslations.documentsTab
                              .landDocumentsCard.tableHeaders.type[language]
                          }
                        </TableHead>
                        <TableHead>
                          {
                            projectDetailPageTranslations.documentsTab
                              .landDocumentsCard.tableHeaders.uploadDate[
                              language
                            ]
                          }
                        </TableHead>
                        <TableHead className="text-right">
                          {
                            projectDetailPageTranslations.documentsTab
                              .landDocumentsCard.tableHeaders.actions[language]
                          }
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {landDocuments.map((doc: IProjectDocument) => (
                        <TableRow key={doc._id || doc.url}>
                          <TableCell className="font-medium">
                            {doc.name ||
                              decodeURIComponent(
                                doc.url.split("/").pop() ||
                                  projectDetailPageTranslations.documentsTab
                                    .landDocumentsCard.unnamedDocument[
                                    language
                                  ],
                              )}
                          </TableCell>
                          <TableCell>{doc.type || "N/A"}</TableCell>
                          <TableCell>
                            {doc.createdAt
                              ? formatDateUtil(doc.createdAt)
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFile(doc.url)}
                              >
                                {
                                  projectDetailPageTranslations.documentsTab
                                    .landDocumentsCard.viewButton[language]
                                }
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDeleteLandDocument(doc.url)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  {
                    projectDetailPageTranslations.documentsTab.landDocumentsCard
                      .noDocuments[language]
                  }
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {
                  projectDetailPageTranslations.documentsTab.kmlFileCard.title[
                    language
                  ]
                }
              </CardTitle>
              <CardDescription>
                {
                  projectDetailPageTranslations.documentsTab.kmlFileCard
                    .description[language]
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.kmlFile ? (
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <FileBadge className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="font-medium">{project.kmlFile.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewFile(project.kmlFile!.url)}
                    >
                      {
                        projectDetailPageTranslations.documentsTab.kmlFileCard
                          .viewButton[language]
                      }
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteKmlFile}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  {
                    projectDetailPageTranslations.documentsTab.kmlFileCard
                      .noKmlFile[language]
                  }
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {
                  projectDetailPageTranslations.documentsTab.uploadNewFileCard
                    .title[language]
                }
              </CardTitle>
              <CardDescription>
                {
                  projectDetailPageTranslations.documentsTab.uploadNewFileCard
                    .description[language]
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileType">
                    {
                      projectDetailPageTranslations.documentsTab
                        .uploadNewFileCard.fileTypeLabel[language]
                    }
                  </Label>
                  <Select
                    value={fileTypeToUpload}
                    onValueChange={(value: "landDocument" | "kmlFile") =>
                      setFileTypeToUpload(value)
                    }
                  >
                    <SelectTrigger id="fileType">
                      <SelectValue
                        placeholder={
                          projectDetailPageTranslations.documentsTab
                            .uploadNewFileCard.selectFileTypePlaceholder[
                            language
                          ]
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landDocument">
                        {
                          projectDetailPageTranslations.documentsTab
                            .uploadNewFileCard.landDocumentOption[language]
                        }
                      </SelectItem>
                      <SelectItem value="kmlFile">
                        {
                          projectDetailPageTranslations.documentsTab
                            .uploadNewFileCard.kmlFileOption[language]
                        }
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="document" className="mb-2 block">
                    {
                      projectDetailPageTranslations.documentsTab
                        .uploadNewFileCard.chooseFileLabel[language]
                    }
                  </Label>
                  <Input
                    id="document"
                    type="file"
                    onChange={handleFileChange}
                    className="mb-2"
                    accept={fileTypeToUpload === "kmlFile" ? ".kml" : undefined}
                  />
                </div>
              </div>

              {selectedFile && (
                <p className="text-sm text-gray-600">
                  {
                    projectDetailPageTranslations.documentsTab.uploadNewFileCard
                      .selectedFile[language]
                  }{" "}
                  <span className="font-medium">{selectedFile.name}</span>
                </p>
              )}
              {uploadError && (
                <div className="flex items-center text-red-500 text-sm mt-2">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {
                    projectDetailPageTranslations.documentsTab.uploadNewFileCard
                      .uploadSuccessMessage[language]
                  }
                </div>
              )}
              <Button
                onClick={handleUploadFile}
                disabled={uploading || !selectedFile}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {
                      projectDetailPageTranslations.documentsTab
                        .uploadNewFileCard.uploadingButton[language]
                    }
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {
                      projectDetailPageTranslations.documentsTab
                        .uploadNewFileCard.uploadButton[language]
                    }
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {projectDetailPageTranslations.activitiesTab.title[language]}
              </CardTitle>
              <CardDescription>
                {
                  projectDetailPageTranslations.activitiesTab.description[
                    language
                  ]
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {project.activities && project.activities.length > 0 ? (
                    project.activities.map((activity, index) => (
                      <div key={index} className="ml-10 relative">
                        <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {formatDateUtil(activity.date)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      {
                        projectDetailPageTranslations.activitiesTab
                          .noActivities[language]
                      }
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
