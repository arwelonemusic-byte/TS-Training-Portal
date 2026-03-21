export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; text: string; variant: "info" | "warning" | "important" }
  | {
      type: "formation";
      name: string;
      gif: string;
      description: string;
      pros: string[];
      cons: string[];
    }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "example"; lines: string[] }
  | { type: "procedure"; steps: string[] };

export interface ManualSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface TestQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
}

export interface TestResult {
  questionId: number;
  selectedKey: string;
  isCorrect: boolean;
}
