// src/app/admin/projects-carbon/[id]/project-detail-page-language.ts
const projectDetailPageTranslations = {
  loadingMessage: {
    vi: "Đang tải dữ liệu dự án...",
    en: "Loading project data...",
  },
  projectNotFound: {
    title: {
      vi: "Không tìm thấy dự án",
      en: "Project not found",
    },
    message: {
      vi: "Dự án bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.",
      en: "The project you are looking for does not exist or you do not have access.",
    },
    backToManagement: {
      vi: "Quay lại trang quản lý",
      en: "Back to management page",
    },
  },
  backToManagementLink: {
    vi: "Quay lại trang quản lý",
    en: "Back to management page",
  },
  projectTitle: {
    vi: (projectType: string, name: string) =>
      `Dự án ${projectType} của ${name}`,
    en: (projectType: string, name: string) =>
      `${projectType} Project by ${name}`,
  },
  registrationDate: {
    vi: "Đăng ký ngày:",
    en: "Registered on:",
  },
  tabs: {
    overview: {
      label: {
        vi: "Tổng quan",
        en: "Overview",
      },
    },
    documents: {
      label: {
        vi: "Tài liệu",
        en: "Documents",
      },
    },
    activities: {
      label: {
        vi: "Hoạt động",
        en: "Activities",
      },
    },
  },
  overviewTab: {
    projectInfoCard: {
      title: {
        vi: "Thông tin dự án",
        en: "Project Information",
      },
      description: {
        vi: "Chi tiết về dự án tín chỉ carbon",
        en: "Details about the carbon credit project",
      },
      projectTypeLabel: {
        vi: "Loại dự án",
        en: "Project Type",
      },
      fields: {
        forestLocation: { vi: "Địa điểm rừng", en: "Forest Location" },
        forestArea: { vi: "Diện tích rừng", en: "Forest Area" },
        treeSpecies: { vi: "Loài cây", en: "Tree Species" },
        plantingAge: { vi: "Tuổi cây trồng", en: "Planting Age" },
        averageHeight: { vi: "Chiều cao trung bình", en: "Average Height" },
        averageCircumference: {
          vi: "Chu vi trung bình",
          en: "Average Circumference",
        },
        previousDeforestation: {
          vi: "Lịch sử chặt phá",
          en: "Previous Deforestation",
        },
        previousDeforestationOptions: {
          no: { vi: "Không", en: "No" },
          yes: { vi: "Có", en: "Yes" },
          unknown: { vi: "Không rõ", en: "Unknown" },
        },
        riceLocation: { vi: "Địa điểm lúa gạo", en: "Rice Field Location" },
        riceArea: { vi: "Diện tích lúa gạo", en: "Rice Field Area" },
        riceTerrain: { vi: "Địa hình", en: "Terrain" },
        riceClimate: { vi: "Khí hậu", en: "Climate" },
        riceSoilType: { vi: "Loại đất", en: "Soil Type" },
        riceStartDate: {
          vi: "Ngày bắt đầu (lúa gạo)",
          en: "Start Date (Rice)",
        },
        riceEndDate: { vi: "Ngày kết thúc (lúa gạo)", en: "End Date (Rice)" },
        biocharRawMaterial: { vi: "Nguyên liệu thô", en: "Raw Material" },
        biocharCarbonContent: { vi: "Hàm lượng carbon", en: "Carbon Content" },
        biocharLandArea: {
          vi: "Diện tích đất ứng dụng",
          en: "Application Land Area",
        },
        biocharApplicationMethod: {
          vi: "Phương pháp ứng dụng",
          en: "Application Method",
        },
        applicantName: { vi: "Người đăng ký", en: "Applicant Name" },
        organization: { vi: "Tổ chức", en: "Organization" },
        contactEmail: { vi: "Email liên hệ", en: "Contact Email" },
        phoneNumber: { vi: "Số điện thoại", en: "Phone Number" },
        address: { vi: "Địa chỉ", en: "Address" },
        additionalInfo: {
          vi: "Thông tin bổ sung",
          en: "Additional Information",
        },
        noAdditionalInfo: {
          vi: "Không có thông tin bổ sung.",
          en: "No additional information.",
        },
      },
      updateButton: {
        vi: "Cập nhật thông tin",
        en: "Update Information",
      },
      downloadReportButton: {
        vi: "Tải xuống báo cáo",
        en: "Download Report",
      },
    },
    carbonInfoCard: {
      title: {
        vi: "Thông tin Tín chỉ Carbon",
        en: "Carbon Credit Information",
      },
      totalCredits: { vi: "Tổng tín chỉ carbon", en: "Total Carbon Credits" },
      availableCredits: { vi: "Tín chỉ hiện có", en: "Available Credits" },
      claimedCredits: { vi: "Tín chỉ đã yêu cầu", en: "Claimed Credits" },
      tonsCo2: { vi: "tấn CO₂", en: "tons CO₂" },
    },
    projectProgressCard: {
      title: {
        vi: "Tiến độ dự án",
        en: "Project Progress",
      },
      overallProgress: { vi: "Tiến độ tổng", en: "Overall Progress" },
    },
  },
  documentsTab: {
    landDocumentsCard: {
      title: {
        vi: "Tài liệu đất đai",
        en: "Land Documents",
      },
      description: {
        vi: "Các tài liệu liên quan đến quyền sở hữu/sử dụng đất của dự án.",
        en: "Documents related to project land ownership/usage rights.",
      },
      tableHeaders: {
        docName: { vi: "Tên tài liệu", en: "Document Name" },
        type: { vi: "Loại", en: "Type" },
        uploadDate: { vi: "Ngày tải lên", en: "Upload Date" },
        actions: { vi: "Hành động", en: "Actions" },
      },
      noDocuments: {
        vi: "Chưa có tài liệu đất đai nào được đính kèm.",
        en: "No land documents attached yet.",
      },
      unnamedDocument: { vi: "Tài liệu không tên", en: "Unnamed Document" },
      viewButton: { vi: "Xem", en: "View" },
      deleteConfirm: {
        vi: "Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.",
        en: "Are you sure you want to delete this document? This action cannot be undone.",
      },
      deleteSuccess: {
        vi: "Tài liệu đã được xóa thành công!",
        en: "Document deleted successfully!",
      },
      deleteError: {
        vi: "Lỗi khi xóa tài liệu.",
        en: "Error deleting document.",
      },
      deleteGeneralError: {
        vi: "Đã xảy ra lỗi khi xóa tài liệu.",
        en: "An error occurred while deleting the document.",
      },
    },
    kmlFileCard: {
      title: {
        vi: "Tệp KML",
        en: "KML File",
      },
      description: {
        vi: "Tệp KML định vị khu vực địa lý của dự án trên bản đồ.",
        en: "KML file defining the geographical area of the project on a map.",
      },
      noKmlFile: {
        vi: "Chưa có tệp KML nào được đính kèm.",
        en: "No KML file attached yet.",
      },
      deleteConfirm: {
        vi: "Bạn có chắc chắn muốn xóa tệp KML này không? Hành động này không thể hoàn tác.",
        en: "Are you sure you want to delete this KML file? This action cannot be undone.",
      },
      deleteSuccess: {
        vi: "Tệp KML đã được xóa thành công!",
        en: "KML file deleted successfully!",
      },
      deleteError: {
        vi: "Lỗi khi xóa tệp KML.",
        en: "Error deleting KML file.",
      },
      deleteGeneralError: {
        vi: "Đã xảy ra lỗi khi xóa tệp KML.",
        en: "An error occurred while deleting the KML file.",
      },
    },
    uploadNewFileCard: {
      title: {
        vi: "Tải lên tệp mới",
        en: "Upload New File",
      },
      description: {
        vi: "Tải lên tài liệu đất đai hoặc tệp KML mới cho dự án.",
        en: "Upload new land documents or KML files for the project.",
      },
      fileTypeLabel: { vi: "Loại tệp tải lên", en: "File Type to Upload" },
      selectFileTypePlaceholder: {
        vi: "Chọn loại tệp",
        en: "Select file type",
      },
      landDocumentOption: { vi: "Tài liệu đất đai", en: "Land Document" },
      kmlFileOption: { vi: "Tệp KML", en: "KML File" },
      chooseFileLabel: { vi: "Chọn tệp", en: "Choose File" },
      selectedFile: { vi: "Đã chọn tệp:", en: "Selected file:" },
      uploadError: {
        vi: "Vui lòng chọn một tệp để tải lên.",
        en: "Please select a file to upload.",
      },
      invalidKml: {
        vi: "Vui lòng chọn tệp KML hợp lệ (.kml).",
        en: "Please select a valid KML file (.kml).",
      },
      updateProjectError: {
        vi: "Lỗi khi cập nhật dự án với tài liệu đất đai.",
        en: "Error updating project with land document.",
      },
      updateKmlError: {
        vi: "Lỗi khi cập nhật dự án với tệp KML.",
        en: "Error updating project with KML file.",
      },
      uploadSuccessMessage: {
        vi: "Tải lên thành công!",
        en: "Upload successful!",
      },
      uploadFailure: {
        vi: "Lỗi khi tải tệp lên.",
        en: "Error uploading file.",
      },
      uploadButton: { vi: "Tải lên", en: "Upload" },
      uploadingButton: { vi: "Đang tải lên...", en: "Uploading..." },
    },
  },
  activitiesTab: {
    title: {
      vi: "Lịch sử hoạt động",
      en: "Activity History",
    },
    description: {
      vi: "Các hoạt động gần đây liên quan đến dự án",
      en: "Recent activities related to the project",
    },
    noActivities: {
      vi: "Chưa có hoạt động nào được ghi nhận.",
      en: "No activities recorded yet.",
    },
  },
};

export default projectDetailPageTranslations;
