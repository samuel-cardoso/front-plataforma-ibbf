import { getTranslations } from "@/hooks/i18n";

export default async function PoliticaDePrivacidadePage() {
  const t = await getTranslations("privacidade");
  const dadosColetadosItens = t.raw("dadosColetadosItens") as string[];
  const direitosItens = t.raw("direitosItens") as string[];

  return (
    <article className="flex flex-col gap-6 text-sm leading-relaxed text-foreground">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold">{t("titulo")}</h1>
        <p className="text-muted-foreground">{t("ultimaAtualizacao")}</p>
      </header>

      <p>{t("intro")}</p>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("dadosColetadosTitulo")}</h2>
        <p>{t("dadosColetadosIntro")}</p>
        <ul className="ml-5 list-disc [&>li]:mt-1">
          {dadosColetadosItens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("dadoSensivelTitulo")}</h2>
        <p>{t("dadoSensivelTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("finalidadeTitulo")}</h2>
        <p>{t("finalidadeTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("compartilhamentoTitulo")}</h2>
        <p>{t("compartilhamentoTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("armazenamentoTitulo")}</h2>
        <p>{t("armazenamentoTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("direitosTitulo")}</h2>
        <p>{t("direitosIntro")}</p>
        <ul className="ml-5 list-disc [&>li]:mt-1">
          {direitosItens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("retencaoTitulo")}</h2>
        <p>{t("retencaoTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("contatoTitulo")}</h2>
        <p>{t("contatoTexto")}</p>
      </section>
    </article>
  );
}
