
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  private chave = 'historico_cidades';

  // Adicionar cidade ao histórico
  adicionarCidade(cidade: string): void {
    let historico = this.obterHistorico();

    historico = historico.filter(
      item => item.toLowerCase() !== cidade.toLowerCase()
    );

    historico.unshift(cidade);

    historico = historico.slice(0, 5);

    localStorage.setItem(
      this.chave,
      JSON.stringify(historico)
    );
  }

  // Consultar histórico
  obterHistorico(): string[] {
    const dados = localStorage.getItem(this.chave);

    return dados ? JSON.parse(dados) : [];
  }

  // Remover uma cidade
  removerCidade(cidade: string): void {
    const historico = this.obterHistorico();

    const atualizado = historico.filter(
      item => item !== cidade
    );

    localStorage.setItem(
      this.chave,
      JSON.stringify(atualizado)
    );
  }

  // Limpar todo o histórico
  limparHistorico(): void {
    localStorage.removeItem(this.chave);
  }
}
