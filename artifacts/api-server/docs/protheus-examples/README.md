# Exemplos ADVPL e TLPP

Estes arquivos são exemplos de referência para a integração simulada do projeto.
Eles não são compilados pelo servidor Node.js e não executam rotinas em um
ambiente Protheus real.

- `custom-entry-point.prw`: ponto de entrada ADVPL para validar uma condição
  antes da gravação de um pedido.
- `stock-api.tlpp`: API REST TLPP ilustrativa para consultar saldo por produto e
  filial, usando a mesma ideia do endpoint `GET /api/protheus/stock` do projeto.

Em produção, os nomes de tabelas, índices e contratos devem ser ajustados ao
dicionário de dados e à versão do Protheus instalados no cliente.