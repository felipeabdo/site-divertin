'use client';

import { useSiteTheme } from '@/components/auth/SiteExperienceProvider';

/**
 * Pequenas ilustrações sazonais compartilhadas por todas as páginas.
 * Ficam nas bordas da tela, não recebem eventos de clique e respeitam
 * a preferência por movimento reduzido do sistema.
 */
export default function SeasonalDecorations() {
  const { settings, settingsLoading } = useSiteTheme();

  if (settingsLoading || (settings.theme !== 'carnaval' && settings.theme !== 'pascoa')) {
    return null;
  }

  if (settings.theme === 'carnaval') {
    return (
      <div className="divertin-seasonal-decorations divertin-seasonal-decorations--carnival" aria-hidden="true">
        <svg className="divertin-seasonal-art divertin-seasonal-art--mask" viewBox="0 0 180 126" fill="none" focusable="false">
          <defs>
            <linearGradient id="carnival-mask" x1="18" y1="30" x2="158" y2="104" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E84B9B"/><stop offset=".48" stopColor="#9B59B6"/><stop offset="1" stopColor="#2AAE9B"/>
            </linearGradient>
            <linearGradient id="carnival-feather" x1="85" y1="4" x2="116" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFC94F"/><stop offset="1" stopColor="#F2769E"/>
            </linearGradient>
          </defs>
          <path d="M88 43C62 7 75 1 88 28C95-2 113 2 103 39C127 12 139 24 112 48" fill="url(#carnival-feather)" stroke="#D88A32" strokeWidth="2" strokeLinecap="round"/>
          <path d="M13 58C32 31 61 31 90 46C119 31 148 31 167 58C158 88 136 101 112 84L90 68L68 84C44 101 22 88 13 58Z" fill="url(#carnival-mask)" stroke="#75478F" strokeWidth="3"/>
          <path d="M26 59C43 45 61 46 78 57C69 73 55 81 41 76C33 73 28 67 26 59Z" fill="#FFF8EF"/>
          <path d="M154 59C137 45 119 46 102 57C111 73 125 81 139 76C147 73 152 67 154 59Z" fill="#FFF8EF"/>
          <path d="M17 58C35 42 59 41 79 55M163 58C145 42 121 41 101 55" stroke="#FFD46C" strokeWidth="4" strokeLinecap="round"/>
          <path d="M55 91L65 102M90 79V98M125 91L115 102" stroke="#F7BD43" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="25" cy="43" r="4" fill="#2AAE9B"/><circle cx="155" cy="43" r="4" fill="#F4B63D"/>
        </svg>

        <svg className="divertin-seasonal-art divertin-seasonal-art--tambourine" viewBox="0 0 132 132" fill="none" focusable="false">
          <circle cx="66" cy="66" r="48" fill="#F7C85C" stroke="#B95A8B" strokeWidth="5"/>
          <circle cx="66" cy="66" r="37" fill="#FFF3D8" stroke="#E49A42" strokeWidth="3"/>
          <circle cx="66" cy="66" r="8" fill="#D66A91"/>
          <path d="M66 31L71 47L87 42L79 57L94 66L78 72L83 89L67 80L55 93L54 76L37 72L51 61L43 46L60 49L66 31Z" fill="#EAA45A" opacity=".92"/>
          <path d="M19 34L28 27L39 34L34 46L23 46L19 34ZM92 22L103 17L112 26L107 38L96 37L92 22ZM104 88L115 83L123 92L118 104L107 103L104 88ZM10 86L20 80L30 87L25 99L14 99L10 86Z" fill="#9B63B8" stroke="#75478F" strokeWidth="2"/>
          <circle cx="66" cy="66" r="4" fill="#FFF9EB"/>
        </svg>

        <svg className="divertin-seasonal-art divertin-seasonal-art--trumpet" viewBox="0 0 170 108" fill="none" focusable="false">
          <path d="M17 48H83L111 25V83L83 60H17V48Z" fill="#F4BF42" stroke="#C27A28" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M111 35L145 15V93L111 73" fill="#E99B35" stroke="#C27A28" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M29 48V60M47 48V60M65 48V60" stroke="#FFF0B6" strokeWidth="4" strokeLinecap="round"/>
          <path d="M12 44V64M4 48V60" stroke="#B95A8B" strokeWidth="5" strokeLinecap="round"/>
          <path d="M144 12L157 4M150 52H166M145 94L158 103" stroke="#2AAE9B" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="92" cy="54" r="5" fill="#FFF0B6"/>
        </svg>

        <svg className="divertin-seasonal-art divertin-seasonal-art--streamer" viewBox="0 0 180 160" fill="none" focusable="false">
          <path d="M9 126C45 107 24 65 63 55C98 46 104 97 137 77C154 67 153 43 170 25" stroke="#E84B9B" strokeWidth="9" strokeLinecap="round"/>
          <path d="M7 136C44 117 35 89 65 79C89 71 106 112 134 101C155 93 161 70 175 61" stroke="#F5BE43" strokeWidth="7" strokeLinecap="round"/>
          <path d="M35 17L40 29M77 10L72 23M118 17L126 29M151 118L160 129" stroke="#2AAE9B" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="22" cy="54" r="5" fill="#9B63B8"/><circle cx="103" cy="25" r="4" fill="#E84B9B"/><circle cx="149" cy="143" r="5" fill="#F5BE43"/>
        </svg>

        <div className="divertin-seasonal-confetti">
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="divertin-seasonal-decorations divertin-seasonal-decorations--easter" aria-hidden="true">
      <svg className="divertin-seasonal-art divertin-seasonal-art--bunny" viewBox="0 0 150 170" fill="none" focusable="false">
        <path d="M48 63C35 35 33 5 47 7C63 10 65 36 66 59M86 58C84 30 91 5 105 9C120 14 108 45 99 67" fill="#FFFDF8" stroke="#B9A4C8" strokeWidth="3"/>
        <path d="M45 24C46 14 49 15 52 24L57 49L51 52L45 24ZM96 25C99 15 104 18 103 29L96 52L90 49L96 25Z" fill="#E9A9BD"/>
        <ellipse cx="75" cy="119" rx="43" ry="37" fill="#FFFDF8" stroke="#B9A4C8" strokeWidth="3"/>
        <circle cx="75" cy="73" r="34" fill="#FFFDF8" stroke="#B9A4C8" strokeWidth="3"/>
        <circle cx="63" cy="70" r="3.2" fill="#6D596E"/><circle cx="87" cy="70" r="3.2" fill="#6D596E"/>
        <path d="M71 80Q75 85 79 80Q77 89 75 89Q73 89 71 80Z" fill="#D986A4"/>
        <path d="M75 88V94M75 94Q68 101 62 94M75 94Q82 101 88 94" stroke="#8F748D" strokeWidth="2.2" strokeLinecap="round"/>
        <ellipse cx="50" cy="82" rx="9" ry="5" fill="#F3C4D0"/><ellipse cx="100" cy="82" rx="9" ry="5" fill="#F3C4D0"/>
        <ellipse cx="49" cy="146" rx="17" ry="10" fill="#FFFDF8" stroke="#B9A4C8" strokeWidth="2.5"/><ellipse cx="101" cy="146" rx="17" ry="10" fill="#FFFDF8" stroke="#B9A4C8" strokeWidth="2.5"/>
        <circle cx="75" cy="116" r="11" fill="#F3C4D0"/>
        <path d="M113 108C128 95 139 110 128 120C121 127 111 120 113 108Z" fill="#FFFDF8" stroke="#B9A4C8" strokeWidth="2.5"/>
      </svg>

      <svg className="divertin-seasonal-art divertin-seasonal-art--egg-one" viewBox="0 0 100 130" fill="none" focusable="false">
        <path d="M50 8C29 8 12 48 12 77C12 106 28 122 50 122C72 122 88 106 88 77C88 48 71 8 50 8Z" fill="#E9B7CD" stroke="#B87598" strokeWidth="3"/>
        <path d="M20 60C39 72 61 72 80 60M17 83C39 95 61 95 83 83" stroke="#FFF8E8" strokeWidth="8" strokeLinecap="round"/>
        <path d="M28 34L34 39M47 25L53 30M66 37L72 42" stroke="#F8E7A7" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="36" cy="105" r="3" fill="#FFF8E8"/><circle cx="64" cy="105" r="3" fill="#FFF8E8"/>
      </svg>

      <svg className="divertin-seasonal-art divertin-seasonal-art--egg-two" viewBox="0 0 100 130" fill="none" focusable="false">
        <path d="M50 8C29 8 12 48 12 77C12 106 28 122 50 122C72 122 88 106 88 77C88 48 71 8 50 8Z" fill="#C7E5D4" stroke="#76A98C" strokeWidth="3"/>
        <path d="M22 56L31 64L40 56L50 64L60 56L70 64L79 56M22 88L31 96L40 88L50 96L60 88L70 96L79 88" stroke="#FFFDF5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="34" cy="39" r="4" fill="#F4C86A"/><circle cx="66" cy="39" r="4" fill="#F4C86A"/><circle cx="50" cy="76" r="4" fill="#E9A9BD"/>
      </svg>

      <svg className="divertin-seasonal-art divertin-seasonal-art--chocolate" viewBox="0 0 150 112" fill="none" focusable="false">
        <path d="M19 27L115 9L135 83L39 102L19 27Z" fill="#8E5A48" stroke="#674034" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M35 31L62 26L68 51L42 56L35 31ZM69 24L96 19L102 44L75 49L69 24ZM48 62L74 57L80 82L54 87L48 62ZM85 55L111 50L118 75L91 80L85 55Z" fill="#B97B63" stroke="#E0B99D" strokeWidth="2"/>
        <path d="M12 20L109 2L115 17L17 36L12 20Z" fill="#F2D78B" opacity=".95"/>
        <path d="M107 8L127 4L133 19L111 24" fill="#F8E7B0" stroke="#D0A95C" strokeWidth="2"/>
        <path d="M32 91L17 99M124 88L139 96" stroke="#D986A4" strokeWidth="4" strokeLinecap="round"/>
      </svg>

      <svg className="divertin-seasonal-art divertin-seasonal-art--carrot" viewBox="0 0 100 116" fill="none" focusable="false">
        <path d="M48 40C36 23 44 9 56 23C58 5 76 8 69 30C86 19 94 34 72 44" fill="#8EB99B" stroke="#679A7A" strokeWidth="3" strokeLinecap="round"/>
        <path d="M22 42C38 33 64 34 82 46C75 75 60 97 50 108C39 96 27 70 22 42Z" fill="#F2A35F" stroke="#D77B43" strokeWidth="3"/>
        <path d="M34 56L44 60M43 76L52 80M55 94L61 96" stroke="#FFE3B6" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
