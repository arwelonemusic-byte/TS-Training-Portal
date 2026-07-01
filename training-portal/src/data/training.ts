// ── Training progression data ────────────────────────────────────────────────
// Each role tier has manuals. A role is "completed" when all its manuals' tests
// are passed. Unlocking is determined by Discord roles (read-only from portal).

export interface Manual {
  id: string;
  title: string;
  href: string;
  testHref: string;
}

export interface RoleTier {
  id: string;
  title: string;
  description: string;
  /** Discord roles required to unlock this tier */
  requiredRoles: string[];
  /** Discord role granted upon completing this tier (used to infer completion from existing roles) */
  grantsRole: string | null;
  /** Discord role names the bot auto-assigns on tier completion. Undefined/empty = granted manually by an admin. */
  botRoles?: string[];
  /** Whether this tier requires in-game confirmation before the next tier unlocks */
  requiresInGameConfirmation: boolean;
  manuals: Manual[];
}

export const trainingProgression: RoleTier[] = [
  {
    id: "basic",
    title: "Вводный инструктаж",
    description:
      "Вводный инструктаж для новоприбывших, желающих принять участие в играх на сервере Tactical Shift. Базовые правила безопасности и взаимодействия: дисциплина огня, работа в радиоэфире, обращение с гранатами и действия при ранении союзника.",
    requiredRoles: [],
    grantsRole: "Basic",
    botRoles: ["Basic", "Famil"],
    requiresInGameConfirmation: false,
    manuals: [
      {
        id: "intro",
        title: "Вводный инструктаж",
        href: "/manual/intro",
        testHref: "/test/intro",
      },
    ],
  },
  {
    id: "rifleman",
    title: "Стрелок и Пулемётчик",
    description:
      "Структура отряда, построения, радиообмен, контакт-репорты, правила боя, медпомощь и работа в двойке — всё, что нужно знать рядовому бойцу, чтобы эффективно действовать в составе фаертимы.",
    requiredRoles: ["Basic"],
    grantsRole: "Rifleman",
    botRoles: ["Rifleman", "MachineGunner"],
    requiresInGameConfirmation: false,
    manuals: [
      {
        id: "rifleman",
        title: "Обучение на стрелка и пулемётчика",
        href: "/manual/rifleman",
        testHref: "/test/rifleman",
      },
    ],
  },
  {
    id: "grenadier",
    title: "Гренадер",
    description:
      "Обязанности старшего второй двойки, применение подствольного гранатомёта, нарезание пирога, хай-лоу и движение шевроном.",
    requiredRoles: ["Rifleman", "MachineGunner"],
    grantsRole: "Grenadier",
    botRoles: ["FTO", "Grenadier"],
    requiresInGameConfirmation: false,
    manuals: [
      {
        id: "grenadier",
        title: "Обучение на гренадера",
        href: "/manual/grenadier",
        testHref: "/test/grenadier",
      },
    ],
  },
  {
    id: "ftl",
    title: "Лидер команды (FTL)",
    description:
      "Цикл контроля, коммуникация, оценка местности, удержание контроля, ведение боя, зоны безопасности, ACE доклад и использование бинокля.",
    requiredRoles: ["Grenadier"],
    grantsRole: "FTL",
    botRoles: ["FTL"],
    requiresInGameConfirmation: true,
    manuals: [
      {
        id: "ftl",
        title: "Обучение на FTL",
        href: "/manual/ftl",
        testHref: "/test/ftl",
      },
    ],
  },
  {
    id: "sl",
    title: "Командир отделения (SL)",
    description:
      "Командир отделения должен уметь читать карту и ставить маркеры, организовывать движение колонной и грамотно вести радиообмен для координации подразделений.",
    requiredRoles: ["FTL"],
    grantsRole: "SL",
    requiresInGameConfirmation: true,
    manuals: [
      {
        id: "landnav",
        title: "LandNav и Графические меры контроля",
        href: "/manual/landnav",
        testHref: "/test/landnav",
      },
      {
        id: "convoy",
        title: "Convoy Ops — Движение колонной",
        href: "/manual/convoy",
        testHref: "/test/convoy",
      },
      {
        id: "rto",
        title: "RTO — Единые правила радиообмена",
        href: "/manual/rto",
        testHref: "/test/rto",
      },
      {
        id: "squad-leadership",
        title: "Командование отделением (SL)",
        href: "/manual/squad-leadership",
        testHref: "/test/squad-leadership",
      },
    ],
  },
  {
    id: "pl",
    title: "Командир взвода (PL)",
    description:
      "Сюрприз! Никаких методичек и тестов. Роль могут получить все желающие, отыгравшие несколько игр на роли SL.",
    requiredRoles: ["SL"],
    grantsRole: "PL",
    requiresInGameConfirmation: true,
    manuals: [],
  },
];

// ── Extra training materials (not part of the main progression) ──────────────

export const extrasProgression: RoleTier[] = [
  {
    id: "scenario-creation",
    title: "Создание миссий для Arma Reforger",
    description:
      "Пошаговое руководство по созданию сценариев в Enfusion Workbench с TS Mission Toolkit: настройка проекта, менеджеры, спавн, AI-зоны, плагины для ботов, маркеры, арсенал и публикация мода в Workshop.",
    requiredRoles: [],
    grantsRole: null,
    requiresInGameConfirmation: false,
    manuals: [
      {
        id: "scenario-creation",
        title: "Создание миссий для Arma Reforger",
        href: "/manual/scenario-creation",
        testHref: "/test/scenario-creation",
      },
    ],
  },
  {
    id: "armoured-crew",
    title: "Armoured Crew — Экипаж тяжёлой техники",
    description:
      "Роли в экипаже бронетехники, коммуникация внутри машины, приказы водителю и стрелку, целеуказание и советы по тактике применения тяжёлой техники.",
    requiredRoles: ["SL"],
    grantsRole: null,
    requiresInGameConfirmation: true,
    manuals: [
      {
        id: "armoured-crew",
        title: "Armoured Crew — Экипаж тяжёлой техники",
        href: "/manual/armoured-crew",
        testHref: "/test/armoured-crew",
      },
    ],
  },
];
