// src/components/ProjectFormContent.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Upload,
  X,
  FileText,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectFormContentProps {
  formData: {
    name: string;
    organization: string;
    phone: string;
    email: string;
    address: string;
    forestLocation: string;
    forestArea: string;
    treeSpecies: string;
    plantingAge: string;
    averageHeight: string;
    averageCircumference: string;
    previousDeforestation: string;
    riceLocation: string;
    riceArea: string;
    riceTerrain: string;
    riceClimate: string;
    riceSoilType: string;
    riceStartDate: string;
    riceEndDate: string;
    biocharRawMaterial: string;
    biocharCarbonContent: string;
    biocharLandArea: string;
    biocharApplicationMethod: string;
    additionalInfo: string;
  };
  formErrors: {
    [key: string]: string;
  };
  uploadedFiles: File[];
  kmlFile: File | null;
  activeTab: string;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  kmlFileInputRef: React.RefObject<HTMLInputElement>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleTabChange: (value: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKmlFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  removeKmlFile: () => void;
  getFieldLabel: (fieldName: string) => string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
const ProjectFormContent: React.FC<ProjectFormContentProps> = ({
  formData,
  formErrors,
  uploadedFiles,
  kmlFile,
  activeTab,
  isSubmitting,
  fileInputRef,
  kmlFileInputRef,
  handleChange,
  handleTabChange,
  handleFileUpload,
  handleKmlFileUpload,
  removeFile,
  removeKmlFile,
  getFieldLabel,
  handleSubmit, // Destructure handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs
        defaultValue="forest"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="forest" className="text-sm md:text-base">
            Lâm nghiệp
          </TabsTrigger>
          <TabsTrigger value="rice" className="text-sm md:text-base">
            Lúa
          </TabsTrigger>
          <TabsTrigger value="biochar" className="text-sm md:text-base">
            Biochar
          </TabsTrigger>
        </TabsList>

        {/* Contact Information Section */}
        <div className="space-y-5 mb-8">
          <h4 className="text-lg font-semibold text-gray-700">
            Thông tin liên hệ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                {getFieldLabel("name")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={getFieldLabel("name")}
                className={`border-2 py-6 ${formErrors.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="organization"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("organization")}
              </Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder={getFieldLabel("organization")}
                className="border-2 py-6 border-gray-200 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                {getFieldLabel("phone")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={getFieldLabel("phone")}
                className={`border-2 py-6 ${formErrors.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm">{formErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {getFieldLabel("email")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={getFieldLabel("email")}
                className={`border-2 py-6 ${formErrors.email ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700 font-medium">
              {getFieldLabel("address")}
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={getFieldLabel("address")}
              className="border-2 py-6 border-gray-200 focus:border-green-500"
            />
          </div>
        </div>

        {/* Land Documents Section */}
        <div id="land-documents-upload" className="space-y-4 mb-8">
          {" "}
          {/* Added ID for scrolling */}
          <h4 className="text-lg font-semibold text-gray-700">
            Giấy tờ sử dụng đất
            <span className="text-red-500">*</span>
          </h4>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer ${formErrors.landDocuments ? "border-red-400" : "border-gray-300"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-1">
              Kéo và thả hoặc nhấp để tải lên
            </p>
            <p className="text-gray-400 text-sm">
              Hỗ trợ: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
          {formErrors.landDocuments && (
            <p className="text-red-500 text-sm">{formErrors.landDocuments}</p>
          )}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="font-medium text-gray-700">Tệp đã tải lên:</p>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-gray-700 text-sm">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KML File Upload Section */}
        <div className="space-y-2 mb-8">
          <Label className="text-gray-700 font-medium">File KML (nếu có)</Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => kmlFileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={kmlFileInputRef}
              onChange={handleKmlFileUpload}
              className="hidden"
              accept=".kml,.kmz"
            />
            <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Tải lên file KML/KMZ</p>
          </div>

          {kmlFile && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mt-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 text-sm">{kmlFile.name}</span>
              </div>
              <button
                type="button"
                onClick={removeKmlFile}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Project Type Specific Sections */}
        <TabsContent value="forest" className="space-y-6 mt-0">
          <h4 className="text-lg font-semibold text-gray-700">
            Thông tin dự án lâm nghiệp
          </h4>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="forestLocation"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("forestLocation")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="forestLocation"
                name="forestLocation"
                value={formData.forestLocation}
                onChange={handleChange}
                placeholder="Vị trí cụ thể của dự án"
                className={`border-2 py-6 ${formErrors.forestLocation ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.forestLocation && (
                <p className="text-red-500 text-sm">
                  {formErrors.forestLocation}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="forestArea"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("forestArea")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="forestArea"
                  name="forestArea"
                  value={formData.forestArea}
                  onChange={handleChange}
                  placeholder="Diện tích (ha)"
                  className={`border-2 py-6 ${formErrors.forestArea ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.forestArea && (
                  <p className="text-red-500 text-sm">
                    {formErrors.forestArea}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="treeSpecies"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("treeSpecies")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="treeSpecies"
                  name="treeSpecies"
                  value={formData.treeSpecies}
                  onChange={handleChange}
                  placeholder="Các loài cây (phân cách bằng dấu phẩy)"
                  className={`border-2 py-6 ${formErrors.treeSpecies ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.treeSpecies && (
                  <p className="text-red-500 text-sm">
                    {formErrors.treeSpecies}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="plantingAge"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("plantingAge")}
                </Label>
                <Input
                  id="plantingAge"
                  name="plantingAge"
                  value={formData.plantingAge}
                  onChange={handleChange}
                  placeholder="Đã trồng bao lâu (năm)"
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="averageHeight"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("averageHeight")}
                </Label>
                <Input
                  id="averageHeight"
                  name="averageHeight"
                  value={formData.averageHeight}
                  onChange={handleChange}
                  placeholder="Chiều cao trung bình (m)"
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="averageCircumference"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("averageCircumference")}
                </Label>
                <Input
                  id="averageCircumference"
                  name="averageCircumference"
                  value={formData.averageCircumference}
                  onChange={handleChange}
                  placeholder="Chu vi ngang ngực (cm)"
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="previousDeforestation"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("previousDeforestation")}
              </Label>
              <select
                id="previousDeforestation"
                name="previousDeforestation"
                value={formData.previousDeforestation}
                onChange={handleChange}
                className="w-full border-2 py-3 px-4 rounded-md border-gray-200 focus:border-green-500"
              >
                <option value="">-- Chọn câu trả lời --</option>
                <option value="no">Không, không có hoạt động chặt phá</option>
                <option value="yes">Có, đã có hoạt động chặt phá</option>
                <option value="unknown">Không biết/Không chắc chắn</option>
              </select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rice" className="space-y-6 mt-0">
          <h4 className="text-lg font-semibold text-gray-700">
            Thông tin dự án lúa
          </h4>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="riceLocation"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("riceLocation")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="riceLocation"
                name="riceLocation"
                value={formData.riceLocation}
                onChange={handleChange}
                placeholder="Vị trí cụ thể của dự án"
                className={`border-2 py-6 ${formErrors.riceLocation ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.riceLocation && (
                <p className="text-red-500 text-sm">
                  {formErrors.riceLocation}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="riceArea" className="text-gray-700 font-medium">
                  {getFieldLabel("riceArea")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="riceArea"
                  name="riceArea"
                  value={formData.riceArea}
                  onChange={handleChange}
                  placeholder="Diện tích (ha)"
                  className={`border-2 py-6 ${formErrors.riceArea ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.riceArea && (
                  <p className="text-red-500 text-sm">{formErrors.riceArea}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="riceSoilType"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("riceSoilType")}
                </Label>
                <Input
                  id="riceSoilType"
                  name="riceSoilType"
                  value={formData.riceSoilType}
                  onChange={handleChange}
                  placeholder="Loại đất"
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="riceTerrain"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("riceTerrain")}
                </Label>
                <Input
                  id="riceTerrain"
                  name="riceTerrain"
                  value={formData.riceTerrain}
                  onChange={handleChange}
                  placeholder="Mô tả địa hình"
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="riceClimate"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("riceClimate")}
                </Label>
                <Input
                  id="riceClimate"
                  name="riceClimate"
                  value={formData.riceClimate}
                  onChange={handleChange}
                  placeholder="Điều kiện khí hậu"
                  className="border-2 py-6 border-gray-200 focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label
                  htmlFor="riceStartDate"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("riceStartDate")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="riceStartDate"
                  name="riceStartDate"
                  type="date"
                  value={formData.riceStartDate}
                  onChange={handleChange}
                  className={`border-2 py-6 ${formErrors.riceStartDate ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.riceStartDate && (
                  <p className="text-red-500 text-sm">
                    {formErrors.riceStartDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="riceEndDate"
                  className="text-gray-700 font-medium"
                >
                  {getFieldLabel("riceEndDate")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="riceEndDate"
                  name="riceEndDate"
                  type="date"
                  value={formData.riceEndDate}
                  onChange={handleChange}
                  className={`border-2 py-6 ${formErrors.riceEndDate ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
                />
                {formErrors.riceEndDate && (
                  <p className="text-red-500 text-sm">
                    {formErrors.riceEndDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="biochar" className="space-y-6 mt-0">
          <h4 className="text-lg font-semibold text-gray-700">
            Thông tin dự án Biochar
          </h4>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="biocharRawMaterial"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("biocharRawMaterial")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="biocharRawMaterial"
                name="biocharRawMaterial"
                value={formData.biocharRawMaterial}
                onChange={handleChange}
                placeholder="Nguyên liệu đầu vào"
                className={`border-2 py-6 ${formErrors.biocharRawMaterial ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.biocharRawMaterial && (
                <p className="text-red-500 text-sm">
                  {formErrors.biocharRawMaterial}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="biocharCarbonContent"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("biocharCarbonContent")}
              </Label>
              <Input
                id="biocharCarbonContent"
                name="biocharCarbonContent"
                value={formData.biocharCarbonContent}
                onChange={handleChange}
                placeholder="Hàm lượng carbon cố định (%)"
                className="border-2 py-6 border-gray-200 focus:border-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="biocharLandArea"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("biocharLandArea")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="biocharLandArea"
                name="biocharLandArea"
                value={formData.biocharLandArea}
                onChange={handleChange}
                placeholder="Diện tích đất được cải tạo (ha)"
                className={`border-2 py-6 ${formErrors.biocharLandArea ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"}`}
              />
              {formErrors.biocharLandArea && (
                <p className="text-red-500 text-sm">
                  {formErrors.biocharLandArea}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="biocharApplicationMethod"
                className="text-gray-700 font-medium"
              >
                {getFieldLabel("biocharApplicationMethod")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="biocharApplicationMethod"
                name="biocharApplicationMethod"
                value={formData.biocharApplicationMethod}
                onChange={handleChange}
                placeholder="Mô tả phương pháp ứng dụng biochar vào đất"
                rows={3}
                className={`border-2 ${formErrors.biocharApplicationMethod ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"} resize-none`}
              />
              {formErrors.biocharApplicationMethod && (
                <p className="text-red-500 text-sm">
                  {formErrors.biocharApplicationMethod}
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Additional Info Section */}
        <div className="space-y-4 mt-6">
          <h4 className="text-lg font-semibold text-gray-700">
            Thông tin bổ sung
          </h4>
          <div className="space-y-2">
            <Label
              htmlFor="additionalInfo"
              className="text-gray-700 font-medium"
            >
              {getFieldLabel("additionalInfo")}
            </Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Thông tin bổ sung về dự án"
              rows={4}
              className="border-2 border-gray-200 focus:border-green-500 resize-none"
            />
          </div>
        </div>

        {/* Privacy Policy Disclaimer */}
        <div className="flex items-start space-x-2 py-4">
          <div className="bg-green-100 p-1 rounded-full mt-0.5">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">
            Chúng tôi cam kết bảo mật thông tin của bạn và chỉ sử dụng cho mục
            đích đánh giá dự án.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Đăng ký dự án"
          )}
        </Button>
      </Tabs>
    </form>
  );
};

export default ProjectFormContent;
