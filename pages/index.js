import Link from 'next/link';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <div>
        <Link href="/collect">collect data</Link>
      </div>
      <div>
        <Link href="/browse">browse data</Link>
      </div>
      <div>
        <Link href="/upload">upload data</Link>
      </div>
      <div>
        <Link href="/competition_index">competition</Link>
      </div>
    </Layout>
  );
}
