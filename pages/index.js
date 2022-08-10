import Head from "next/head";

import dynamic from "next/dynamic";
import { useIsMounted } from "../src/hooks/useIsMounted";

const DynamicApp = dynamic(() => import("../src/Eth3rdEye.tsx"), {
  suspense: true,
});

export default function Home() {
  // Used to prevent SSR mismatch errors
  const isMounted = useIsMounted();

  return (
    <div>
      <Head>
        <title>E3rdEye</title>
        <meta
          name="description"
          content="Credibility protocol for psychic abilities"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isMounted && <DynamicApp />}
    </div>
  );
}
