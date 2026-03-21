import Image from "next/image";

interface FormationCardProps {
  name: string;
  gif: string;
  description: string;
  pros: string[];
  cons: string[];
}

export default function FormationCard({
  name,
  gif,
  description,
  pros,
  cons,
}: FormationCardProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border-military bg-bg-card">
      <div className="flex justify-center bg-black/20 p-4">
        <Image
          src={`/animations/${gif}`}
          alt={name}
          width={400}
          height={400}
          unoptimized
          className="rounded"
        />
      </div>
      <div className="p-5">
        <p className="mb-4 text-text-primary">{description}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-accent-green-light">
              Плюсы
            </h4>
            <ul className="space-y-1">
              {pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-0.5 text-accent-green">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-accent-red">
              Минусы
            </h4>
            <ul className="space-y-1">
              {cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-0.5 text-accent-red">−</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
