"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Environment, Sparkles } from "@react-three/drei";
import { Color } from "three";
import { Stars } from "@/components/effects/Stars";
import { Ground } from "@/components/forest/Ground";
import { GroundFlowers } from "@/components/forest/GroundFlowers";
import { ForestElements } from "@/components/forest/ForestElements";
import { CameraController } from "@/components/forest/CameraController";
import { CloudGroup } from "@/components/forest/CloudGroup";
import { TopNavigation } from "@/components/ui/TopNavigation";
import { ControlPanel } from "@/components/ui/ControlPanel";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Contributor, ForestElement } from "@/lib/types";
import { ElementTooltip } from "@/components/ui/ElementTooltip";

interface TropicalForestProps {
  contributors: Contributor[];
  totalStats: {
    totalQuantity: number;
    totalTreeCount: number;
    contributorCount: number;
  };
}

export function TropicalForest({
  contributors,
  totalStats,
}: TropicalForestProps) {
  const [showUI, setShowUI] = useState(true);
  const [isNight, setIsNight] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [minimizePanel, setMinimizePanel] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ForestElement | null>(
    null,
  );
  const [showNames, setShowNames] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContributors, setFilteredContributors] =
    useState(contributors);
  const cameraControllerRef = useRef(null);

  // Tối ưu hiệu suất
  const treeCount = 10;
  const flowerDensity = 30;

  // Tối ưu search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = query
      ? contributors.filter((contributor) =>
          contributor.name.toLowerCase().includes(query.toLowerCase()),
        )
      : contributors;
    setFilteredContributors(filtered);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-emerald-400 to-teal-600 relative overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 55 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        className="transition-all duration-1000"
        style={{
          background: isNight
            ? "linear-gradient(to bottom, #0f172a, #1e293b)"
            : "none",
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isNight ? 0.1 : 0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={isNight ? 0.2 : 1.2}
            castShadow
            shadow-mapSize={[512, 512]}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />

          <Sky
            distance={450000}
            sunPosition={isNight ? [0, -10, 0] : [10, 5, 10]}
            inclination={isNight ? 0 : 0.5}
            azimuth={0.25}
            rayleigh={isNight ? 2 : 0.5}
            turbidity={isNight ? 20 : 10}
            mieCoefficient={isNight ? 0.1 : 0.005}
          />
          <Environment
            preset={isNight ? "night" : "forest"}
            background={false}
          />

          {isNight && (
            <Stars
              radius={100}
              depth={50}
              count={2000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
          )}

          <Ground />
          <GroundFlowers count={flowerDensity} />
          <ForestElements
            treeCount={treeCount}
            onSelect={setSelectedElement}
            contributors={filteredContributors}
            showNames={showNames}
            highlightedContributor={searchQuery}
          />
          <Sparkles
            count={30}
            scale={50}
            size={isNight ? 4 : 2}
            speed={0.2}
            color={
              new Color(
                isNight ? 0.5 : 1,
                isNight ? 0.5 : 1,
                isNight ? 0.8 : 0.8,
              )
            }
          />
          <CloudGroup isNight={isNight} />
          <CameraController ref={cameraControllerRef} />

          {selectedElement && (
            <ElementTooltip
              element={selectedElement}
              onClose={() => setSelectedElement(null)}
            />
          )}
        </Suspense>
      </Canvas>

      {showUI && (
        <>
          <TopNavigation
            isNight={isNight}
            setIsNight={setIsNight}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            showNames={showNames}
            setShowNames={setShowNames}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
          <ControlPanel
            minimizePanel={minimizePanel}
            setMinimizePanel={setMinimizePanel}
            setShowUI={setShowUI}
          />
        </>
      )}

      {showInfo && (
        <InfoPanel
          treeCount={treeCount}
          onClose={() => setShowInfo(false)}
          contributors={contributors}
          totalStats={totalStats}
        />
      )}

      {!showUI && (
        <Button
          className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-full px-4"
          onClick={() => setShowUI(true)}
        >
          <Maximize size={16} className="mr-2" />
          Show Controls
        </Button>
      )}
    </div>
  );
}
