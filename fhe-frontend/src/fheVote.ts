import { ethers } from "ethers";
import { getInstance } from "@zama-ai/relayer-sdk"; // Relayer SDK
import abi from "./abi/FHEFashionPoll.json";

const CHAIN_ID = 11155111; // Sepolia
const CONTRACT = "0xEBa52A122AF08f9EdACd58051661528c3A249066";

export async function vote(choice: 0 | 1) {
  // 1) Cüzdan (Metamask)
  // @ts-ignore
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // 2) Relayer SDK instance (public key işlemlerini içerir)
  const sdk = await getInstance({ chainId: CHAIN_ID }); // doküman akışı
  // 3) Şifrele (uint8)
  // Not: SDK sürümüne göre encrypt fonksiyon adı encryptU8/add8+encrypt olabilir.
  const { external, attestation } = await sdk.encryptU8(choice);

  // 4) Sözleşme çağrısı
  const contract = new ethers.Contract(CONTRACT, (abi as any).abi ?? abi, signer);
  const tx = await contract.vote(external, attestation);
  await tx.wait();
}

export async function getTallies() {
  // @ts-ignore
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT, (abi as any).abi ?? abi, signer);
  const [yesEnc, noEnc] = await contract.getTallies();
  return { yesEnc, noEnc }; // şifreli euint64; ekranda “encrypted” göster
}
