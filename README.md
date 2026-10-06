# 📦 Controle de Estoque

Aplicação web simples, em um único arquivo HTML, para cadastrar produtos, registrar entradas e saídas e acompanhar alertas de estoque baixo. Não precisa de servidor, instalação nem internet: basta abrir no navegador.

## Funcionalidades

- **Cadastro de produtos** com nome, código, categoria, quantidade inicial, estoque mínimo, preço de custo e preço de venda.
- **Entradas e saídas** com botões `+1` e `-1` por produto (o saldo nunca fica negativo).
- **Alerta de estoque baixo**: o produto é destacado em vermelho quando a quantidade é menor ou igual ao estoque mínimo.
- **Busca** por nome ou código.
- **Resumo no topo**: total de produtos, itens em estoque, valor total a preço de custo e quantidade de alertas.
- **Histórico de movimentações** com data e hora (guarda as 50 mais recentes).
- **Remoção de produtos** com confirmação.
- **Tema claro/escuro automático**, de acordo com o sistema do usuário.
- **Layout responsivo**, funciona em celular e desktop.

## Como usar

1. Baixe o arquivo `controle-estoque.html`.
2. Abra o arquivo com um duplo clique (Chrome, Edge, Firefox, Safari etc.).
3. Preencha o formulário **Adicionar produto** e clique em **+ Adicionar produto**.
4. Use os botões da coluna **Ações** para registrar entradas (`+1`), saídas (`-1`) ou remover o produto.

## Armazenamento dos dados

Os dados ficam salvos no **`localStorage` do navegador**, nas chaves:

| Chave | Conteúdo |
|---|---|
| `estoque_produtos_v1` | Lista de produtos |
| `estoque_log_v1` | Histórico de movimentações |

Pontos importantes:

- Os dados são **locais**: ficam apenas no navegador e no dispositivo onde foram cadastrados.
- Limpar os dados do navegador **apaga o estoque**.
- Navegadores diferentes (ou o modo anônimo) não compartilham os dados.

## Estrutura de um produto

```json
{
  "id": "lx3k9a2fqzt1",
  "nome": "Camiseta Preta M",
  "codigo": "CAM-001",
  "categoria": "Vestuário",
  "qtd": 12,
  "min": 5,
  "custo": 25.9,
  "venda": 49.9
}
```

## Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks e sem dependências externas).

## Limitações conhecidas

- Entradas e saídas são de 1 unidade por clique (não há campo para quantidade personalizada).
- Não é possível editar um produto depois de cadastrado (apenas remover e cadastrar de novo).
- Não há exportação/importação de dados nem sincronização entre dispositivos.
- O campo de categoria é salvo, mas ainda não aparece na tabela nem pode ser usado como filtro.
- Os textos digitados são inseridos na página sem sanitização; use apenas para controle pessoal/local.

## Ideias para evoluir

- Campo para informar a quantidade de cada movimentação.
- Edição de produtos.
- Filtro por categoria e ordenação das colunas.
- Exportar/importar dados em CSV ou JSON (backup).
- Escapar o HTML dos textos digitados.
- Sincronização com um backend ou banco de dados.

## Licença

Uso livre. Adapte conforme a sua necessidade.
