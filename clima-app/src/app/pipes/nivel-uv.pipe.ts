import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe PERSONALIZADA 2 — NivelUv
 * Converte o índice UV numérico em nível de risco com emoji.
 * Uso: {{ uvIndex | nivelUv }}
 */
@Pipe({
  name: 'nivelUv',
  standalone: true,
})
export class NivelUvPipe implements PipeTransform {
  transform(uv: number | null | undefined): string {
    if (uv == null) return 'Sem dados';
    if (uv <= 2) return `${uv} — Baixo 🟢`;
    if (uv <= 5) return `${uv} — Moderado 🟡`;
    if (uv <= 7) return `${uv} — Alto 🟠`;
    if (uv <= 10) return `${uv} — Muito Alto 🔴`;
    return `${uv} — Extremo 🟣`;
  }
}
