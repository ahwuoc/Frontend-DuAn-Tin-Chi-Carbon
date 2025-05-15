export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tiêu đề trang */}
          <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse mb-8"></div>

          {/* Form tìm kiếm */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center">
              <div className="relative flex-grow">
                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="ml-2 h-12 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Hiển thị kết quả */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
