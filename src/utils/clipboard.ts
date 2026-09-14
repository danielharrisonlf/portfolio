/**
 * Copia texto para a área de transferência.
 *
 * `navigator.clipboard` não existe em contexto não seguro (http://) e pode
 * ser negado por permissão. Quando isso acontece, cai no `execCommand`,
 * que é obsoleto mas continua sendo o único caminho nesses casos.
 *
 * Devolve `true` só quando a cópia realmente aconteceu — quem chama não
 * deve mostrar "Copiado" sem essa confirmação.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* Segue para o fallback. */
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const area = document.createElement('textarea');
    area.value = text;
    // Fora da tela sem causar rolagem nem reflow visível.
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();

    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
