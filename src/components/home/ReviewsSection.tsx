import Cloud from '@/components/Cloud';
import ReviewsInteractive from './ReviewsInteractive';
import { getCachedGoogleReviews } from '@/lib/googleReviews';

export default async function ReviewsSection() {
  const snapshot = await getCachedGoogleReviews();

  return (
    <section
      aria-labelledby="reviews-title"
      className="relative isolate overflow-hidden bg-[#FFF0DE] px-6 pb-24 pt-24 md:pb-28 md:pt-28"
    >
      <Cloud position="top" color="#FFF0DE" />

      <div aria-hidden="true" className="pointer-events-none absolute left-[5%] top-24 hidden h-16 w-16 rounded-full bg-[#F4A261]/20 blur-2xl md:block" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-20 right-[7%] hidden h-24 w-24 rounded-full bg-[#D684BF]/20 blur-2xl md:block" />

      <div className="relative z-20 mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-[#CC4B00]">
            Carinho que vira conquista
          </p>
          <h2 id="reviews-title" className="font-avenir text-3xl font-black leading-tight text-gray-800 md:text-4xl lg:text-5xl">
            Histórias de quem confia na Divertin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            Cada mensagem representa uma família, uma parceria e muitos passos importantes no desenvolvimento das crianças.
          </p>
        </div>

        <ReviewsInteractive snapshot={snapshot} />
      </div>
    </section>
  );
}
