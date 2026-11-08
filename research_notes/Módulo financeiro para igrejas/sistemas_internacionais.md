# Como ChMS internacionais modelam dízimos, ofertas e finanças da igreja

> Pesquisa feita em nov/2026. Fontes principais: help centers oficiais (Planning Center, Rock RMS, TouchPoint, Elvanto, ACS/Realm), o schema SQL do ChurchCRM no GitHub, blogs de fornecedores e fóruns. Várias páginas de ajuda (Breeze, Tithe.ly, Elvanto, MinistryPlatform, alguns artigos do Realm) retornaram 403/404/redirect e não puderam ser lidas na íntegra. Esses casos estão marcados em "Gaps".
>
> Contexto de mercado (relevante para "produtos atuais"): o Breeze ChMS pertence à Tithe.ly (o blog do Breeze hoje redireciona para get.tithe.ly), o Elvanto também é um produto Tithe.ly, e a ACS Technologies (Realm, MinistryPlatform, ACS) foi adquirida pela Vanco em dez/2025. Ver os detalhes na seção 1.

---

## 1. Modelagem de dados: fundos, lotes (batches), doações, formas de pagamento, campanhas/compromissos, doações recorrentes e doador (pessoa x família)

### Takeaway
O modelo é praticamente o mesmo em todos os produtos: **Fundo/Conta** (hierárquico, com flag de dedutibilidade e código contábil) ← **Detalhe da transação** (uma doação dividida entre vários fundos) ← **Transação/Doação** (pessoa, data, forma de pagamento, origem, nº do cheque) ← **Lote/Batch** (grupo de transações com total de controle e status aberto/fechado) ← opcionalmente um **Depósito** (um ou mais lotes que vão ao banco juntos). **Compromisso (Pledge)** e **Doação recorrente (Scheduled transaction)** são entidades separadas. O "doador" é uma pessoa, mas existe um mecanismo de "unidade de doação" (giving group/household) para consolidar a família.

### Cited Findings

**Rock RMS (open source): conceitos e campos documentados**
- Contas (Accounts = fundos) são hierárquicas (pai/filho), com os campos Name, Description, Active (uma conta inativa continua no histórico mas não pode receber lançamentos novos), Show Publicly, Public Name, **GL Code** (referência ao plano de contas do sistema contábil), **Tax Deductible**, Start/End Date, Campus e Account Type (ex.: doações x inscrições em eventos). Aceita atributos customizados na entidade "Financial Account". — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- Transação: Person ("quem iniciou e autorizou a transação"), Date/Time, **Source** (coleta presencial, online, leitura de cheque etc.), **Transaction Code** (normalmente gerado pelo gateway), **Currency Type** (dinheiro, cheque, cartão ou bens não monetários como imóveis e ações), **Transaction Type** ("Contribution" ou "Event Registration"), Summary e **Account Split** (os detalhes por conta). Uma transação pode ser dividida entre vários fundos via Transaction Details. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- Lotes têm os status **Open / Closed / Pending**, mais **Control Amount**, **Control Item Count**, Transaction Total, variância calculada, Accounting Code (ID do lançamento no GL) e Start/End Dates. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- Doações recorrentes (Scheduled Transactions) têm as frequências Weekly, Bi-Weekly, Twice Monthly, Monthly, Quarterly, Bi-Annually e Yearly, e os status Active, Canceled, Completed, Failed, Past Due e Paused. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- Pledges são "a commitment to an amount that they will be giving over a stated period of time". Desde a versão 16 existe **Pledge History** para registrar as alterações do compromisso. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- Unidade familiar: "If an individual combines their giving with their family, then the head of household will be listed". Ou seja, a consolidação familiar é opcional e definida por pessoa. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- Transaction Sources e Currency/Tender Types são listas configuráveis (Defined Types). — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)

