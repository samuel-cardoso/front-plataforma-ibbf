# Contribuições digitais em igrejas no Brasil (Pix) e opções técnicas de integração/conciliação

> Data da pesquisa: 08/11/2026. Orçamento de pesquisa limitado (~15 chamadas). Vários fetches falharam (página do BCB sobre Pix Automático renderizou vazia; blog da Cora retornou 403; o Swagger da API Pix renderizou só nomes de seções, sem valores). Os detalhes técnicos finos da especificação (tamanhos de campo, regex de txid) vêm do conhecimento prévio e estão marcados como **[verificar]**.

## 1. Pix básico para igrejas: chave, QR estático x dinâmico, txid, identificação do contribuinte

### Takeaway
O Pix já é um canal de contribuição consolidado em igrejas (cerca de 1 em cada 3 transações em plataformas como a inChurch). O QR estático com chave CNPJ é gratuito/barato mas não identifica bem o doador; identificação confiável exige QR dinâmico (cobrança `cob` com txid único) ou conciliação posterior pelo nome/CPF parcial do pagador que aparece no extrato/API.

### Cited Findings
- Segundo dados da inChurch, o Pix responde por uma a cada três transações de ofertas, dízimos e contribuições de eventos de igrejas; a inChurch tem cerca de 30 mil igrejas na carteira — [A Gazeta / Mais Goiás via busca, "micropix chega a cultos, missas..."](https://www.agazeta.com.br/economia/micropix-chega-a-cultos-missas-e-conquista-comercio-de-rua-0122) (dado vindo de snippet de busca; artigo não aberto integralmente)
- Paróquia São Sebastião (Belém): Pix representa pelo menos 30% das contribuições; seria mais se idosos não preferissem dinheiro. Igrejas exibem QR Codes e chaves Pix nos bancos da nave. Motivo citado pela Arquidiocese: as pessoas carregam menos dinheiro/cartão por medo de roubo — [DOL, 21/07/2023](https://dol.com.br/noticias/brasil/819827/pix-se-consolida-tambem-nas-doacoes-em-igrejas)
- Pix é gratuito para pessoa física, mas pessoa jurídica (caso das igrejas, que têm CNPJ) pode ser tarifada conforme o banco — [busca agregada, snippets de A Gazeta/Cora](https://www.cora.com.br/blog/como-registrar-doacoes-pix-na-contabilidade-da-igreja/)
- A especificação oficial da API Pix (BCB) está no GitHub `bacen/pix-api`, OpenAPI 3.0, release atual 2.11.0-rc1; segurança remete ao "Manual de Padrões para Iniciação do Pix" e ao "Manual de Segurança do Pix" — [GitHub bacen/pix-api](https://github.com/bacen/pix-api)
- A API possui grupos de endpoints `cob` (cobrança imediata), `cobv` (cobrança com vencimento), `lotecobv`, `loc` (locations do payload do QR dinâmico), `pix` (consulta de Pix recebidos/devoluções), `webhook`, e os de Pix Automático `rec`, `cobr`, `solicrec`, `webhookrec`; o webhook notifica com `endToEndId`, `txid`, `valor`, `horario`, `infoPagador`; autenticação via OAuth2 com escopos e mTLS — [Swagger API Pix (bacen.github.io)](https://bacen.github.io/pix-api/)
- Na Efí, o webhook pode ser configurado para notificar também Pix **sem txid** (recebidos por chave/QR estático) e incluir informações de tarifa e pagador — [Efí docs/Webhooks via busca](https://dev.efipay.com.br/en/docs/api-pix/endpoints-exclusivos-efi/)

### Inferences
- **QR estático** (BR Code gerado a partir da chave CNPJ): reutilizável, pode ter valor fixo ou aberto, e um txid curto fixo (até 25 caracteres, ou `***`) **[verificar]**. Serve para cartaz/telão/banco da igreja. Identificação do doador fica dependente do nome/CPF parcial do pagador que o banco recebedor expõe no extrato/API.
- **QR dinâmico** (`PUT /cob/{txid}`): txid único (26–35 caracteres alfanuméricos) **[verificar]**, valor e expiração definidos, campo `solicitacaoPagador` (texto exibido ao pagador, até ~140 caracteres) **[verificar]** e `infoAdicionais` (pares nome/valor). Ideal para o app do membro: gera-se uma cobrança por contribuição (membro + fundo + valor) e o webhook devolve o txid, o que concilia sem ambiguidade.
- **Pix copia-e-cola** é o mesmo payload EMV do QR em texto; no app/celular é o que o membro realmente usa (não dá para escanear a própria tela). Sempre exibir botão "Copiar código" junto ao QR.
- **Truques de identificação usados em igrejas** (práticas de mercado, sem fonte primária nesta pesquisa): (a) centavos de identificação (ex.: dízimo R$ 100,07 para o membro 07) — frágil e confuso; (b) chaves Pix diferentes por fundo (CNPJ = dízimo, e-mail = missões, aleatória = construção) — funciona para separar fundos mas não identifica pessoa; (c) QR estático com txid diferente por fundo (`DIZIMO`, `MISSOES`) — o txid chega no extrato/API e separa fundos sem custo extra; (d) QR dinâmico por membro/contribuição — a única forma robusta de identificar pessoa+fundo.
- O "campo de mensagem" que o pagador digita livremente no app do banco nem sempre chega estruturado ao recebedor via API; não se deve depender dele para conciliação.

### Gaps
- Não consegui confirmar textualmente (fetch do Swagger renderizou sem valores) os limites exatos de `txid`, `solicitacaoPagador`, `infoAdicionais` e quais dados do pagador (`pagador.cpf`/`nome`) vêm no webhook vs. só no `GET /pix/{e2eid}`. Verificar no `openapi.yaml` do repositório.
- Sem fonte primária sobre a prevalência do "truque dos centavos" em igrejas brasileiras.

## 2. Pix Automático, Pix agendado/recorrente e dízimo recorrente

### Takeaway
O Pix Automático (lançado em 16/06/2025, obrigatório para todas as instituições desde 13/10/2025) permite débito recorrente autorizado uma vez no app do banco do pagador, e só pode ser recebido por PJ com CNPJ ativo há ≥ 6 meses — igrejas se qualificam. É tecnicamente aplicável a dízimo mensal fixo, mas tem custo por transação (ex.: R$ 3,50 na Efí) e exige PSP com API; para uma igreja pequena, o "Pix agendado recorrente" feito pelo próprio membro no app do banco (sem integração) é a alternativa de custo zero.

### Cited Findings
- Lançamento: 16/06/2025 — [Agência Gov](https://agenciagov.ebc.com.br/noticias/202506/pix-automatico-chega-em-16-de-junho); obrigatório para todas as instituições: 13/10/2025; prazo de adaptação de contratos: 01/01/2026; extensão a contas-salário: 01/07/2027 — [Celcoin](https://celcoin.com.br/articles/pix-automatico-banco-central/)
- Só pessoas jurídicas (inclusive MEI) com CNPJ ativo há pelo menos seis meses podem receber via Pix Automático (Resolução BCB nº 482); o PSP do recebedor deve verificar a idoneidade do cliente (data do CNPJ, situação cadastral dos CPFs de sócios/administradores, natureza jurídica, atividade) antes e durante o contrato — [InfoMoney](https://www.infomoney.com.br/minhas-financas/banco-central-publica-regras-de-seguranca-para-uso-do-pix-automatico-saiba-quais/); [Finsiders](https://finsidersbrasil.com.br/regulamentacao/pix-automatico-bc-publica-regras-para-evitar-fraudes-de-empresas/)
- Jornadas de autorização definidas na Instrução Normativa BCB nº 511/2024; autorização ocorre no app do banco do pagador, que vê valor, recebedor, periodicidade e data de débito — [InfoMoney](https://www.infomoney.com.br/minhas-financas/banco-central-publica-regras-de-seguranca-para-uso-do-pix-automatico-saiba-quais/)
- Quatro jornadas padronizadas; o pagador define valor máximo, periodicidade e validade; pode fixar teto zero; aumentos de limite levam até 8h, reduções são imediatas; cobranças de valor variável exigem aviso com ≥ 2 dias úteis; retentativas no mesmo dia e política de até 3 retentativas em 7 dias corridos; cancelamento imediato no app do banco — [Celcoin](https://celcoin.com.br/articles/pix-automatico-banco-central/)
- Volume: R$ 3,5 bi em 9,5 milhões de transações no 2º tri de 2026; recebedores passaram de ~1 mil (fim de 2025) para 14 mil (ago/2026) — [Finsiders, "Pix Automático cresce no 1º semestre de 2026"](https://finsidersbrasil.com.br/giro-noticias/pix-automatico-cresce-no-1o-semestre-de-2026-diz-bc/) (via snippet)
- Efí cobra R$ 3,50 fixos por transação de Pix Automático — [Efí blog, atualizado 23/09/2026](https://sejaefi.com.br/blog/qual-custo-do-pix)
- Endpoints de Pix Automático no padrão BCB: `rec` (recorrência), `solicrec` (solicitação de confirmação), `cobr` (cobrança recorrente), `webhookrec` — [Swagger API Pix](https://bacen.github.io/pix-api/)
- inChurch oferece recorrência de dízimo/oferta via **cartão de crédito** cadastrado, debitado mensalmente — [busca: portal/blog inChurch](https://inchurch.com.br/blog/gestao-financeira-inchurch/)

### Inferences
- Para dízimo, que é tipicamente variável (% da renda), o modelo "valor fixo" do Pix Automático é o mais simples (sem aviso prévio); o membro escolhe um valor mensal e ajusta quando quiser via nova autorização.
- Custo: R$ 3,50 sobre um dízimo de R$ 100 = 3,5% — mais caro que Pix avulso (~1% ou grátis). Para igreja pequena provavelmente não compensa até haver volume/demanda.
- **Pix agendado recorrente** (o pagador agenda no seu próprio app, recorrência semanal/mensal) não exige nada do recebedor — a igreja só precisa da chave. É a recomendação "custo zero" para quem quer recorrência; a identificação continua dependendo do txid do QR estático/nome do pagador.
- Pastoral: débito automático de dízimo pode ser sensível culturalmente (alguns veem a entrega como ato de culto); oferecer como opção, não padrão.

### Gaps
- Não confirmei em fonte primária a data/regras exatas do "Pix agendado recorrente" (obrigatoriedade nos apps). A página do BCB não renderizou.
- Não encontrei casos documentados de igrejas usando Pix Automático em 2026.

## 3. APIs e PSPs: padrão BCB, bancos e fintechs, tarifas, mTLS, DX

### Takeaway
Toda API Pix "padrão BCB" (Efí, Inter, Sicredi, Sicoob, BB, Itaú) usa OAuth2 client_credentials + certificado mTLS emitido pelo PSP, e os mesmos endpoints `cob/cobv/pix/webhook`. Fintechs como Asaas e Mercado Pago oferecem APIs próprias (REST simples com API key, sem mTLS) que são mais fáceis para um backend Node/Fastify pequeno. Tarifas para PJ ficam tipicamente entre grátis (chave/QR estático em alguns bancos) e ~1–1,5% por Pix recebido; via API costuma haver tarifa desde a primeira transação.

### Cited Findings
- Tarifas de Pix PJ em 2026 variam de 0,99% a 1,45% do valor, com mínimo de R$ 1 e máximo de R$ 10 (em geral); a gratuidade não se aplica a PJ — [Nuvemshop / busca agregada](https://www.nuvemshop.com.br/blog/pix-pessoa-juridica/)
- Efí: 1,19% em todos os canais (app, web, API), 30 Pix grátis/mês via app (cota não vale para API/webhook); "operações automatizadas costumam ter tarifa desde o primeiro recebimento". Referências de mercado citadas pela Efí: Caixa 0,89%, BB 0,99%, Bradesco/Santander/Itaú 1,40–1,45% — [Efí blog, 23/09/2026](https://sejaefi.com.br/blog/qual-custo-do-pix) (fonte interessada — comparação feita por concorrente)
- Efí: todas as requisições (exceto API Cobranças) exigem certificado da Efí em .p12/.pem; gerado em "API > Meus Certificados", separado para Produção e Homologação; webhook Pix configurado via `PUT /webhook/{chave}` e exige mTLS — [Efí docs: Credenciais e certificado](https://dev.efipay.com.br/en/docs/api-pix/credenciais/); [API Evangelist – Efí Pix Webhooks](https://apis.apievangelist.com/store/efi-bank-pix-webhooks-api/). Efí tem SDKs oficiais (ex.: PHP) e até módulo MCP — [GitHub efipay](https://github.com/efipay/sdk-php-apis-efi); [Efí MCP](https://dev.efipay.com.br/en/docs/modulos/mcp/)
- Asaas: primeiras 100 transações mensais de recebimento Pix com tarifa zero quando por chave (CPF/CNPJ/aleatória) ou QR estático; depois R$ 0,99/transação nos 3 primeiros meses e R$ 1,99 após — [Asaas blog](https://blog.asaas.com/release/pix-gratuito-nas-100-primeiras-transacoes/). Asaas oferece conta PJ para associações sem fins lucrativos — [Asaas blog](https://blog.asaas.com/conta-digital-para-associacao/amp/)
- Mercado Pago: em geral sem tarifa para Pix por chave/maquininha; 0,49% para vendedores acima de R$ 15 mil/mês; Pix online (checkout/API) 0,99% — [Mercado Pago blog / busca](https://www.mercadopago.com.br/blog/evitar-cobranca-taxa-pix)
- PagBank: transferências por chave Pix grátis para PJ; Pix em checkout ou QR na maquininha até 1,89% — [busca agregada; FAQ PagBank](https://faq.pagbank.com.br/duvida/o-pix-cobra-taxas/1160)
- Banco Inter: normalmente não cobra envio/recebimento de Pix PJ por chave ou QR estático — [Wise blog](https://wise.com/br/blog/banco-inter-cobra-pix-pj)
- Existem bibliotecas comunitárias para a API Pix da Sicredi — [packagist php-api-sicredi](https://packagist.org/packages/pstrennepohl/php-api-sicredi); Bradesco publica layout próprio da API Pix — [Bradesco PDF](https://banco.bradesco/pix/assets/docs/api_pix_200.pdf)

### Inferences
- **Sicredi/Sicoob (muito comuns no RS)**: cooperativas oferecem API Pix padrão BCB com mTLS; a tarifa é negociada por cooperativa (frequentemente com condições para entidades religiosas/associados). Se a igreja já tem conta em cooperativa, o caminho natural é pedir à agência a habilitação da API Pix + certificado, ou começar só com importação de extrato.
- **DX para Node/Fastify**: APIs padrão BCB exigem `https.Agent` com `pfx`/`passphrase` (ou cert/key PEM), token OAuth2 renovado a cada ~1h, e um endpoint de webhook acessível publicamente com mTLS (alguns PSPs permitem "skip-mTLS" validando por HMAC/IP — ex.: Efí oferece essa opção **[verificar]**). Asaas/Mercado Pago: API key em header + webhook com token; integração em horas.
- **Stripe Brasil** suporta Pix como método de pagamento (fluxo de PaymentIntent com QR), mas a tarifa costuma ser superior às locais e o saque é em conta brasileira **[verificar tarifas atuais]**; pouco indicado para igrejas.
- Para entidades sem fins lucrativos, não encontrei tabelas públicas de "tarifa social" de Pix; desconto costuma ser negociação de gerente.

### Gaps
- Tarifas e requisitos atuais de API Pix de Sicredi, Sicoob, BB e Itaú não foram encontrados em fonte pública nesta pesquisa (geralmente negociados).
- Tarifas atuais do Stripe para Pix no Brasil não verificadas.
- Não verifiquei se Asaas/Mercado Pago aplicam a mesma tarifa a QR dinâmico via API (provavelmente sim, tarifa cheia sem cota grátis).

## 4. Plataformas de contribuição específicas para igrejas

### Takeaway
O mercado é dominado por apps de gestão de igrejas (inChurch, InPeace, entre outros) que embutem "Contribuir" usando um PSP por trás (ex.: Asaas, Granito) e cobram mensalidade + taxa por transação. Para uma plataforma própria, isso indica que o diferencial é a identificação/histórico do membro, não o processamento em si.

### Cited Findings
- inChurch: ~30 mil igrejas; contribuições por cartão, transferência e Pix pelo app/site; recorrência por cartão — [inChurch blog](https://inchurch.com.br/blog/gestao-financeira-inchurch/); [A Gazeta](https://www.agazeta.com.br/economia/micropix-chega-a-cultos-missas-e-conquista-comercio-de-rua-0122)
- inChurch: taxa administrativa de 4,99% por inscrição paga em eventos (todas as formas, incluindo Pix); cartão via Granito 3,78% — [portal inChurch](https://portal.inchurch.com.br/pt-br/eventos-quais-s%C3%A3o-as-taxas-por-inscri%C3%A7%C3%A3o) (taxas de eventos; taxa de dízimo não confirmada)
- inChurch: planos por tamanho, ex.: 0–100 membros R$ 99,80/mês; 1.000–2.500 membros R$ 799,80/mês; fidelidade de 12 meses (página de convênio IPIB) — [inChurch IPIB 0-100](https://inchurch.com.br/ipib/produto/siteeapp-0-100-membros/); [1000-2500](https://inchurch.com.br/ipib/produto/1000-2500-membros/)
- InPeace oferece maquininhas de cartão para igrejas integradas à sua plataforma — [InPeace](https://inpeaceapp.com/inpeace/maquininhas/)
- Asaas é usado como plataforma de pagamento para doações, ingressos, batismos e casamentos (cartão, Pix, transferência) — [link de cobrança Asaas / busca](https://www.asaas.com/c/494902420417)
- Cielo divulga maquininha voltada para igrejas e ONGs — [Blog Cielo](https://blog.cielo.com.br/produtos-e-servicos/maquininha-igrejas-ongs/?amp=1)
- Existem sistemas de "dízimo on-line" voltados a paróquias católicas (ex.: Sistema Prover) — [Gazeta do Povo, conteúdo publicitário](https://www.gazetadopovo.com.br/conteudo-publicitario/sistema-prover/dizimo-on-line/)

### Inferences
- Plataformas cobram na prática "mensalidade + ~3–5%". Uma solução própria com Pix por chave/QR estático + conciliação pode ter custo de transação perto de zero.

### Gaps
- Não obtive dados de "Dízimo Online", "Oferta Digital", "Igreja Mais" especificamente; nem a taxa da inChurch sobre dízimos via Pix (apenas eventos).

## 5. Conciliação bancária: OFX/CNAB/CSV, Open Finance, maquininhas

### Takeaway
Para uma igreja pequena, importar o extrato (OFX ou CSV, exportável de praticamente todo internet banking PJ) e casar lançamentos de Pix com contribuições é a forma mais barata de conciliação. Open Finance via agregadores (Pluggy, Belvo) automatiza a leitura do extrato mas custa milhares de reais/mês — inviável para uma igreja, exceto por planos gratuitos/limitados.

### Cited Findings
- Agregadores Open Finance: Pluggy (~R$ 2.500/mês), Belvo (~R$ 6.000/mês), Tecnospeed (~R$ 1.500 de entrada) segundo relato de desenvolvedor; Pluggy oferece "Meu Pluggy" gratuito para consumir os próprios dados — [TabNews](https://www.tabnews.com.br/GuilhermeVieira/estou-desenvolvendo-um-app-de-financas-pessoais-e-nao-consigo-pagar-o-open-finance-pluggy-r2-5k-mes-belvo-r6k-mes-tecnospeed-r1-5k-de-entrada-r540) (relato informal, preços podem ter mudado)
- Pluggy conecta a 130+ instituições por uma API e oferece iniciação Pix, Pix Automático e cash management — [Pluggy](https://pluggy.ai/en); [Pluggy docs](https://docs.pluggy.ai/docs/open-finance-regulated)
- A API Pix padrão tem endpoint `pix` para consultar Pix recebidos (por período), permitindo conciliação programática mesmo de Pix sem txid — [Swagger API Pix](https://bacen.github.io/pix-api/)

### Inferences
- **Modelo de dados sugerido (Postgres)**: `bank_transactions` (id, conta, data, valor, tipo, `end_to_end_id` único, txid, nome_pagador, documento_pagador_mascarado, descricao_raw, origem: ofx|csv|api|webhook, hash_dedupe) + `contributions` (membro_id nullable, fundo, valor, data, status: pendente|conciliada, bank_transaction_id) + tabela de regras de match.
- **Matching**: 1) txid exato (QR dinâmico) → automático; 2) txid fixo por fundo (QR estático) → separa fundo; 3) nome/CPF parcial do pagador ↔ cadastro do membro (fuzzy + CPF mascarado `***.123.456-**`) → sugestão para tesoureiro confirmar; 4) valor+data próximos de uma "intenção de contribuição" registrada no app → sugestão. Aprendizado: guardar o vínculo "nome do pagador X → membro Y" para próximos meses.
- **OFX**: o `FITID` serve de chave de dedupe; o campo `MEMO` em extratos de Pix normalmente traz "PIX RECEBIDO - NOME" (formato varia por banco). **CNAB 240/400** é mais para cobrança/boleto e pagamentos; para Pix recebido, OFX/CSV ou API são mais práticos. Parser Node: bibliotecas como `ofx-js`/`node-ofx-parser` **[verificar manutenção]**.
- **Maquininhas** (Cielo, Stone, PagBank, Mercado Pago, InPeace): não identificam o doador; conciliação é por lote diário (valor bruto, taxa, valor líquido, data de liquidação D+1/D+30). Registrar como "oferta anônima – cartão" no fundo do culto; importar relatório de vendas do adquirente (CSV) para casar com o crédito no extrato.

### Gaps
- Não confirmei formatos de MEMO OFX específicos de Sicredi/Sicoob para Pix.
- Preços atuais (2026) de Pluggy/Belvo não confirmados em fonte oficial.

## 6. Segurança e conformidade: dados do pagador, LGPD, PCI

### Takeaway
Dados de pagador do Pix (nome, CPF parcial) e o histórico de dízimos são dados pessoais — e a contribuição a uma igreja pode revelar convicção religiosa, que a LGPD trata como **dado sensível** (art. 5º, II). Armazenar o mínimo, restringir acesso por papel e nunca armazenar dados de cartão (delegar ao PSP com tokenização).

### Cited Findings
- (Não foram feitas buscas específicas de LGPD nesta rodada por limite de orçamento.) A LGPD (Lei 13.709/2018) art. 5º, II define "convicção religiosa" e "filiação a organização de caráter religioso" como dado pessoal sensível; art. 11 trata das bases legais para dados sensíveis; organizações religiosas têm tratamento específico no art. 11, II e no art. 7º/11 para "legítimo interesse" não aplicável a sensíveis **[verificar redação]** — [LGPD, Planalto](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

### Inferences
- Guardar CPF apenas mascarado como vem do PSP; se o sistema precisar de CPF completo do membro (para recibo de doação/IR), guardá-lo no cadastro do membro com consentimento, não duplicado nas transações.
- Valores individuais de dízimo devem ser visíveis só para o próprio membro e para tesouraria (RBAC por level já existe no backend do projeto); relatórios para liderança, agregados.
- Webhook: validar mTLS/HMAC, idempotência por `endToEndId`, persistir payload bruto com retenção limitada.
- Cartão: usar checkout/tokenização do PSP (Asaas, Mercado Pago, Stripe) para ficar fora do escopo PCI-DSS pesado (SAQ A); o backend nunca recebe PAN/CVV.
- Certificados mTLS (.p12) e client secrets em secret manager/variáveis de ambiente, nunca no repositório.

### Gaps
- Não pesquisei orientação da ANPD específica para organizações religiosas nem jurisprudência; recomendável consulta jurídica.

## 7. Padrões de UX: tela "Contribuir" no app do membro

### Takeaway
O padrão de mercado (inChurch e similares) é: escolher fundo → informar valor → escolher método (Pix/cartão) → exibir QR + copia-e-cola → confirmação/recibo → histórico. Com QR dinâmico + webhook, a confirmação pode ser automática em segundos.

### Cited Findings
- inChurch permite doar/pagar por cartão, transferência e Pix pelo app ou site, com recorrência por cartão — [inChurch blog](https://inchurch.com.br/blog/gestao-financeira-inchurch/)

### Inferences
- Fluxo sugerido: (1) chips de fundo (Dízimo, Oferta, Missões, Construção…, configuráveis pela tesouraria); (2) valor com teclado numérico e sugestões (último valor); (3) "Gerar Pix" → modal com QR, botão grande "Copiar código Pix", contador de expiração, instrução "cole no app do seu banco"; (4) polling/SSE no status da cobrança → tela de "Contribuição recebida, obrigado" com versículo/recibo; (5) "Minhas contribuições" com filtro por ano e exportação (útil para IR — dízimos a igreja não são dedutíveis para PF, mas membros pedem comprovante) **[verificar]**.
- Modo simples (sem API): tela mostra QR estático do fundo + copia-e-cola e um botão "Já contribuí" que registra uma *intenção* (fundo, valor, data) para facilitar a conciliação posterior com o extrato.
- Oferecer também chave Pix CNPJ visível e QR para impressão (telão/boletim) para quem não usa o app.

### Gaps
- Sem pesquisa de usabilidade/benchmarks específicos de apps de igreja.

## 8. Recomendação: abordagem simples vs. automatizada

### Takeaway
Para uma igreja pequena: começar com **chave CNPJ + QR estático com txid por fundo**, registro de intenção no app e **importação de extrato OFX/CSV com matching assistido** (custo de transação ~zero, sem mTLS). Evoluir para **QR dinâmico (`cob`) + webhook** num PSP quando o volume justificar ~1% por transação ou R$ 0,99–1,99/Pix, preferindo Asaas/Mercado Pago (DX simples) ou a API Pix da própria cooperativa (Sicredi/Sicoob) se a igreja já for correntista.

### Cited Findings
- Custos de referência: Efí 1,19% via API sem cota grátis; Asaas 100 Pix grátis/mês por chave/QR estático depois R$ 0,99–1,99; Inter grátis por chave/QR estático; Mercado Pago 0,99% online; Pix Automático R$ 3,50 na Efí — [Efí](https://sejaefi.com.br/blog/qual-custo-do-pix); [Asaas](https://blog.asaas.com/release/pix-gratuito-nas-100-primeiras-transacoes/); [Wise sobre Inter](https://wise.com/br/blog/banco-inter-cobra-pix-pj); [Mercado Pago](https://www.mercadopago.com.br/blog/evitar-cobranca-taxa-pix)
- Plataformas prontas: inChurch R$ 99,80/mês (até 100 membros) + taxas por transação — [inChurch IPIB](https://inchurch.com.br/ipib/produto/siteeapp-0-100-membros/)

### Inferences
- **Fase 1 (MVP, custo zero)**: cadastro de fundos; QR estático por fundo gerado no backend (lib BR Code, ex. `pix-utils`/`qrcode-pix` **[verificar]**) com txid `DIZIMO`, `OFERTA`…; registro manual pela tesouraria e/ou "intenção" pelo membro; importação OFX/CSV com dedupe e sugestões de match; relatórios por fundo/mês.
- **Fase 2 (automatizada)**: PSP com API; `POST /cob` por contribuição com txid = UUID sem hífens (32 chars), `infoAdicionais` = fundo; webhook Fastify → upsert por `endToEndId` → marca contribuição como paga; job diário `GET /pix?inicio&fim` para reconciliar webhooks perdidos.
- **Fase 3 (opcional)**: Pix Automático para dízimo recorrente, Open Finance, cartão tokenizado.
- Atenção: a igreja precisa ter conta PJ no PSP escolhido para a API emitir cobranças na chave dela; trocar de banco pode significar migrar chave CNPJ (portabilidade de chave é possível).

### Gaps
- Escolha final depende do banco atual da igreja e de tarifas negociadas, não públicas.
