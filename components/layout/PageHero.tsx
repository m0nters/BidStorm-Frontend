interface PageHeroProps {
  title: string;
  subtitle: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-900 to-black py-20 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl filter" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white blur-3xl filter" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold md:text-6xl">{title}</h1>
          <p className="mt-4 text-xl text-gray-300">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
