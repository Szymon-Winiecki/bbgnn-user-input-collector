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
    </Layout>
  );
}
