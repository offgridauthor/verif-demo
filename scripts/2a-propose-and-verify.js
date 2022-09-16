const { defender } = require('hardhat');

// deploy v2 implementation and propose upgrade, submitting bytecode for verification
const owner = process.env.OWNER // '0x88BECCF8F957649c7701b670BFAA7318967f7412'
const address= process.env.ADDRESS // '0x65d6ed59533e5D89D15d4663cA6b209Bf2E8436a'
const url = process.env.WORKFLOW_URL // 'https://raw.githubusercontent.com/offgridauthor/verification-contracts/main/artifacts/build-info/b42f250d48743104c16e746045c66dea.json'


async function main() {
  const proposal = await defender.proposeUpgrade(address, 'VotingTokenV2',{ 
    bytecodeVerificationReferenceUrl: url,
    kind: 'uups',
    description: `Upgrading to new version deployed at ${url}`,
    multisig: owner,
    multisigType: 'EOA', 
  });
// multisig options: 'Gnosis Safe' | 'Gnosis Multisig' | 'EOA';
// Gnosis Safe is the latest offering. it is what's created if you use Defender to create your multisig. 
// Gnosis multisig - a legacy offering of gnosis prior to the Safe
// EOA - eg metamask, a single signer account

  const verification = proposal.verificationResponse;
  console.log(`Created new upgrade proposal at ${proposal.url} for artifact with digest ${verification?.providedSha256 ?? 'unknown'} (match ${verification.matchType})`);
}

main().catch(console.error);
