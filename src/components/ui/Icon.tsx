import type { SVGProps } from 'react';

/**
 * Conjunto de ícones do site.
 *
 * Substitui a dependência `react-icons`, que trazia ~300 KB de JS para
 * renderizar um punhado de ícones — o maior peso isolado do bundle. Aqui
 * são desenhos de 24x24, sem dependência e sem requisição.
 *
 * Grade: viewBox 24x24, traço de 1.6 em `currentColor`, `linecap: round`.
 * A cor vem sempre do texto ao redor, nunca de um valor fixo: ícone
 * colorido por conta própria foi o que transformou a versão anterior num
 * arco-íris sem significado.
 *
 * `as const` é obrigatório: sem ele, `keyof typeof paths` colapsa para
 * `string` e um nome de ícone digitado errado compila e renderiza um
 * <path d={undefined}> vazio, sem nenhum aviso.
 */
const paths = {
  /* --- Navegação e ação ------------------------------------------------ */
  arrowRight: 'M4 12h15M13 6l6 6-6 6',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  arrowUp: 'M12 20V5M6 11l6-6 6 6',
  arrowDown: 'M12 4v15M6 13l6 6 6-6',
  menu: 'M3.5 7h17M3.5 12h17M3.5 17h17',
  close: 'M6 6l12 12M18 6 6 18',

  /* --- Tema ------------------------------------------------------------ */
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M17.7 6.3l1.4-1.4M4.9 19.1l1.4-1.4',
  moon: 'M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z',

  /* --- Contato --------------------------------------------------------- */
  mail: 'M3 6.5h18v11H3zM3.6 7.2l8.4 6 8.4-6',
  copy: 'M9 9h10v10H9zM5 15H4V4h11v1',
  check: 'M4 12.5 9.5 18 20 6.5',

  /* --- Formação -------------------------------------------------------- */
  layers: 'M12 3 3 8l9 5 9-5-9-5M3 13l9 5 9-5M3 17.5l9 5 9-5',

  /* --- Marca ----------------------------------------------------------- */
  github:
    'M15 22v-3.9a3.4 3.4 0 0 0-.95-2.6c3.1-.35 6.35-1.5 6.35-6.9a5.4 5.4 0 0 0-1.45-3.75 5 5 0 0 0-.1-3.75s-1.15-.35-3.8 1.4a13.1 13.1 0 0 0-6.9 0C5.5.75 4.35 1.1 4.35 1.1a5 5 0 0 0-.1 3.75A5.4 5.4 0 0 0 2.8 8.6c0 5.35 3.25 6.5 6.35 6.9A3.4 3.4 0 0 0 8.3 18v4M8.3 19c-3 .85-3-1.5-4.2-2',
  linkedin: 'M4.5 9v10.5M4.5 4.6v.1M10 19.5V14a3.2 3.2 0 0 1 6.4 0v5.5M10 19.5V9',
  download: 'M12 4v11M7 10.5l5 5 5-5M4.5 20h15',
} as const;

/** Ícones com uma parte preenchida além do traço. */
const filled: Partial<Record<keyof typeof paths, string>> = {
  sun: 'M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z',
  moon: 'M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z',
};

export type IconName = keyof typeof paths;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, style, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
      /*
       * `flexShrink: 0` é obrigatório e vem DEPOIS do spread. Sem ele, um
       * ícone dentro de um flex cujo texto é `nowrap` é o único item que
       * pode ceder — e é esmagado até largura zero. Foi um bug real na
       * versão anterior, e um `style` vindo de fora não pode desfazê-lo.
       */
      style={{ ...style, flexShrink: style?.flexShrink ?? 0 }}
    >
      {filled[name] && <path d={filled[name]} fill="currentColor" stroke="none" />}
      <path d={paths[name]} />
    </svg>
  );
}

