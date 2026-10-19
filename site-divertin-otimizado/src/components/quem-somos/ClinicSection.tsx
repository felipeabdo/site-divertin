"use client";

import { useCallback, useState } from "react";
import { Blob, Dashes } from "./Decor";
import ImageModal from "./ImageModal";
import Photo from "./Photo";
import { CLINIC_GALLERY, CLINIC_MAIN, H2, PAL, type ClinicPhoto } from "./data";


const VIEWABLE = [CLINIC_MAIN, ...CLINIC_GALLERY].filter(
  (p): p is ClinicPhoto & { src: string } => Boolean(p.src),
);

export default function ClinicSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  const openPhoto = (photo: ClinicPhoto) => {
    const i = VIEWABLE.findIndex((p) => p.src === photo.src);
    if (i >= 0) setOpenIndex(i);
  };

  return (
    <section className="relative mx-auto mt-24 max-w-6xl px-6">
      <Blob
        color={PAL.lime}
        radius="50% 50% 45% 55% / 55% 50% 50% 45%"
        className="-right-4 -top-4 hidden h-[64px] w-[58px] lg:block"
      />
      <Blob
        color={PAL.greenSoft}
        radius="50%"
        className="-left-4 top-[300px] hidden h-[40px] w-[40px] lg:block"
      />
      <Dashes
        color={PAL.green}
        className="-right-4 bottom-8 hidden lg:block"
        size={34}
        rotate={200}
      />

      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <h2 className={H2}>A clínica</h2>
          <p className="mt-1 text-xl font-semibold text-gray-700 md:text-2xl">
            Um espaço pensado para acolher
          </p>
          <p className="mt-4 max-w-[420px] text-base leading-relaxed text-gray-600 md:text-lg">
            Cada cantinho foi pensado para que crianças e famílias se sintam
            seguras, confortáveis e à vontade desde o primeiro encontro.
          </p>
          <Photo
            src={CLINIC_MAIN.src}
            alt={CLINIC_MAIN.alt}
            tone={CLINIC_MAIN.tone}
            icon={CLINIC_MAIN.icon}
            onClick={() => openPhoto(CLINIC_MAIN)}
            className="mt-6 h-[230px] w-full shadow-md lg:h-[240px] lg:w-[108%]"
            style={{ borderRadius: CLINIC_MAIN.radius }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {CLINIC_GALLERY.map((photo) => (
            <Photo
              key={photo.alt}
              src={photo.src}
              alt={photo.alt}
              tone={photo.tone}
              icon={photo.icon}
              onClick={() => openPhoto(photo)}
              className="h-[160px] shadow-md sm:h-[180px]"
              style={{ borderRadius: photo.radius }}
            />
          ))}
        </div>
      </div>

      <ImageModal
        images={VIEWABLE}
        index={openIndex}
        onClose={close}
        onChange={setOpenIndex}
      />
    </section>
  );
}
