import Script from "next/script";

/**
 * Estatísticas da Vercel (Web Analytics + Speed Insights), carregadas pelos
 * scripts oficiais servidos no próprio domínio (/_vercel/...). Sem cookies e
 * sem identificador persistente. Antes de cada envio:
 *  - a parte do endereço depois de "?" e "#" é descartada (links de
 *    resultado levam dados como ?p=60 — a estatística vê só a página);
 *  - quem liga "Do Not Track" ou "Global Privacy Control" não é contado.
 * Só é renderizado em produção na Vercel (ver layout).
 */
const INIT = `(function(){
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  window.si = window.si || function(){ (window.siq = window.siq || []).push(arguments); };
  var optOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1" || window.doNotTrack === "1";
  function clean(e){
    if (optOut) return null;
    try { var u = new URL(e.url); u.search = ""; u.hash = ""; e.url = u.toString(); } catch (_) {}
    return e;
  }
  window.va("beforeSend", clean);
  window.si("beforeSend", clean);
})();`;

export function VercelInsights() {
  return (
    <>
      <Script id="vercel-insights-init" strategy="afterInteractive">
        {INIT}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      <Script src="/_vercel/speed-insights/script.js" strategy="afterInteractive" />
    </>
  );
}
