export function SectionHeading({
  eyebrow,
  title,
  lead
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold tracking-brand text-brown/70">{eyebrow}</p>
      ) : null}
      <h2 className="font-serifjp text-3xl leading-relaxed tracking-[0.12em] text-sumi md:text-5xl">
        {title}
      </h2>
      {lead ? <p className="mx-auto mt-6 max-w-2xl leading-8 text-sumi/70">{lead}</p> : null}
    </div>
  );
}
