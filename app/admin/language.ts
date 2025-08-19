export const adminLanguage = {
  vi: {
    // Header
    title: "Quản lý Khu Rừng Nhiệt Đới",
    subtitle: "Quản lý người đóng góp và cây trong khu rừng",
    
    // Tabs
    contributors: "Người đóng góp",
    trees: "Cây",
    
    // Contributors Tab
    addContributor: {
      title: "Thêm người đóng góp mới",
      description: "Thêm người đóng góp mới vào khu rừng",
      nameLabel: "Tên người đóng góp",
      namePlaceholder: "Nhập tên người đóng góp",
      treesLabel: "Số cây đóng góp",
      submitButton: "Thêm người đóng góp",
      addingButton: "Đang thêm...",
    },
    
    contributorsList: {
      title: "Danh sách người đóng góp",
      count: (count: number) => `${count} người đóng góp`,
      plantedTrees: (count: number) => `Đã trồng ${count} cây`,
      id: "ID",
    },
    
    // Trees Tab
    addTree: {
      title: "Thêm cây mới",
      description: "Thêm cây mới vào khu rừng",
      typeLabel: "Loại cây",
      typePlaceholder: "Chọn loại cây",
      contributorLabel: "Người đóng góp",
      contributorPlaceholder: "Chọn người đóng góp",
      xPositionLabel: "Vị trí X",
      zPositionLabel: "Vị trí Z",
      submitButton: "Thêm cây",
      addingButton: "Đang thêm...",
    },
    
    treesList: {
      title: "Danh sách cây",
      count: (count: number) => `${count} cây trong khu rừng`,
      position: (x: number, z: number) => `Vị trí: (${x.toFixed(1)}, ${z.toFixed(1)})`,
      contributor: "Người đóng góp",
      id: "ID",
    },
    
    // Loading
    loading: "Đang tải dữ liệu...",
    
    // Errors
    errors: {
      loadData: "Không thể tải dữ liệu",
      addContributor: "Không thể thêm người đóng góp",
      addTree: "Không thể thêm cây",
    },
    
    // Validation
    validation: {
      nameRequired: "Tên người đóng góp là bắt buộc",
      contributorRequired: "Vui lòng chọn người đóng góp",
      treesMin: "Số cây phải lớn hơn 0",
    },
  },
  
  en: {
    // Header
    title: "Tropical Forest Management",
    subtitle: "Manage contributors and trees in the forest",
    
    // Tabs
    contributors: "Contributors",
    trees: "Trees",
    
    // Contributors Tab
    addContributor: {
      title: "Add New Contributor",
      description: "Add a new contributor to the forest",
      nameLabel: "Contributor Name",
      namePlaceholder: "Enter contributor name",
      treesLabel: "Number of Trees",
      submitButton: "Add Contributor",
      addingButton: "Adding...",
    },
    
    contributorsList: {
      title: "Contributors List",
      count: (count: number) => `${count} contributors`,
      plantedTrees: (count: number) => `Planted ${count} trees`,
      id: "ID",
    },
    
    // Trees Tab
    addTree: {
      title: "Add New Tree",
      description: "Add a new tree to the forest",
      typeLabel: "Tree Type",
      typePlaceholder: "Select tree type",
      contributorLabel: "Contributor",
      contributorPlaceholder: "Select contributor",
      xPositionLabel: "X Position",
      zPositionLabel: "Z Position",
      submitButton: "Add Tree",
      addingButton: "Adding...",
    },
    
    treesList: {
      title: "Trees List",
      count: (count: number) => `${count} trees in the forest`,
      position: (x: number, z: number) => `Position: (${x.toFixed(1)}, ${z.toFixed(1)})`,
      contributor: "Contributor",
      id: "ID",
    },
    
    // Loading
    loading: "Loading data...",
    
    // Errors
    errors: {
      loadData: "Failed to load data",
      addContributor: "Failed to add contributor",
      addTree: "Failed to add tree",
    },
    
    // Validation
    validation: {
      nameRequired: "Contributor name is required",
      contributorRequired: "Please select a contributor",
      treesMin: "Number of trees must be greater than 0",
    },
  },
} as const;

export type AdminLanguage = typeof adminLanguage;
export type AdminLanguageKey = keyof typeof adminLanguage.vi;
