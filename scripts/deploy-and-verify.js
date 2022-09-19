const { ethers , upgrades, defender} = require('hardhat');
const {AdminClient} = require('defender-admin-client');
const {appendFileSync, readFileSync} = require('fs');

const NETWORK = 'goerli';
const NAME = "VotingToken";
const REPO_URL = `https://raw.githubusercontent.com/offgridauthor/verif-demo/main/artifacts/build-info/7982d36063befc1a373b49d60bc13432.json`; 
const contractABI = JSON.stringify(JSON.parse(readFileSync(`artifacts/contracts/${NAME}.sol/${NAME}.json`, 'utf8')).abi);

async function main() {
  const adminClient = new AdminClient({apiKey: process.env.DEFENDER_API_KEY, apiSecret: process.env.DEFENDER_API_SECRET});

  // deploy contract
  const Contract = await ethers.getContractFactory(NAME);
  const contract = await upgrades.deployProxy(Contract, { kind: 'uups' }).then(f => f.deployed());
  console.log(`Deployed to: ${contract.address}\n`);

  // add deployed contract to admin
  const contractDetails = {
    network: NETWORK,
    address: contract.address,
    name: NAME,
    abi: contractABI,
  };
  const newAdminContract = await adminClient.addContract(contractDetails);
  appendFileSync('.env', `\nADDRESS=${contract.address}`);

  // verify compilation of deployed contract
  const verification = await defender.verifyDeploymentWithUploadedArtifact(contract.address, NAME, REPO_URL);
  console.log(`Verified artifact with hash`, verification.providedSha256);
  console.log('Verification result: ', verification.matchType);
  console.log('Compilation artifact: ', verification.artifactUri);
  console.log('Network: ', verification.contractNetwork);
  console.log('Contract address: ', verification.contractAddress);
  console.log('SHA256 of bytecode on chain: ', verification.onChainSha256);
  console.log('SHA256 of provided compilation artifact: ', verification.providedSha256);
  console.log('Compilation artifact provided by: ', verification.providedBy);
  console.log('Last verified: ', verification.lastVerifiedAt);
}

main().catch(console.error);
