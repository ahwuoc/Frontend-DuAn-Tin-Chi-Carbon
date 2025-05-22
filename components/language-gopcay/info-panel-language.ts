// src/components/info-panel-language.ts
const infoPanelTranslations = {
  panelTitle: {
    vi: "Thống kê Rừng 🌴",
    en: "Forest Stats 🌴",
  },
  totalTreesContributed: {
    label: {
      vi: "Tổng số cây đóng góp:",
      en: "Total trees contributed:",
    },
    unit: {
      vi: "cây",
      en: "trees",
    },
  },
  fromContributors: {
    vi: (count: number) => `Từ ${count} nhà hảo tâm`,
    en: (count: number) => `From ${count} contributors`,
  },
  plantedTrees: {
    label: {
      vi: "Cây đã trồng:",
      en: "Trees planted:",
    },
  },
  contributorsList: {
    title: {
      vi: (count: number) => `Danh sách người đóng góp (${count})`,
      en: (count: number) => `List of contributors (${count})`,
    },
    treeUnit: {
      vi: "cây",
      en: "trees",
    },
  },
};

export default infoPanelTranslations;
