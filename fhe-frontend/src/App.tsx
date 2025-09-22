import { useState } from "react";
import { vote, getTallies } from "./fheVote";

export default function App() {
  const [status, setStatus] = useState<string>("Ready");
  const [tallies, setTallies] = useState<{yesEnc?: string; noEnc?: string}>({});

  const doVote = async (c: 0|1) => {
    try {
      setStatus("Encrypting & sending tx...");
      await vote(c);
      setStatus("Tx mined. Fetching tallies...");
      const t = await getTallies();
      setTallies(t);
      setStatus("Done ✅");
    } catch (e: any) {
      setStatus("Error: " + (e?.message ?? String(e)));
    }
  };

  return (
    <div style={{maxWidth: 640, margin: "40px auto", fontFamily: "Inter, system-ui"}}>
      <h2>FHEFashionPoll – Sepolia</h2>
      <p>Status: {status}</p>
      <div style={{display: "flex", gap: 12}}>
        <button onClick={() => doVote(1)}>Vote YES</button>
        <button onClick={() => doVote(0)}>Vote NO</button>
      </div>
      <pre style={{marginTop: 16, padding: 12, background: "#111", color:"#0f0", borderRadius:8}}>
{JSON.stringify(tallies, null, 2)}
      </pre>
      <small>Encrypted tallies (euint64) – decryption akışı opsiyoneldir.</small>
    </div>
  );
}
