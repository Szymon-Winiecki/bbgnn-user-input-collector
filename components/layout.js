import styles from './layout.module.css';

import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ page, children }) {
  return (
    <div className="container">
      <Head>
        <title>Input Data Collector</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="d-flex flex-column justify-content-center">
        <div className='d-flex justify-content-center'>
          <Link href="/" className='text-decoration-none text-primary'><h1>User Input Collector</h1></Link>
        </div>
        <nav className='mb-4'>
          <ul className="nav nav-pills">
            <li className="nav-item">
              <Link href="/collect" className={`nav-link text-decoration-none ${page == 'collect' && 'active'}`}>Collect</Link>
            </li>
            <li className="nav-item">
              <Link href="/browse" className={`nav-link text-decoration-none ${page == 'browse' && 'active'}`}>Browse</Link>
            </li>
            <li className="nav-item">
              <Link href="/upload" className={`nav-link text-decoration-none ${page == 'upload' && 'active'}`}>Upload</Link>
            </li>
          </ul>
        </nav>
        
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