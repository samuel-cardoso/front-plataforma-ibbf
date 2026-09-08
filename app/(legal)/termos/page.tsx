import { getTranslations } from "@/hooks/i18n";

export default async function TermosDeUsoPage() {
  const t = await getTranslations("termos");

  return (
    <article className="flex flex-col gap-6 text-sm leading-relaxed text-foreground">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold">{t("titulo")}</h1>
        <p className="text-muted-foreground">{t("ultimaAtualizacao")}</p>
      </header>

      <p>{t("intro")}</p>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("objetoTitulo")}</h2>
        <p>{t("objetoTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("cadastroTitulo")}</h2>
        <p>{t("cadastroTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("usoTitulo")}</h2>
        <p>{t("usoTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("niveisTitulo")}</h2>
        <p>{t("niveisTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("disponibilidadeTitulo")}</h2>
        <p>{t("disponibilidadeTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("alteracoesTitulo")}</h2>
        <p>{t("alteracoesTexto")}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">{t("contatoTitulo")}</h2>
        <p>{t("contatoTexto")}</p>
      </section>
    </article>
  );
}
