// pages/index.js
import Head from 'next/head';
import CoinflipGame from './components/CoinflipGame';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Coinflip Game</title>
        <meta name="description" content="Coinflip game on the blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CoinflipGame />
    </div>
  );
}
