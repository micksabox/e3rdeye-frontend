import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css'

const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY  }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Eth3rdEye',
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
});

function MyApp({ Component, pageProps }) {
  return <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
}

export default MyApp
