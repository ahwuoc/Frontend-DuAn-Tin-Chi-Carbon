"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface VideoCertificateProps {
  name: string;
  treeCount: number;
  treeId: string;
  note?: string;
}

export default function VideoCertificate({
  name,
  treeCount,
  treeId,
  note,
}: VideoCertificateProps) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outputVideoRef = useRef<HTMLVideoElement>(null);

  // Format date in Vietnamese
  const formatDateInVietnamese = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `Ngày ${day} tháng ${month} năm ${year}`;
  };

  useEffect(() => {
    // Generate certificate when component mounts
    generateCertificate();
  }, []);

  const generateCertificate = async () => {
    console.log("Bắt đầu generate video chứng nhận");
    setProcessing(true);
    setError(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        throw new Error("Không tìm thấy video hoặc canvas");
      }

      // Make sure video is loaded
      if (video.readyState < 2) {
        await new Promise((resolve) => {
          video.addEventListener("loadeddata", resolve, { once: true });
        });
      }

      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Get canvas context
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Không thể lấy context của canvas");
      }

      // Create a MediaRecorder to record the canvas
      const stream = canvas.captureStream(30); // 30 FPS

      // Try to determine the best supported format
      let mediaRecorderOptions = {};
      let isMP4Supported = false;

      try {
        const testRecorder = new MediaRecorder(stream, {
          mimeType: "video/mp4; codecs=avc1.42E01E",
        });
        mediaRecorderOptions = {
          mimeType: "video/mp4; codecs=avc1.42E01E",
          videoBitsPerSecond: 5000000, // 5 Mbps
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
        } catch (e2) {
          // Use default options if nothing else works
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create a blob from the recorded chunks
        const blob = new Blob(chunks, {
          type: isMP4Supported ? "video/mp4" : "video/webm",
        });

        const url = URL.createObjectURL(blob);
        setProcessedVideoUrl(url);
        setProcessing(false);
        setLoading(false);
        console.log("Video chứng nhận đã được generate thành công:", url);
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms

      // Reset video to beginning
      video.currentTime = 0;

      // Function to draw the current frame with text overlay
      const drawFrame = () => {
        // Draw the current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Add name with serif font
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

        // Add content with serif font
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

          // Add date
          const date = formatDateInVietnamese();
          ctx.fillText(date, canvas.width / 2, canvas.height * 0.7);
        }

        // Continue if video is still playing
        if (!video.paused && !video.ended) {
          requestAnimationFrame(drawFrame);
        } else {
          // Stop recording when video ends
          mediaRecorder.stop();
        }
      };

      // Start playing the video
      video.play();

      // Start drawing frames
      drawFrame();

      // Listen for video end
      video.addEventListener(
        "ended",
        () => {
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        },
        { once: true },
      );
    } catch (err) {
      const errorMessage =
        "Lỗi khi generate video chứng nhận: " +
        (err instanceof Error ? err.message : String(err));
      setError(errorMessage);
      setProcessing(false);
      setLoading(false);
      console.error(errorMessage);
    }
  };

  const downloadCertificate = () => {
    try {
      if (!processedVideoUrl) {
        setError("Không có video đã xử lý để tải xuống");
        return;
      }

      const link = document.createElement("a");
      link.download = `chung-nhan-gop-cay-${name.replace(/\s+/g, "-") || "unnamed"}.mp4`;
      link.href = processedVideoUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Đã tải xuống video chứng nhận");
    } catch (err) {
      const errorMessage =
        "Lỗi khi tải xuống video: " +
        (err instanceof Error ? err.message : String(err));
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  const shareCertificate = async () => {
    if (!processedVideoUrl) {
      setError("Không có video đã xử lý để chia sẻ");
      return;
    }

    try {
      // Convert URL to blob for sharing
      const response = await fetch(processedVideoUrl);
      const blob = await response.blob();

      if (navigator.share) {
        await navigator.share({
          title: "Chứng nhận góp cây xanh",
          text: `Tôi vừa đóng góp ${treeCount} cây xanh cho dự án Tín Chỉ Carbon!`,
          files: [new File([blob], "certificate.mp4", { type: "video/mp4" })],
        });
        console.log("Đã chia sẻ video chứng nhận");
      } else {
        // Fallback if Web Share API is not available
        downloadCertificate();
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ chứng nhận:", error);
      // Fallback to download
      downloadCertificate();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center">Chứng nhận video</h3>

      {/* Hidden video element for processing */}
      <div className="hidden">
        <video
          ref={videoRef}
          src="/videos/certificate-video.mp4"
          preload="auto"
          crossOrigin="anonymous"
        />
        <canvas ref={canvasRef}></canvas>
      </div>

      {/* Display area */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="h-[300px] flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Đang tạo chứng nhận...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center bg-gray-50">
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
              <Button onClick={generateCertificate} className="mt-4">
                Thử lại
              </Button>
            </div>
          </div>
        ) : (
          <video
            ref={outputVideoRef}
            src={processedVideoUrl || undefined}
            className="w-full h-auto"
            controls
            autoPlay
            loop
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={downloadCertificate}
          disabled={!processedVideoUrl || loading}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Download size={16} />
          Tải chứng nhận video
        </Button>
        <Button
          onClick={shareCertificate}
          disabled={!processedVideoUrl || loading}
          variant="outline"
          className="border-green-600 text-green-700 hover:bg-green-50 flex items-center gap-2"
        >
          <Share2 size={16} />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
}
