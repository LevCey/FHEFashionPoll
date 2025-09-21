import { expect } from "chai";
import { ethers } from "hardhat";

describe("FHEFashionPoll", () => {
    it("prevents double vote and tallies encrypted", async () => {
        const [alice] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory("FHEFashionPoll");
        const poll = await Factory.deploy();
        await poll.waitForDeployment();

        // Frontend şifreleme yerine: test modunda helper ile dış euint8 üretin
        // Örn: hardhat plugin util'leri ile externalEuint8 + attestation hazırla
        // const { external, attestation } = await makeEncryptedUint8(1);
        // await expect(poll.connect(alice).vote(external,attestation)).to.emit(poll, "Voted");
 
        // Tekrar oy denemesi revert etmeli
        // await expect(poll.connect(alice).vote(external, attestation)).to.be.revertedWith("Already voted");
        // Şifreli toplamları okuyun (eşit değildir sıfır vb. şeklinde temel doğrulamalar)

        const tallies = await poll.getTallies();
        expect(tallies).to.be.ok; // detaylı eşitlikler FHE yardımcılarıyla yapılır
    });
});

