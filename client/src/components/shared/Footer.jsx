import { assets } from "@/assets/assets";
import { post_categories } from "@/hooks/useCategory";
import { Mail, Phone, Link, Users, Info } from "lucide-react";
  
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contact = [
    { label: "E-mail", href: "https://www.linkedin.com/in/lucasglsantos-dev/" },
    { label: "Telefone", href: "tel:+5511999999999" },
  ];

  const GitHubIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 20 20">
      <g transform="translate(-140.000000, -7559.000000)"> 
        <g transform="translate(56.000000, 160.000000)"> 
          <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"> </path> 
        </g> 
      </g>
    </svg>
  );

  const LinkedInIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 32 32">
      <path d="M28.778 1.004h-25.56c-0.008-0-0.017-0-0.027-0-1.199 0-2.172 0.964-2.186 2.159v25.672c0.014 1.196 0.987 2.161 2.186 2.161 0.010 0 0.019-0 0.029-0h25.555c0.008 0 0.018 0 0.028 0 1.2 0 2.175-0.963 2.194-2.159l0-0.002v-25.67c-0.019-1.197-0.994-2.161-2.195-2.161-0.010 0-0.019 0-0.029 0h0.001zM9.9 26.562h-4.454v-14.311h4.454zM7.674 10.293c-1.425 0-2.579-1.155-2.579-2.579s1.155-2.579 2.579-2.579c1.424 0 2.579 1.154 2.579 2.578v0c0 0.001 0 0.002 0 0.004 0 1.423-1.154 2.577-2.577 2.577-0.001 0-0.002 0-0.003 0h0zM26.556 26.562h-4.441v-6.959c0-1.66-0.034-3.795-2.314-3.795-2.316 0-2.669 1.806-2.669 3.673v7.082h-4.441v-14.311h4.266v1.951h0.058c0.828-1.395 2.326-2.315 4.039-2.315 0.061 0 0.121 0.001 0.181 0.003l-0.009-0c4.5 0 5.332 2.962 5.332 6.817v7.855z"></path>                       
    </svg>
  );

  const BlueskyIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24">
			<g transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)">
				<path d="M17 213 c-20 -19 -2 -100 24 -108 17 -6 17 -8 4 -21 -17 -18 -10 -41 18 -56 17 -9 24 -7 39 12 l18 22 18 -22 c15 -19 22 -21 39 -12 28 15 35 38 18 56 -13 13 -13 15 5 21 32 10 42 103 12 113 -7 2 -31 -15 -53 -39 l-39 -42 -38 41 c-38 41 -52 49 -65 35z" />
			</g>
		</svg>
  )

  const InstagramIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 20 20">
      <g transform="translate(-340.000000, -7439.000000)"> 
          <g transform="translate(56.000000, 160.000000)"> 
            <path d="M289.869652,7279.12273 C288.241769,7279.19618 286.830805,7279.5942 285.691486,7280.72871 C284.548187,7281.86918 284.155147,7283.28558 284.081514,7284.89653 C284.035742,7285.90201 283.768077,7293.49818 284.544207,7295.49028 C285.067597,7296.83422 286.098457,7297.86749 287.454694,7298.39256 C288.087538,7298.63872 288.809936,7298.80547 289.869652,7298.85411 C298.730467,7299.25511 302.015089,7299.03674 303.400182,7295.49028 C303.645956,7294.859 303.815113,7294.1374 303.86188,7293.08031 C304.26686,7284.19677 303.796207,7282.27117 302.251908,7280.72871 C301.027016,7279.50685 299.5862,7278.67508 289.869652,7279.12273 M289.951245,7297.06748 C288.981083,7297.0238 288.454707,7296.86201 288.103459,7296.72603 C287.219865,7296.3826 286.556174,7295.72155 286.214876,7294.84312 C285.623823,7293.32944 285.819846,7286.14023 285.872583,7284.97693 C285.924325,7283.83745 286.155174,7282.79624 286.959165,7281.99226 C287.954203,7280.99968 289.239792,7280.51332 297.993144,7280.90837 C299.135448,7280.95998 300.179243,7281.19026 300.985224,7281.99226 C301.980262,7282.98483 302.473801,7284.28014 302.071806,7292.99991 C302.028024,7293.96767 301.865833,7294.49274 301.729513,7294.84312 C300.829003,7297.15085 298.757333,7297.47145 289.951245,7297.06748 M298.089663,7283.68956 C298.089663,7284.34665 298.623998,7284.88065 299.283709,7284.88065 C299.943419,7284.88065 300.47875,7284.34665 300.47875,7283.68956 C300.47875,7283.03248 299.943419,7282.49847 299.283709,7282.49847 C298.623998,7282.49847 298.089663,7283.03248 298.089663,7283.68956 M288.862673,7288.98792 C288.862673,7291.80286 291.150266,7294.08479 293.972194,7294.08479 C296.794123,7294.08479 299.081716,7291.80286 299.081716,7288.98792 C299.081716,7286.17298 296.794123,7283.89205 293.972194,7283.89205 C291.150266,7283.89205 288.862673,7286.17298 288.862673,7288.98792 M290.655732,7288.98792 C290.655732,7287.16159 292.140329,7285.67967 293.972194,7285.67967 C295.80406,7285.67967 297.288657,7287.16159 297.288657,7288.98792 C297.288657,7290.81525 295.80406,7292.29716 293.972194,7292.29716 C292.140329,7292.29716 290.655732,7290.81525 290.655732,7288.98792"> </path>
          </g>
      </g>
    </svg>
  );

  const social = [
    { icon: GitHubIcon, href: "https://github.com/lucas-glsantos/AppGeoLocalis", label: "GitHub" },
    { icon: LinkedInIcon, href: "https://www.linkedin.com/in/lucasglsantos-dev/", label: "LinkedIn" },
    { icon: BlueskyIcon, href: "https://bsky.app/profile/lucasglsantos-dev.bsky.social", label: "Bluesky" },
    { icon: InstagramIcon, href: "https://www.instagram.com/_lucasglsantos/", label: "Instagram" },
  ];

  return (
    <footer className="relative bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 dark:from-gray-900/50 to-transparent -z-10" />
      <div className="flex-1 gap-4 p-4">
        <div className="grid grid-cols-1">
          <div className="flex items-center justify-left">
            <img src={assets.geolocalis} title="Logo" className="w-28 sm:w-28" />
          </div>
          <h3 className="flex items-center justify-left text-semibold text-gray-500 dark:text-gray-300 mb-6">
            Seu Blog de publicação pessoal. Conectando pessoas a comunidades atráves de Tecnologia.
          </h3>
          <div className="flex items-center justify-left gap-5 px-4">
            <h3 className="flex items-center justify-left text-semibold text-gray-500 dark:text-gray-300">Siga-nos</h3>

            {social.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                key={index}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                target="_blank"
                className="p-2 rounded-lg hover:bg-blue-500/90 dark:hover:bg-blue-400 transition-colors"
              >
                <Icon className="w-8 h-8 dark:invert" />
              </a>
              );
            })}

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">Categorias</h3>
            <ul className="space-y-3">
              {post_categories.map(category => (
                <li 
                  key={category.id}
                  value={category.name}
                >
                  <a
                    href={category.id}
                    aria-label={category.name}
                    title={category.name}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                  >
                    <Link className="w-4 h-4" />
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Comunidade</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/lucas-glsantos/AppGeoLocalis"
                  target="_blank"
                  aria-label="Entrar na Comunidade"
                  title="Entrar na Comunidade"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Entrar na Comunidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={contact[0].href}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {contact[0].label}
                </a>
              </li>
              <li>
                <a
                  href={contact[1].href}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {contact[1].label}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sobre a plataforma</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href=""
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  Sobre
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-10 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-3">
          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            ©{currentYear} <span className="p-1 font-bold text-gray-500 dark:text-gray-300">GeoLocalis.</span> Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;