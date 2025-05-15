"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Loader2, RefreshCw, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CertificateGeneratorProps {
  name: string;
  treeCount: number;
  treeId: string;
  note?: string;
  date?: Date;
  onGenerated?: (videoUrl: string) => void;
}

export default function CertificateGenerator({
  name,
  treeCount,
  treeId,
  note,
  date = new Date(),
  onGenerated,
}: CertificateGeneratorProps) {
  const displayVideoRef = useRef<HTMLVideoElement>(null);
  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [certificateVideoUrl, setCertificateVideoUrl] = useState<string | null>(
    null,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useImageFallback, setUseImageFallback] = useState(false);
  const [activeTab, setActiveTab] = useState("video");

  const certificateVideoPath = "/videos/certification-of-forest-planting.mp4";
  const certificateImagePath = "/images/certificate-sample.png";

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  useEffect(() => {
    const checkVideoAvailability = async () => {
      try {
        const response = await fetch(certificateVideoPath, { method: "HEAD" });
        if (!response.ok) {
          setUseImageFallback(true);
          setActiveTab("image");
          return;
        }
        const video = document.createElement("video");
        const loadPromise = new Promise<void>((resolve, reject) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => reject(new Error("Không thể tải video"));
          setTimeout(() => reject(new Error("Hết thời gian tải video")), 5000);
        });

        video.src = certificateVideoPath;
        video.load();

        await loadPromise;
        setUseImageFallback(false);
      } catch (err) {
        console.error("Lỗi kiểm tra video:", err);
        setUseImageFallback(true);
        setActiveTab("image");
      }
    };

    checkVideoAvailability();
  }, [certificateVideoPath]);

  const generateImageCertificate = async () => {
    try {
      if (!canvasRef.current) {
        throw new Error("Không tìm thấy canvas");
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Không thể lấy context của canvas");
      }

      canvas.width = 1280;
      canvas.height = 720;

      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error("Không thể tải hình nền chứng nhận"));
        img.src = certificateImagePath;
      });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (name) {
        const nameFontSize = Math.floor(canvas.width / 18);
        ctx.font = `${nameFontSize}px serif`;
        ctx.fillStyle = "#2c8a56";
        ctx.textAlign = "center";
        ctx.fillText(
          name.toUpperCase(),
          canvas.width / 2,
          canvas.height * 0.55,
        );
      }

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

        ctx.fillText(formattedDate, canvas.width / 2, canvas.height * 0.7);

        if (note) {
          ctx.font = `italic ${textFontSize}px serif`;
          ctx.fillText(`"${note}"`, canvas.width / 2, canvas.height * 0.75);
        }
      }

      const imageUrl = canvas.toDataURL("image/png");
      setCertificateVideoUrl(imageUrl);

      if (onGenerated) {
        onGenerated(imageUrl);
      }
    } catch (err) {
      console.error("Lỗi tạo chứng nhận hình ảnh:", err);
      setError(
        "Lỗi khi tạo chứng nhận hình ảnh: " +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  };

  const generateVideoCertificate = async () => {
    setIsGeneratingVideo(true);
    setGenerationProgress(0);
    setError(null);

    if (useImageFallback) {
      await generateImageCertificate();
      setIsGeneratingVideo(false);
      return;
    }

    if (!canvasRef.current) {
      console.error("Không tìm thấy canvas, chuyển sang chứng nhận hình ảnh");
      setUseImageFallback(true);
      await generateImageCertificate();
      setIsGeneratingVideo(false);
      return;
    }

    try {
      const processingVideo = document.createElement("video");
      processingVideo.muted = true;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Không thể lấy context của canvas");
      }
      const videoLoadPromise = new Promise<void>((resolve, reject) => {
        processingVideo.onloadeddata = () => resolve();
        processingVideo.onerror = () =>
          reject(new Error("Không thể tải video"));
        setTimeout(() => reject(new Error("Hết thời gian tải video")), 10000);
      });

      processingVideo.src = certificateVideoPath;
      processingVideo.load();

      await videoLoadPromise;

      canvas.width = processingVideo.videoWidth || 1280;
      canvas.height = processingVideo.videoHeight || 720;

      let stream;
      try {
        stream = canvas.captureStream(30);
      } catch (err) {
        console.error("Lỗi tạo luồng canvas, chuyển sang hình ảnh:", err);
        setUseImageFallback(true);
        await generateImageCertificate();
        setIsGeneratingVideo(false);
        return;
      }

      let mediaRecorderOptions = {};
      let isMP4Supported = false;

      try {
        const testRecorder = new MediaRecorder(stream, {
          mimeType: "video/mp4; codecs=avc1.42E01E",
        });
        mediaRecorderOptions = {
          mimeType: "video/mp4; codecs=avc1.42E01E",
          videoBitsPerSecond: 5000000,
        };
        isMP4Supported = true;
      } catch (e) {
        try {
          const testRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp8",
          });
          mediaRecorderOptions = {
            mimeType: "video/webm; codecs=vp8",
            videoBitsPerSecond: 5000000,
          };
        } catch (e2) {}
      }

      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      } catch (err) {
        console.error("Lỗi tạo MediaRecorder, chuyển sang hình ảnh:", err);
        setUseImageFallback(true);
        await generateImageCertificate();
        setIsGeneratingVideo(false);
        return;
      }

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: isMP4Supported ? "video/mp4" : "video/webm",
        });

        const url = URL.createObjectURL(blob);
        setCertificateVideoUrl(url);
        setIsGeneratingVideo(false);
        setGenerationProgress(100);

        if (onGenerated) {
          onGenerated(url);
        }
      };

      mediaRecorder.start(100);
      processingVideo.currentTime = 0;

      const drawFrame = () => {
        ctx.drawImage(processingVideo, 0, 0, canvas.width, canvas.height);

        if (name) {
          const nameFontSize = Math.floor(canvas.width / 18);
          ctx.font = `${nameFontSize}px serif`;
          ctx.fillStyle = "#2c8a56";
          ctx.textAlign = "center";
          ctx.fillText(
            name.toUpperCase(),
            canvas.width / 2,
            canvas.height * 0.55,
          );
        }

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

          ctx.fillText(formattedDate, canvas.width / 2, canvas.height * 0.7);

          if (note) {
            ctx.font = `italic ${textFontSize}px serif`;
            ctx.fillText(`"${note}"`, canvas.width / 2, canvas.height * 0.75);
          }
        }

        setGenerationProgress(
          (processingVideo.currentTime / processingVideo.duration) * 100,
        );

        if (!processingVideo.paused && !processingVideo.ended) {
          requestAnimationFrame(drawFrame);
        } else {
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        }
      };

      const playPromise = processingVideo.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            drawFrame();
          })
          .catch((err) => {
            console.error("Lỗi phát video, chuyển sang hình ảnh:", err);
            setUseImageFallback(true);
            generateImageCertificate();
            setIsGeneratingVideo(false);
          });
      }

      processingVideo.addEventListener(
        "ended",
        () => {
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        },
        { once: true },
      );
    } catch (err) {
      console.error("Lỗi tạo chứng nhận video:", err);
      setError(
        "Lỗi khi tạo chứng nhận video: " +
          (err instanceof Error ? err.message : String(err)),
      );
      setIsGeneratingVideo(false);

      try {
        setUseImageFallback(true);
        await generateImageCertificate();
      } catch (imgErr) {
        console.error("Lỗi tạo chứng nhận hình ảnh dự phòng:", imgErr);
      }
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const timer = setTimeout(() => {
      generateVideoCertificate();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  const handleVideoError = (e: any) => {
    console.error("Lỗi video:", e);
    const errorMessage =
      e?.message || "Không thể tải video chứng nhận. Vui lòng thử lại sau.";
    setError(`Lỗi khi tải video: ${errorMessage}`);
    setIsLoading(false);
    setActiveTab("image");
  };

  const downloadCertificate = async () => {
    if (!certificateVideoUrl) return;
    setIsDownloading(true);
    try {
      if (useImageFallback) {
        const link = document.createElement("a");
        link.href = certificateVideoUrl;
        link.download = `certificate-${treeId}.png`;
        link.click();
      } else {
        const response = await fetch(certificateVideoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificate-${treeId}.mp4`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Lỗi tải chứng nhận:", err);
      setError("Có lỗi xảy ra khi tải chứng nhận. Vui lòng thử lại sau.");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareCertificate = async () => {
    if (!certificateVideoUrl) return;

    try {
      if (useImageFallback) {
        const response = await fetch(certificateVideoUrl);
        const blob = await response.blob();

        if (navigator.share) {
          await navigator.share({
            title: "Chứng nhận đóng góp",
            text: `Tôi vừa đóng góp ${treeCount} cây xanh!`,
            files: [new File([blob], "certificate.png", { type: "image/png" })],
          });
        } else {
          downloadCertificate();
        }
      } else {
        const response = await fetch(certificateVideoUrl);
        const blob = await response.blob();

        if (navigator.share) {
          await navigator.share({
            title: "Chứng nhận đóng góp",
            text: `Tôi vừa đóng góp ${treeCount} cây xanh!`,
            files: [new File([blob], "certificate.mp4", { type: "video/mp4" })],
          });
        } else {
          downloadCertificate();
        }
      }
    } catch (err) {
      console.error("Lỗi chia sẻ chứng nhận:", err);
      setError("Có lỗi xảy ra khi chia sẻ chứng nhận. Vui lòng thử lại sau.");
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-800">
              Chứng nhận đóng góp
            </h3>
            <p className="text-sm text-gray-500">Mã chứng nhận: {treeId}</p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-1 mb-4">
              <TabsTrigger value="video" disabled={useImageFallback}>
                Chứng nhận video
                {useImageFallback && (
                  <span className="ml-2 text-xs text-red-500">*</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video">
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                {useImageFallback ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
                    <ImageIcon className="h-12 w-12 mb-2 text-yellow-500" />
                    <p className="text-center">
                      Chứng nhận video không khả dụng. Vui lòng sử dụng chứng
                      nhận hình ảnh.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-white text-white hover:bg-white/20"
                      onClick={() => setActiveTab("image")}
                    >
                      Chuyển sang chứng nhận hình ảnh
                    </Button>
                  </div>
                ) : certificateVideoUrl && !error ? (
                  <video
                    ref={displayVideoRef}
                    src={certificateVideoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    loop
                    playsInline
                    onLoadedData={handleVideoLoaded}
                    onError={handleVideoError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {isGeneratingVideo ? (
                      <div className="text-center text-white">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                        <p>
                          Đang tạo chứng nhận video...{" "}
                          {Math.round(generationProgress)}%
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-white">
                        <p className="mb-4">
                          Chứng nhận video đang được tạo tự động...
                        </p>
                        <Button
                          onClick={generateVideoCertificate}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        >
                          <RefreshCw size={16} />
                          Tạo lại chứng nhận video
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {error && !useImageFallback && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white p-4">
                      <p className="text-red-300 mb-2">{error}</p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white/20"
                          onClick={() => {
                            setError(null);
                            generateVideoCertificate();
                          }}
                        >
                          Thử lại
                        </Button>
                        <Button
                          variant="outline"
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/20"
                          onClick={() => {
                            setUseImageFallback(true);
                            setActiveTab("image");
                            generateImageCertificate();
                          }}
                        >
                          Dùng chứng nhận hình ảnh
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <canvas ref={canvasRef} className="hidden" />

          {useImageFallback && activeTab === "video" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm">
              <p className="text-yellow-700">
                Chứng nhận video không khả dụng do trình duyệt của bạn không hỗ
                trợ hoặc video nền không thể tải được. Vui lòng sử dụng chứng
                nhận hình ảnh.
              </p>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="font-semibold text-lg">{name}</p>
            <p className="text-gray-700">
              Đã đóng góp {treeCount} cây xanh vào ngày {formattedDate}
            </p>
            {note && <p className="text-gray-600 italic">"{note}"</p>}
          </div>

          {certificateVideoUrl && !error && !isGeneratingVideo && (
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <Button
                onClick={downloadCertificate}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Download size={16} />
                {isDownloading ? "Đang tải..." : "Tải chứng nhận"}
              </Button>
              <Button
                onClick={shareCertificate}
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 flex items-center gap-2"
              >
                <Share2 size={16} />
                Chia sẻ
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
