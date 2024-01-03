import Head from 'next/head';

export default function HiddenLayout({ title, children }) {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>

    </div>
  );
}