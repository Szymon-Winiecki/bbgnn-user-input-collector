import styles from './layout.module.css';

import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="container">
      <Head>
        <title>Input Data Collector</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="d-flex justify-content-center">
        <Link href="/" className='text-decoration-none text-primary'><h1>User Input Collector</h1></Link>
      </header>

      <main>{children}</main>

      <footer className={styles.footer}>
        <div className="w-100 d-flex justify-content-center p-2">
          <span>Szymon Winiecki 2023</span>
        </div>
        
      </footer>
    </div>
  );
}