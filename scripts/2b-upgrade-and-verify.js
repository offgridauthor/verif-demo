const { defender, upgrades } = require('hardhat');
const {AdminClient} = require('defender-admin-client');
const {appendFileSync, readFileSync} = require('fs');
require('dotenv').config();

// deploy a V2 upgrade implementation contract 
// Verify bytecode for the new implementation 
// Create an upgrade proposal via defender-admin 

//voting token proxy address
const ADDRESS=process.env.VotingToken;
const V2_CONTRACT_BUILD=`https://raw.githubusercontent.com/offgridauthor/verification-contracts/main/artifacts/build-info/b42f250d48743104c16e746045c66dea.json`;
const contractABI = JSON.stringify(JSON.parse(readFileSync(`artifacts/contracts/VotingTokenV2.sol/VotingTokenV2.json`, 'utf8')).abi);
const NETWORK = 'rinkeby';

async function main() {
  const VotingTokenV2 = await ethers.getContractFactory("VotingTokenV2");

  console.log('Deploying v2 upgrade...')
  const upgrade = await upgrades.prepareUpgrade(ADDRESS, VotingTokenV2);
  console.log("Upgrade deployed to:", upgrade);
  appendFileSync('.env', `\nV2_IMPLEMENTATION=${upgrade}`);

  // verify upgrade
  const verification = await defender.verifyDeployment(upgrade, "VotingTokenV2", V2_CONTRACT_BUILD);
  console.log(`Verified artifact with hash`, verification.providedSha256);

  // admin upgrade proposal
  const adminClient = new AdminClient({apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET});
  const newImplementation = process.env.V2_IMPLEMENTATION;
  const contract = { network: NETWORK, address: ADDRESS };
  const proposal = await adminClient.proposeUpgrade({ newImplementation }, contract);
  console.log('Upgrade proposal created at ', proposal.url);
}

main().catch(console.error);
