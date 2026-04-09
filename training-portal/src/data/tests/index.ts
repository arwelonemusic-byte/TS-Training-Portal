import type { TestQuestion } from "@/types";

import * as intro from "./intro";
import * as rifleman from "./rifleman";
import * as grenadier from "./grenadier";
import * as ftl from "./ftl";
import * as landnav from "./landnav";
import * as convoy from "./convoy";
import * as rto from "./rto";
import * as armouredCrew from "./armoured-crew";
import * as scenarioCreation from "./scenario-creation";

export interface TestConfig {
  questions: TestQuestion[];
  passThreshold: number;
  title: string;
  /** Manual ID this test belongs to, for back-navigation */
  manualId: string;
}

export const testRegistry: Record<string, TestConfig> = {
  intro: {
    questions: intro.questions,
    passThreshold: intro.PASS_THRESHOLD,
    title: "Вводный инструктаж",
    manualId: "intro",
  },
  rifleman: {
    questions: rifleman.questions,
    passThreshold: rifleman.PASS_THRESHOLD,
    title: "Стрелок и пулемётчик",
    manualId: "rifleman",
  },
  grenadier: {
    questions: grenadier.questions,
    passThreshold: grenadier.PASS_THRESHOLD,
    title: "Гренадер",
    manualId: "grenadier",
  },
  ftl: {
    questions: ftl.questions,
    passThreshold: ftl.PASS_THRESHOLD,
    title: "Лидер команды (FTL)",
    manualId: "ftl",
  },
  landnav: {
    questions: landnav.questions,
    passThreshold: landnav.PASS_THRESHOLD,
    title: "LandNav и Графические меры контроля",
    manualId: "landnav",
  },
  convoy: {
    questions: convoy.questions,
    passThreshold: convoy.PASS_THRESHOLD,
    title: "Convoy Ops — Движение колонной",
    manualId: "convoy",
  },
  rto: {
    questions: rto.questions,
    passThreshold: rto.PASS_THRESHOLD,
    title: "RTO — Единые правила радиообмена",
    manualId: "rto",
  },
  "armoured-crew": {
    questions: armouredCrew.questions,
    passThreshold: armouredCrew.PASS_THRESHOLD,
    title: "Armoured Crew — Экипаж тяжёлой техники",
    manualId: "armoured-crew",
  },
  "scenario-creation": {
    questions: scenarioCreation.questions,
    passThreshold: scenarioCreation.PASS_THRESHOLD,
    title: "Создание миссий для Arma Reforger",
    manualId: "scenario-creation",
  },
};
