import Link from "next/link"

interface Attribution {
  filename: string
  title: string
  author?: string
  source?: string
  sourceUrl?: string
  license?: string
  licenseUrl?: string
}

export const imageAttributions: Attribution[] = [
  {
    filename: "rice-3182281_1920.jpg",
    title: "Rice Plant Close-up",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "vietnam-farmer-639204_1920.jpg",
    title: "Vietnamese Farmer",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "cloud-4136344_1920.jpg",
    title: "Misty Mountain Landscape",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "boy-1822614_1920.jpg",
    title: "Boy with Lantern",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "mother-1505055_1280.jpg",
    title: "Mother with Children in Rice Field",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "grandmother-4992686_1920.jpg",
    title: "Grandmother Sorting Chili Peppers",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "mother-1505000_1280.jpg",
    title: "Woman Walking in Terraced Rice Fields",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "ethnic-girls-4522623_1920.jpg",
    title: "Ethnic Minority Woman",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
  {
    filename: "landscape-1504936_1280.jpg",
    title: "Wooden Bridge Over River",
    source: "Pixabay",
    license: "Pixabay License",
    licenseUrl: "https://pixabay.com/service/license/",
  },
]

export default function ImageAttributions() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Image Attributions</h1>
      <div className="space-y-6">
        {imageAttributions.map((attribution, index) => (
          <div key={index} className="border-b pb-4">
            <h2 className="text-xl font-semibold">{attribution.title}</h2>
            <p className="text-gray-600">Filename: {attribution.filename}</p>
            {attribution.author && <p className="text-gray-600">Author: {attribution.author}</p>}
            {attribution.source && (
              <p className="text-gray-600">
                Source:{" "}
                {attribution.sourceUrl ? (
                  <Link
                    href={attribution.sourceUrl}
                    className="text-green-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {attribution.source}
                  </Link>
                ) : (
                  attribution.source
                )}
              </p>
            )}
            {attribution.license && (
              <p className="text-gray-600">
                License:{" "}
                {attribution.licenseUrl ? (
                  <Link
                    href={attribution.licenseUrl}
                    className="text-green-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {attribution.license}
                  </Link>
                ) : (
                  attribution.license
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
