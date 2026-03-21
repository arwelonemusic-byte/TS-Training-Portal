import { Composition } from "remotion";
import { FileFormation } from "./TacticalShift";
import { StaggeredColumn } from "./StaggeredColumn";
import { Chevron } from "./Chevron";
import { Line } from "./Line";
import { ChevronToLine } from "./ChevronToLine";
import { FileToChevronAR } from "./FileToChevronAR";
import { FileToChevronARMirrored } from "./FileToChevronARMirrored";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="File"
        component={FileFormation}
        durationInFrames={100}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="StaggeredColumn"
        component={StaggeredColumn}
        durationInFrames={200}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="Chevron"
        component={Chevron}
        durationInFrames={100}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="Line"
        component={Line}
        durationInFrames={120}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="ChevronToLine"
        component={ChevronToLine}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="FileToChevronAR"
        component={FileToChevronAR}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
      <Composition
        id="FileToChevronARMirrored"
        component={FileToChevronARMirrored}
        durationInFrames={150}
        fps={30}
        width={600}
        height={600}
      />
    </>
  );
};
