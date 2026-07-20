import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId || measurementId === "G-XXXXXXXXXX") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="beforeInteractive" />
      <Script id="google-analytics" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
