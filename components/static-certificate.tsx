"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StaticCertificateProps {
  name: string;
  treeCount: number;
  treeId: string;
  note?: string;
  date?: Date;
  showButtons?: boolean;
}

export default function StaticCertificate({
  name,
  treeCount,
  treeId,
  note,
  date = new Date(),
  showButtons = true,
}: StaticCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  // Hàm để vẽ chứng nhận trên canvas
  const drawCertificate = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    // Vẽ nền gradient nếu không có video
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#f0fdf4");
    gradient.addColorStop(1, "#d1fae5");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Thêm tên với font serif
    if (name) {
      const nameFontSize = Math.floor(canvas.width / 18);
      ctx.font = `${nameFontSize}px serif`;
      ctx.fillStyle = "#2c8a56";
      ctx.textAlign = "center";
      ctx.fillText(name.toUpperCase(), canvas.width / 2, canvas.height * 0.55);
    }

    // Thêm nội dung với font serif
    if (name && treeCount) {
      const textFontSize = Math.floor(canvas.width / 60);
      ctx.font = `${textFontSize}px serif`;
      ctx.fillStyle = "#333333";
      ctx.textAlign = "center";
      const text = `Nhằm ghi nhận đóng góp của bạn đã góp ${treeCount} cây trong việc trồng rừng trên dự án.`;
      ctx.fillText(text, canvas.width / 2, canvas.height * 0.62);

      const text2 =
        "Sự tận tâm và công sức của bạn đã tạo lên tác động đáng kể.";
      ctx.fillText(text2, canvas.width / 2, canvas.height * 0.65);

      // Thêm ngày
      ctx.fillText(formattedDate, canvas.width / 2, canvas.height * 0.7);
    }

    setCanvasReady(true);
    setIsGenerating(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Đặt kích thước canvas
    canvas.width = 1200;
    canvas.height = 800;

    if (video) {
      const handleVideoLoad = () => {
        console.log("Video loaded successfully");
        // Vẽ khung hình video đầu tiên
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        drawCertificate(ctx, canvas);
      };

      const handleVideoError = (e: Event) => {
        const video = e.target as HTMLVideoElement;
        const error = video?.error;
        console.error("Video loading error:", {
          code: error?.code,
          message: error?.message,
        });
        setError("Không thể tải video. Sử dụng nền mặc định.");
        drawCertificate(ctx, canvas);
      };
      if (video.readyState >= 2) {
        handleVideoLoad();
      } else {
        video.addEventListener("loadeddata", handleVideoLoad, { once: true });
        video.addEventListener("error", handleVideoError, { once: true });
        video.load();
      }

      // Đặt timeout trong trường hợp video không tải
      setTimeout(() => {
        if (!canvasReady && !error) {
          console.log("Video loading timed out, generating without video");
          drawCertificate(ctx, canvas);
        }
      }, 5000);
    } else {
      // Không có video, vẽ chứng nhận với nền gradient
      drawCertificate(ctx, canvas);
    }
  }, [name, treeCount, treeId, note, formattedDate]);

  const downloadStaticCertificate = async () => {
    if (!canvasRef.current || !canvasReady) return;

    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `certificate-${treeId}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareCertificate = async () => {
    if (!canvasRef.current || !canvasReady) return;

    try {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png");
      const blob = await (await fetch(image)).blob();

      if (navigator.share) {
        await navigator.share({
          title: "Chứng nhận đóng góp",
          text: `Tôi vừa đóng góp ${treeCount} cây xanh!`,
          files: [new File([blob], "certificate.png", { type: "image/png" })],
        });
      } else {
        // Fallback nếu Web Share API không khả dụng
        downloadStaticCertificate();
      }
    } catch (error) {
      console.error("Error sharing certificate:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {showButtons && (
        <div className="mb-4 flex flex-wrap gap-3 justify-center">
          <Button
            onClick={downloadStaticCertificate}
            disabled={isDownloading || !canvasReady}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Download size={16} />
            {isDownloading ? "Đang tạo..." : "Tải chứng nhận"}
          </Button>
          <Button
            onClick={shareCertificate}
            disabled={!canvasReady}
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50 flex items-center gap-2"
          >
            <Share2 size={16} />
            Chia sẻ
          </Button>
        </div>
      )}

      <Card className="w-full max-w-3xl overflow-hidden">
        <CardContent className="p-4">
          <div className="w-full relative">
            {/* Phần tử video ẩn để xử lý */}
            <div className="hidden">
              <video
                ref={videoRef}
                src="/videos/certificate-video.mp4"
                preload="auto"
                crossOrigin="anonymous"
                muted
                playsInline
                style={{
                  width: "1px",
                  height: "1px",
                  position: "absolute",
                  opacity: 0,
                }}
              />
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <canvas
                ref={canvasRef}
                className="w-full h-auto border shadow-md"
              ></canvas>
            </div>

            {(!canvasReady || isGenerating) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center p-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mb-2"></div>
                  <p className="text-sm text-gray-600">
                    {isGenerating
                      ? "Đang thiết kế chứng nhận..."
                      : "Đang tạo chứng nhận..."}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Vui lòng đợi trong giây lát
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100/80">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
