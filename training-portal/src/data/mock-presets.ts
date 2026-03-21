export interface MockPreset {
  label: string;
  roles: string[];
  testResults: Record<string, { passed: boolean; score?: number; total?: number }>;
}

export const mockPresets: MockPreset[] = [
  {
    label: "Новичок",
    roles: [],
    testResults: {},
  },
  {
    label: "Basic",
    roles: ["Basic"],
    testResults: {
      intro: { passed: true, score: 12, total: 12 },
    },
  },
  {
    label: "Rifleman + MG",
    roles: ["Basic", "Rifleman", "MachineGunner"],
    testResults: {
      intro: { passed: true, score: 12, total: 12 },
      rifleman: { passed: true, score: 11, total: 12 },
    },
  },
  {
    label: "Grenadier",
    roles: ["Basic", "Rifleman", "MachineGunner", "Grenadier"],
    testResults: {
      intro: { passed: true, score: 12, total: 12 },
      rifleman: { passed: true, score: 11, total: 12 },
      grenadier: { passed: true, score: 14, total: 15 },
    },
  },
  {
    label: "FTL",
    roles: ["Basic", "Rifleman", "MachineGunner", "Grenadier", "FTL"],
    testResults: {
      intro: { passed: true, score: 12, total: 12 },
      rifleman: { passed: true, score: 11, total: 12 },
      grenadier: { passed: true, score: 14, total: 15 },
      ftl: { passed: true, score: 15, total: 16 },
    },
  },
  {
    label: "SL",
    roles: ["Basic", "Rifleman", "MachineGunner", "Grenadier", "FTL", "SL"],
    testResults: {
      intro: { passed: true, score: 12, total: 12 },
      rifleman: { passed: true, score: 11, total: 12 },
      grenadier: { passed: true, score: 14, total: 15 },
      ftl: { passed: true, score: 15, total: 16 },
      landnav: { passed: true, score: 15, total: 16 },
      convoy: { passed: true, score: 9, total: 10 },
      rto: { passed: true, score: 11, total: 12 },
    },
  },
  {
    label: "PL",
    roles: ["Basic", "Rifleman", "MachineGunner", "Grenadier", "FTL", "SL", "PL"],
    testResults: {
      intro: { passed: true, score: 12, total: 12 },
      rifleman: { passed: true, score: 11, total: 12 },
      grenadier: { passed: true, score: 14, total: 15 },
      ftl: { passed: true, score: 15, total: 16 },
      landnav: { passed: true, score: 15, total: 16 },
      convoy: { passed: true, score: 9, total: 10 },
      rto: { passed: true, score: 11, total: 12 },
    },
  },
];
