"use client";

import { useCallback, useState } from "react";
import { Blob, Dashes } from "./Decor";
import Cloud from "@/components/Cloud";
import ImageModal from "./ImageModal";
import Photo from "./Photo";
import { CLINIC_GALLERY, CLINIC_MAIN, H2, PAL, type ClinicPhoto } from "./data";
import EasterSectionDecor from "@/components/seasonal/EasterSectionDecor";

const VIEWABLE = [CLINIC_MAIN, ...CLINIC_GALLERY].filter(
  (p): p is ClinicPhoto & { src: string } => Boolean(p.src),
);

export default function ClinicSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  const openPhoto = (photo: ClinicPhoto) => {
    const index = VIEWABLE.findIndex((item) => item.src === photo.src);
    if (index >= 0) setOpenIndex(index);
  };

  return (
    <section data-carnival-section="about-clinic" className="relative isolate mt-0 w-full bg-[#FFF9FC] px-6 pb-28 pt-10 md:pb-32 md:pt-14">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
      <Blob color={PAL.lime} radius="50%" className="-right-3 -top-3 hidden h-12 w-12 lg:block" />
      <Blob color={PAL.greenSoft} radius="50%" className="-left-4 top-[290px] hidden h-9 w-9 lg:block" />
      <Dashes color={PAL.green} className="-right-2 bottom-8 hidden lg:block" size={32} rotate={200} />

      <div className="grid items-center gap-9 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div data-reveal className="max-w-[520px]">
          <p className="site-eyebrow site-eyebrow--green">Um espaço de acolhimento</p>
          <h2 className={`${H2} site-section-title mt-4`}>A clínica</h2>
          <p className="mt-2 text-xl font-bold text-[#514956] md:text-2xl">Um espaço pensado para acolher</p>
          <p className="site-section-copy mt-4">
            Cada cantinho foi pensado para que crianças e famílias se sintam seguras, confortáveis e à vontade desde o primeiro encontro.
          </p>
          <Photo
            src={CLINIC_MAIN.src}
            alt={CLINIC_MAIN.alt}
            tone={CLINIC_MAIN.tone}
            icon={CLINIC_MAIN.icon}
            onClick={() => openPhoto(CLINIC_MAIN)}
            className="mt-7 h-[260px] w-full rounded-[26px] shadow-[0_16px_38px_rgba(59,43,57,.10)] sm:h-[310px] lg:h-[360px]"
            style={{ borderRadius: "26px" }}
          />
        </div>

        <div data-reveal className="grid grid-cols-2 gap-4 sm:gap-5">
          {CLINIC_GALLERY.map((photo, index) => (
            <Photo
              key={photo.alt}
              src={photo.src}
              alt={photo.alt}
              tone={photo.tone}
              icon={photo.icon}
              onClick={() => openPhoto(photo)}
              className={`h-[154px] rounded-[22px] shadow-[0_12px_28px_rgba(59,43,57,.09)] sm:h-[190px] lg:h-[220px] ${index % 2 === 1 ? "sm:translate-y-7" : ""}`}
              style={{ borderRadius: "22px" }}
            />
          ))}
        </div>
      </div>

      <ImageModal images={VIEWABLE} index={openIndex} onClose={close} onChange={setOpenIndex} />
      </div>
      <EasterSectionDecor placement="clinic" />
      <Cloud position="bottom" color="#FFFFFF" />
    </section>
  );
}