**ChurchCRM (open source): schema SQL real (`src/mysql/install/Install.sql`)**
- `donationfund_fun`: `fun_ID`, `fun_Active` enum('true','false'), `fun_Name` varchar(30), `fun_Description` varchar(100), `fun_Order`, `fun_Category` varchar(50). — [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql)
- `deposit_dep` (é o "lote"/ficha de depósito): `dep_ID`, `dep_Date`, `dep_Comment`, `dep_EnteredBy`, **`dep_Closed`** tinyint, **`dep_Type` enum('Bank','CreditCard','BankDraft')**. — [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql)
- `pledge_plg` guarda **compromissos e pagamentos na mesma tabela**, diferenciados por `plg_PledgeOrPayment` enum('Pledge','Payment'). Colunas: `plg_FamID` (**o doador é a família**, não a pessoa), `plg_FYID` (ano fiscal), `plg_date`, `plg_amount` decimal(8,2), `plg_schedule` enum('Weekly','Monthly','Quarterly','Once','Other'), `plg_method` enum('CREDITCARD','CHECK','CASH','BANKDRAFT'), `plg_comment`, `plg_DateLastEdited`, `plg_EditedBy`, `plg_fundID`, `plg_depID` (FK do depósito), `plg_CheckNo`, `plg_Problem`, `plg_scanString`, `plg_aut_ID`/`plg_aut_Cleared`/`plg_aut_ResultID` (débito automático), **`plg_NonDeductible`** decimal e **`plg_GroupKey`** varchar(64). O GroupKey agrupa as linhas de uma mesma doação dividida entre fundos (cada fundo vira uma linha). — [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql)
- `pledge_denominations_pdem`: `pdem_plg_GroupKey`, `plg_depID`, `pdem_denominationID`, `pdem_denominationQuantity`. Registra a **contagem por cédula/moeda** de uma doação em dinheiro. — [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql)
- Conceitos do ChurchCRM: Pledges ("promise of support"), Deposit Slips (lote impresso no formulário bancário), Payments (cash, check, credit card, bank draft) e Reminder Statements (cartas à **família** com o progresso do compromisso no ano fiscal). — [ChurchCRM wiki Finances (via resultado de busca)](https://github.com/ChurchCRM/CRM/wiki/Finances)

**Planning Center Giving**
- Lotes servem para "physical donations, like cash and checks, or donations from external payment sources". **Batch Groups** são opcionais e totalmente customizáveis. Exemplos: um grupo por domingo, com lotes separados para dinheiro e cheque, ou um lote por culto dentro do grupo da semana. — [PCO Batches](https://help.planningcenter.com/en/138386-batches.html)
- **Batch defaults**: fundo, payment source, payment method, received date e labels já vêm pré-preenchidos para agilizar a digitação. Formas de pagamento: check, cash, ACH, card. — [PCO Batches](https://help.planningcenter.com/en/138386-batches.html)
- Fundos ficam visíveis para doadores online e por SMS por padrão, mas podem ser marcados como **"admin only"**. — [PCO (via busca)](https://help.planningcenter.com/en/batches.html)
- O PCO tem as entidades **Payment Sources** (origens externas), **Labels** (tags livres nas doações), **Campaigns** (campanhas de compromisso com pledges) e **Automations**. — [PCO Permissions in Giving](https://help.planningcenter.com/en/140716-permissions-in-giving.html)

**TouchPoint (ChMS norte-americano, documentação aberta)**
- Batch (chamado de "bundle"): "a handful (not an exact number) of envelopes or checks (or an electronic file) that will be processed as a group". Recomenda cerca de 50 itens por lote para facilitar a localização de erros. Guarda data, deposit date, totais e fundos. — [TouchPoint Contribution Terms](https://docs.touchpointsoftware.com/Finance/ContributionTerms.html)
- Tipos de contribuição: Regular (dinheiro/cheque), Online, **Returned Check**, **Reversed**, Pledge, **Non Tax-Deductible**, **Gift in Kind**, Stock. Também há **Soft Credit** (crédito a um compromisso sem ser o doador) e **Split** (divisão entre fundos). — [TouchPoint Contribution Terms](https://docs.touchpointsoftware.com/Finance/ContributionTerms.html)

**Elvanto (Tithe.ly)**
- Batches são "a collection of transactions grouped together… typically attributed to grouped transactions that are deposited at the same time". Com integração a um provedor de doação online, o lote recebe o nome do provedor mais a data. Há busca por nome, **Giving Number** e número do lote. — [Elvanto help (via busca)](https://help.elvanto.com/hc/en-us/articles/7482278722199-Financial-Section-Overview); [Elvanto Searching Financials](https://help.elvanto.com/hc/en-us/articles/15679585766295)

**MinistryPlatform (ACS/Vanco)**
- Hierarquia em três níveis: doações → **batches** → **deposits**. A ferramenta "Create Deposit" cria um depósito para vários lotes ou um depósito por lote. — [MinistryPlatform Create Deposit tool (via busca)](https://help.acst.com/ministryplatform/help-topics/tools/create-deposit-tool)

**Breeze (Tithe.ly)**
- Na tela Add Contributions aparecem as informações do lote, a contagem de entradas e o total, e é possível fechar o lote. Também permite editar em massa as transações de um lote e filtrar contribuições por data, fundo, método etc. Suporta pledges. — [Breeze support (via busca)](https://support.breezechms.com/hc/en-us/articles/1500004698582); [Breeze bulk update](https://support.breezechms.com/hc/en-us/articles/360046940973-Bulk-Update-Giving-Transaction-Information-Batches)

**Pushpay / Church Community Builder (ChurchStaq)**
- **Households** agrupam membros em uma única unidade de doação (Household Profile). Os Household Giving Statements consolidam toda a família e ficam acessíveis ao membro primário e ao secundário. — [Pushpay blog (via busca)](https://pushpay.com/blog/church-contribution-statement-generation/)

### Inferences
- **Entidades do Rock (conhecimento prévio, não reconfirmado nesta sessão):** o modelo em C# usa `FinancialAccount`, `FinancialBatch` (Status, ControlAmount, ControlItemCount, BatchStartDateTime/EndDateTime, AccountingSystemCode, IsAutomated), `FinancialTransaction` (AuthorizedPersonAliasId, BatchId, TransactionDateTime, TransactionCode, SourceTypeValueId, TransactionTypeValueId, FinancialPaymentDetailId, ShowAsAnonymous), `FinancialTransactionDetail` (TransactionId, AccountId, Amount, FeeAmount), `FinancialPaymentDetail` (CurrencyTypeValueId, CreditCardTypeValueId, AccountNumberMasked), `FinancialScheduledTransaction`, `FinancialPledge` (PersonAliasId, GroupId, AccountId, TotalAmount, PledgeFrequencyValueId, StartDate, EndDate), `FinancialPersonSavedAccount`, `FinancialTransactionRefund` e `FinancialStatementTemplate`. A unidade familiar é `Person.GivingGroupId` (mais o calculado `GivingId` = "G{groupId}" ou "P{personId}"). Recomendo checar no repositório SparkDevNetwork/Rock (`Rock/Model/Finance/`) antes de usar como referência definitiva.
- Padrão de design recomendado para a IBBF, a partir do que é comum aos produtos: `fundo` (com `restrito`/`designado`, `ativo`, `visivel_publicamente`, `codigo_contabil`, `pai_id`), `lote` (`status` aberto/fechado/[pendente], `valor_controle`, `qtd_controle`, `data`, `culto/evento`, `fechado_por`, `fechado_em`), `transacao` (`membro_id` nulo = anônimo, `lote_id`, `data`, `forma_pagamento` [dinheiro, PIX, cartão, transferência, cheque], `origem` [culto, online, PIX direto], `codigo_externo` [e2eId do PIX]) e `transacao_item` (`fundo_id`, `valor`). Pledge e recorrência em tabelas próprias.
- O ChurchCRM mostra um anti-padrão: usar uma tabela única para pledge e pagamento, com o split por GroupKey e a família como doador obrigatório. O Rock/PCO é mais limpo: doador = pessoa, mais uma unidade de doação opcional.

### Gaps
- Não consegui ler as páginas atuais do Breeze, Tithe.ly (ChMS/Giving), Elvanto e MinistryPlatform na íntegra (403/redirect). Os campos de transação desses produtos não foram confirmados.
- Não encontrei documentação pública das entidades/campos do ACS Realm, PowerChurch e Shelby.
- As tabelas de débito automático do ChurchCRM (`autopayment_aut`, `egive_egv`) não apareceram no trecho extraído do Install.sql.

---

## 2. Fluxo do lote (batch) para dinheiro/cheque após o culto: contagem, conferência, fechamento/travamento e conciliação bancária

### Takeaway
O fluxo canônico é: **abrir o lote (por culto/data e forma de pagamento) → digitar os envelopes/itens → comparar o total digitado com o total contado à mão (control amount / expected total) → fechar ou "commit" o lote, o que o trava e o torna visível ao doador e ao relatório → agrupar lotes em um depósito → lançar no GL/conciliar com o extrato.** A separação de papéis (quem conta e digita ≠ quem fecha) é implementada por permissão.

### Cited Findings
- **Rock:** o Control Amount existe porque "it's common to first add up the transaction amounts by hand. This number is then entered into the Control Amount column". O sistema calcula a variância entre o controle e o realizado (valor e quantidade). **Closed** "prevents editing without elevated security permissions" e indica que os valores já foram lançados no GL. Reabrir um lote fechado exige uma permissão específica. Lotes **automated** (vindos de software de leitura de cheque) ficam em Pending e não podem ser editados até a integração terminar. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **Rock:** a integração com o GL não leva cada doação. A igreja "enter[s] the batch totals" no sistema contábil, e o Rock preserva o detalhe. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **Rock:** a tela Match Transactions associa cheques e envelopes escaneados a pessoas por conta bancária/routing, por **Envelope #** ou manualmente, e permite alocar entre fundos. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **Planning Center:** **In Progress** = visível só a administradores/bookkeepers, o doador não vê, automações não disparam, aparece o carimbo "Uncommitted" e **as alterações não são registradas em log**. **Committed** = "successful, fully qualified donations", visíveis ao doador no Church Center, recibos enviados por e-mail e **alterações registradas no system log**. — [PCO Batches](https://help.planningcenter.com/en/138386-batches.html)
- **Planning Center:** quando o lote faz parte de um batch group, só é possível fazer o commit do grupo inteiro ("Commit group ([N] batches)…"). Ainda é possível adicionar doações a um lote committed, o que envia recibo e grava log imediatamente. A exclusão de um lote committed também fica em log. — [PCO Batches](https://help.planningcenter.com/en/138386-batches.html); [PCO (via busca)](https://help.planningcenter.com/en/batches.html)
- **Planning Center:** os lotes podem ser exportados em CSV ou impressos como relatório de lote. Para digitar, basta posicionar o cursor e passar o leitor de cheque, que preenche os dados sozinho. — [PCO Batches](https://help.planningcenter.com/en/138386-batches.html)
- **TouchPoint:** o lote fica **Closed** quando o "Actual Amount matches the Estimated Amount". — [TouchPoint Contribution Terms](https://docs.touchpointsoftware.com/Finance/ContributionTerms.html)
- **ChurchCRM:** o fluxo é "New Deposit Slip (checks and cash)" → digitar pagamentos → "Generate PDF" (ficha de depósito bancário) → **"Close deposit slip"** depois que o depósito é embalado para o banco. A tabela `pledge_denominations_pdem` permite registrar a contagem por denominação de cédula. — [ChurchCRM wiki (via busca)](https://github.com/ChurchCRM/CRM/wiki/Finances); [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql)
- **MinistryPlatform:** um ou mais lotes formam um depósito (Create Deposit tool). — [MinistryPlatform (via busca)](https://help.acst.com/ministryplatform/help-topics/tools/create-deposit-tool)
- **Realm:** há a função "Print a Deposit Slip" a partir do lote, e os lotes de contribuição podem ser postados como depósitos no General Ledger. — [Realm Print a Deposit Slip](https://help.acst.com/realm/how-to/giving/contributions/batches/print-a-deposit-slip); [Realm Accounting Brief (PDF, 2025)](https://acstechnologies.com/realm/wp-content/uploads/sites/3/2025/02/Realm-Accounting-Brief.pdf)
- **PowerChurch Plus:** as contribuições ficam "unposted" até o posting. Ao postar, o sistema pergunta "How would you like to post these contributions?" e oferece **"Update Fund Accounting"** (cria o lançamento contábil usando as contas vinculadas a cada fundo de contribuição) ou **"Post to Contributions Only"**. Se houver várias datas não postadas, pede para escolher quais postar. — [PowerChurch KB](https://www.powerchurch.com/support/373/4/post-transactions-in-fund-accounting); [PowerChurch forum](https://www.powerchurch.com/forum/viewtopic.php?p=1755)
- **Pushpay (Batch Entry):** agrupa transações offline com subtotais automáticos e rastreia "from the service to the bank for better auditing of funds". Envia os **totais do lote por fundo** automaticamente ao QuickBooks Online. — [Pushpay blog, "Simplify financial reconciliation"](https://pushpay.com/blog/simplify-financial-reconciliation/) (o fetch indicou a data 11/jun/2026; não confirmei de forma independente.)
- **Elvanto:** um lote corresponde ao que é depositado junto no banco. — [Elvanto (via busca)](https://help.elvanto.com/hc/en-us/articles/7482278722199-Financial-Section-Overview)

### Inferences
- Para o Brasil, o "lote" deveria nascer **por culto** (ex.: "Culto domingo noite 03/11 – Dinheiro") com `valor_contado` digitado pela dupla de contagem e um `valor_lançado` calculado. Só deveria fechar com variância zero ou com justificativa. O PIX e o cartão entram como lotes automáticos (por dia ou por liquidação), no estilo do "Pending/automated" do Rock e do nome "provedor + data" do Elvanto.
- A prática de duas pessoas contarem e assinarem (comum em manuais de tesouraria) pode ser modelada com `contado_por_1`, `contado_por_2` e `conferido_por` no lote. Nenhum dos produtos pesquisados documenta esse campo explicitamente, mas o control amount cumpre esse papel.
- O depósito/conciliação é um nível acima do lote (MinistryPlatform, ChurchCRM, Realm). Para uma igreja pequena, basta a regra "lote fechado = 1 depósito", com o campo `comprovante_deposito`.

### Gaps
- Não encontrei, nos produtos de "giving" (PCO, Breeze, Tithe.ly), conciliação bancária linha a linha com importação de extrato. Isso fica a cargo do sistema contábil (QuickBooks, Realm Accounting, Aplos). Não consegui confirmar se o Realm Accounting tem importação OFX: o brief cita apenas "account reconciliation".
- O fluxo de "Admin Batch Giving" (beta) da Tithe.ly não pôde ser lido (403).

---

## 3. Dinheiro solto/anônimo x doações identificadas; a família como unidade de doação (extratos conjuntos)

### Takeaway
Ninguém deixa a transação "sem doador" no núcleo do modelo. O padrão é criar uma **pessoa fictícia "Anônimo/Oferta solta"** e vincular a ela o dinheiro não identificado, ou usar uma flag "show as anonymous" para doações identificadas que o doador quer anônimas. A família é tratada como **unidade de doação opcional** (Rock: combinar com a família; Pushpay: household; TouchPoint: statement Individual/Joint/None). O ChurchCRM é exceção, porque o doador é sempre a família.

### Cited Findings
- **Rock:** as igrejas costumam "enter an anonymous user into your database and link all anonymous gifts to this person" para o dinheiro coletado. Uma transação identificada pode ser marcada **"Show As Anonymous"**. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **Rock:** quando o indivíduo combina suas doações com as da família, os relatórios mostram o head of household. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **TouchPoint:** a opção de extrato por pessoa pode ser **Individual** (extrato separado), **Joint** (casal combinado) ou **None**, e a opção de envelopes segue a mesma lógica. — [TouchPoint Contribution Terms](https://docs.touchpointsoftware.com/Finance/ContributionTerms.html)
- **Pushpay/CCB:** Household Profile como unidade de doação. O Household Giving Statement combina as doações da casa e fica acessível ao membro primário e ao secundário. — [Pushpay blog (via busca)](https://pushpay.com/blog/church-contribution-statement-generation/)
- **ChurchCRM:** `pledge_plg.plg_FamID` mostra que pagamentos e compromissos são vinculados à **família**. — [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql)
- **Planning Center:** existe a ação "Join donors" (mesclar perfis de doadores), restrita a Administrator e Bookkeeper. — [PCO Permissions in Giving](https://help.planningcenter.com/en/140716-permissions-in-giving.html)
- **Envelopes e números de doador:** o Rock busca por "Envelope #" e o Elvanto tem **Giving Numbers** configuráveis, usados para identificar o doador sem expor o nome a quem digita. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15); [Elvanto Set Up Giving Numbers](https://help.elvanto.com/hc/en-us/articles/7659300084887)

### Inferences
- Para a IBBF (que já tem `families` no backend), a sugestão é: `transacao.membro_id` nullable + `transacao.anonima` boolean (ou um membro sistêmico "Oferta não identificada"), e um campo `membro.doacao_combinada_familia` boolean / `familia.extrato_conjunto` para decidir se o informe sai por pessoa ou por família. Em um contexto brasileiro, o dízimo costuma ser individual, mas casais frequentemente entregam juntos.
- Um "número de dizimista/envelope" opcional ajuda a separar a identificação do nome para os contadores voluntários.

### Gaps
- Não encontrei documentação de como Breeze, Realm e PCO tratam a "oferta solta" no lote (se exigem doador ou aceitam linha sem pessoa).

---

## 4. Extratos de contribuição (informe anual): geração, entrega e privacidade

### Takeaway
Todos geram extratos por intervalo de datas, por pessoa ou unidade familiar, com templates configuráveis, e os entregam por e-mail/PDF ou pelo portal do membro. A diferenciação entre dedutível e não dedutível é por fundo ou por transação. Gerar e enviar extratos é privilégio dos papéis financeiros mais altos.

### Cited Findings
- **Rock:** Contribution Statements por indivíduo ou giving unit com intervalo de datas customizável. A dedutibilidade é definida pela flag **Tax Deductible** na conta. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **Planning Center:** "Create/edit/generate email statements" é permitido só a Administrator e Bookkeeper. O doador vê as doações committed no **Church Center** (portal do membro). — [PCO Permissions in Giving](https://help.planningcenter.com/en/140716-permissions-in-giving.html); [PCO Batches](https://help.planningcenter.com/en/138386-batches.html)
- **Breeze:** gera extratos customizáveis de fim de ano ou meio de ano, salva várias configurações de extrato e permite incluir um resumo de pledges. — [Breeze blog (via busca)](https://www.breezechms.com/blog/how-to-make-contribution-statements-a-breeze-this-year); [Breeze blog, 8 tips (via busca)](https://www.breezechms.com/blog/8-tips-for-creating-great-end-of-year-tax-statements-in-breeze)
- **ChurchCRM:** "Reminder Statements" para a família com o progresso do compromisso no ano fiscal. — [ChurchCRM wiki (via busca)](https://github.com/ChurchCRM/CRM/wiki/Finances)
- **ChurchCRM/TouchPoint:** valor não dedutível na própria doação (`plg_NonDeductible`) ou tipo "Non Tax-Deductible". — [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql); [TouchPoint](https://docs.touchpointsoftware.com/Finance/ContributionTerms.html)
- **Elvanto:** tem um "Complete Guide to Giving Statements", geração para doadores específicos e uma ferramenta **My Giving** para o membro consultar as próprias doações. — [Elvanto statements](https://help.elvanto.com/hc/en-us/articles/7624155858967); [Elvanto My Giving](https://help.elvanto.com/hc/en-us/articles/7659369765143-My-Giving-Tool-For-Members-in-Elvanto)
- **Pushpay:** extratos por household acessíveis ao primário e ao secundário. — [Pushpay blog (via busca)](https://pushpay.com/blog/church-contribution-statement-generation/)

### Inferences
- No Brasil, o "informe de doações" não tem o mesmo peso fiscal que nos EUA (a pessoa física não deduz doação à igreja no IRPF). O valor é mais de **transparência e gratidão**. Um "Meus dízimos" no portal do membro (como Church Center e My Giving) é mais útil do que um PDF de fim de ano, mas o PDF continua sendo pedido.
- Pela LGPD, o dado de quanto alguém doa é sensível na prática (convicção religiosa é dado sensível pelo art. 5º, II). Faz sentido restringir o acesso como faz o PCO.

### Gaps
- O conteúdo detalhado dos guias de extrato do Breeze e do Elvanto não pôde ser lido (redirect/403). Não confirmei opções como "combinar cônjuges" e "excluir fundos".

---

## 5. Permissões: Admin financeiro, Contador (counter), Bookkeeper; quem vê valores individuais; auditoria; travamento após o fechamento

### Takeaway
O Planning Center tem o modelo mais claro e mais copiável: **Administrator > Bookkeeper > Counter > Reviewer**. O **Counter** digita doações em lotes abertos mas **não faz commit nem vê o histórico de doadores**. O **Reviewer** vê só relatórios agregados e anonimizados. O travamento acontece pelo status do lote (committed/closed), e a reabertura exige permissão elevada (Rock). O log de auditoria cobre apenas os dados já fechados (PCO) ou as alterações contábeis (Realm).

### Cited Findings
- **Matriz do PCO (verbatim resumido):** **Administrator**: tudo, incluindo change settings, update permissions, create/edit funds, change default fund e create campaigns. **Bookkeeper**: view settings, create/edit payment sources, view funds/labels, manage labels, **bulk edit donations**, create automations, **view system logs**, **commit batches**, enter donations in / manage / delete **committed** batches, access donation history, join donors, email donors, view payout reports/donation list, create/generate email statements, receive donation notifications. **Counter**: manage batches/batch groups, enter donations in, manage and delete **In Progress** batches, manage profile contact info, search people, view dashboard, view campaign list/pledges. **Não pode** commit, acessar o histórico de doações, ver a donation list ou gerar extratos. **Reviewer**: nada disso. — [PCO Permissions in Giving](https://help.planningcenter.com/en/140716-permissions-in-giving.html)
- O PCO descreve o Counter como "limited access role for staff and volunteers who help enter check and cash donations… with no access to sensitive information like donor profiles, giving history". O Reviewer serve para "pastoral staff, board members… general, anonymized reports or pledge campaign dashboards", sem editar nada e sem dados pessoais. — [PCO blog "new permission levels in giving" (2020, via busca)](https://www.planningcenter.com/blog/2020/10/new-permission-levels-in-giving)
- **PCO, auditoria:** alterações em lotes In Progress não são logadas. Alterações e exclusões em lotes committed vão para o system log. — [PCO Batches](https://help.planningcenter.com/en/138386-batches.html)
- **Rock:** os papéis de segurança são **RSR - Finance Administration** (acesso total) e **RSR - Finance Worker** (processamento). Reabrir um lote fechado exige uma permissão específica no nível da entidade. Lotes Closed não podem ser editados sem permissão elevada. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **Realm Accounting:** "detailed change log that records… posted transactions, edited and deleted budgets, and canceled check runs" e "Provide access to Realm Accounting for only those who need it". — [Realm Accounting Brief (PDF, fev/2025)](https://acstechnologies.com/realm/wp-content/uploads/sites/3/2025/02/Realm-Accounting-Brief.pdf)
- **ChurchCRM:** `plg_EditedBy`/`plg_DateLastEdited` e `dep_EnteredBy` registram quem lançou e quem editou por último (auditoria mínima, sem histórico). — [ChurchCRM Install.sql](https://raw.githubusercontent.com/ChurchCRM/CRM/master/src/mysql/install/Install.sql)
- **Rock 16+:** Pledge History registra as alterações de compromissos "for transparency and accountability". — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)

### Inferences
- Mapeamento para os papéis da IBBF (o backend já tem RBAC por `level`): **Tesoureiro (admin financeiro)** ≈ Administrator. **Auxiliar de tesouraria/secretário financeiro** ≈ Bookkeeper. **Contador de ofertas (diácono/voluntário)** ≈ Counter, que digita no lote aberto e não vê histórico. **Pastor/conselho fiscal** ≈ Reviewer, que vê totais por fundo e tendências sem nomes. Vale a pena ter uma permissão separada "ver valores individuais".
- Auditoria: gravar log em **toda** alteração depois que o lote é fechado, além da reabertura (quem, quando, motivo). Bloquear a edição de lotes de um mês já "fechado" na prestação de contas.

### Gaps
- Não encontrei a matriz de permissões publicada de Breeze, Tithe.ly, Realm Giving e MinistryPlatform.

---

## 6. Gestão de doações x contabilidade completa (fund accounting, GL, contas a pagar, orçamento); fundos restritos e livres

### Takeaway
Há duas famílias de produtos. **Só doações** (Planning Center Giving, Breeze, Tithe.ly, Elvanto, Pushpay, Rock e ChurchCRM no core) exportam **totais por lote e fundo** para um sistema contábil externo, normalmente via o código GL do fundo. **Fund accounting completo** (ACS Realm Accounting, PowerChurch Plus, ShelbyNext Financials, Aplos/Velora) tem GL de partidas dobradas com o segmento "fundo", contas a pagar, orçamento e balanço por fundo, e liga os fundos de contribuição às contas do GL para postar os lotes como depósitos.

### Cited Findings
- **Rock:** cada conta/fundo tem um **GL Code**, e os lotes têm um Accounting Code. A ponte com a contabilidade é por totais de lote. — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **Realm Accounting:** caixa e competência ("cash and accrual-based accounting methods"); "create multiple funds" e uso nos lançamentos; os lotes de contribuição postam como **depósitos no GL**; o plano de contas é feito por **segments** ("any combination of funds, core accounts, and department segments"); fornecedores/payees, faturas recorrentes e emissão de cheques (contas a pagar); **budgets** com importação e exportação; projetos; lançamentos recorrentes; folha de pagamento; relatórios de statements, GL e AP; change log; acesso restrito. — [Realm Accounting Brief (PDF, fev/2025)](https://acstechnologies.com/realm/wp-content/uploads/sites/3/2025/02/Realm-Accounting-Brief.pdf)
- **Realm:** os Giving Funds são vinculados a contas do GL, e a igreja escolhe quais lotes postar automaticamente e quais manualmente. Segundo fonte secundária, os fundos restritos são separados automaticamente e há balanço por fundo sem configuração extra. — [ACS/Realm (via busca)](https://acstechnologies.com/realm/?p=340); [Pushpay comparativo (via busca, fonte concorrente)](https://pushpay.com/?p=21124)
- **PowerChurch Plus:** postagem "Update Fund Accounting" pelas contas vinculadas aos fundos de contribuição. GL "fund-aware" com saldos separados para fundos restritos e livres (esta última afirmação vem de um agregador). — [PowerChurch KB](https://www.powerchurch.com/support/373/4/post-transactions-in-fund-accounting); [PowerChurch forum](https://powerchurch.com/forum/viewtopic.php?p=3448); [agregador worldmetrics (baixa confiabilidade)](https://worldmetrics.org/best/church-accounting-software/)
- **Aplos:** distingue **unrestricted**, **temporarily restricted** (o doador especifica o uso) e **permanently restricted** (endowment, só os rendimentos podem ser usados). Registra quando a restrição é cumprida e "release" dos ativos. Fundos mais **tags** para programas e projetos. Relatórios: Statement of Activities e Balance Sheet. — [Aplos Academy, church accounting](https://aplos.com/academy/church-management/church-accounting); [Aplos glossary, temporarily restricted](https://www.aplos.com/glossary/temporarily-restricted-net-assets); [Aplos fund accounting](https://aplos.com/academy/what-is-fund-accounting-and-why-do-nonprofits-need-it). **Observação:** os resultados indicam que o Aplos virou "Velora Fund Accounting" ([joinvelora.com](https://www.joinvelora.com/fund-accounting)). Não verifiquei data nem detalhes.
- **Pushpay:** em vez de contabilidade própria, envia os totais dos lotes por fundo ao **QuickBooks Online**. — [Pushpay blog](https://pushpay.com/blog/simplify-financial-reconciliation/)
- **ShelbyNext Financials** é o produto contábil da Shelby Systems, hoje sob a Ministry Brands. — [ministrybrands.com/shelby](https://ministrybrands.com/shelby); [Capterra ShelbyNext Financials](https://www.capterra.com/p/104924/ShelbyNext-Financials/)
- **Mercado:** a Vanco adquiriu a ACS Technologies (Realm, MinistryPlatform) em dez/2025, e a ACS segue como marca separada. — [BusinessWire 2025-12-03 (via busca)](https://www.businesswire.com/news/home/20251203038782/en)

### Inferences
- Para uma igreja batista pequena no Brasil, contabilidade completa (partidas dobradas, AP, folha) costuma ficar com o contador externo (escrituração ECD/ITG 2002 para entidades sem fins lucrativos). Um meio-termo útil é **registro de entradas por fundo + registro de saídas (despesas) por categoria e fundo + saldo por fundo + orçamento x realizado**, com exportação para o contador. Isso dá o "balanço por fundo" sem GL completo.
- Fundos **designados** (missões, construção, ação social) devem ser marcados como `restrito = true`, para que o saldo apareça separado e as despesas só possam ser debitadas do fundo correspondente. É a versão simplificada de temporarily restricted / unrestricted do Aplos.

### Gaps
- Não consegui detalhes de primeira mão do ShelbyNext Financials nem do módulo contábil do PowerChurch (telas e relatórios). As fontes encontradas são agregadores.
- Não confirmei se o Realm faz conciliação bancária com importação de extrato.

---

## 7. Dashboards e relatórios típicos

### Takeaway
Relatórios recorrentes: **tendência de doações por período e fundo**, **lista de doações e exportações por lote**, **análise por doador (padrões e alertas de mudança)**, **acompanhamento de campanhas/pledges**, **relatório de taxas de transação**, **saldo por fundo** e **orçamento x realizado** (estes dois só nos produtos com contabilidade). Métricas de primeiros doadores e retenção aparecem em ferramentas de fundraising e em parte nos ChMS. Não achei documentação primária de um "retention dashboard" nativo no PCO.

### Cited Findings
- **Planning Center:** o dashboard mostra o número de doações por dia, semana, mês ou ano, com tendências e widgets interativos. O Counter também pode ver o dashboard. — [PCO Dashboard (via busca)](https://help.planningcenter.com/en/138402-dashboard.html); [PCO Permissions](https://help.planningcenter.com/en/140716-permissions-in-giving.html)
- **Rock:** **Giving Analytics** (modos gráfico e detalhe, com filtro por data, conta, currency type, source e data view); **Giving Overview** ("innovative alerts when an individual's giving patterns change", v13+); **Volunteer Generosity Report**, **Tithing Overview** e **Transaction Fee Report** (v17+). — [Rock RMS Finance docs](https://community.rockrms.com/documentation/bookcontent/15)
- **PCO:** os Reviewers veem "general, anonymized reports or pledge campaign dashboards". — [PCO blog 2020 (via busca)](https://www.planningcenter.com/blog/2020/10/new-permission-levels-in-giving)
- **Elvanto:** tem "Built-in Financial Reports". — [Elvanto (via busca)](https://help.elvanto.com/hc/en-us/articles/28091432077335-Understanding-Built-in-Financial-Reports-in-Elvanto)
- **MinistryPlatform:** possui uma categoria de "Contributions Reports". — [MinistryPlatform reports (via busca)](https://help.acst.com/ministryplatform/help-topics/reports/contributions-reports)
- **Realm Accounting:** budgets e relatórios de GL, AP e statements. — [Realm Accounting Brief](https://acstechnologies.com/realm/wp-content/uploads/sites/3/2025/02/Realm-Accounting-Brief.pdf)
- **Retenção (benchmark do setor sem fins lucrativos, não específico de igrejas):** 19,4% dos doadores de primeira vez doaram de novo em 2024, contra 69,2% de retenção entre doadores recorrentes. — [Bloomerang (via busca)](https://bloomerang.com/blog/whats-the-impact-of-improving-1st-time-donor-retention)

### Inferences
- Um conjunto mínimo de dashboard para a IBBF: entradas do mês por fundo (dízimo, oferta, missões, construção) contra o mesmo mês do ano anterior; série de 12 meses; saldo por fundo; orçamento x realizado por categoria de despesa; número de dizimistas ativos no mês e no trimestre; novos dizimistas; dizimistas sem lançamento há 3 meses ou mais (o "alerta de mudança de padrão" do Rock), este último **visível só ao pastor/tesoureiro**; lotes abertos ou com divergência.

### Gaps
- Não encontrei documentação primária de relatórios de retenção ou de primeiros doadores no PCO, no Breeze e na Tithe.ly. A página de dashboard do PCO não foi lida na íntegra.
