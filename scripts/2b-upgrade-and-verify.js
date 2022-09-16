const { defender, upgrades } = require('hardhat');
const {AdminClient} = require('defender-admin-client');
const {appendFileSync, readFileSync} = require('fs');
require('dotenv').config();

// deploy an upgrade implementation contract 
// Verify bytecode for the new implementation 
// Create an upgrade proposal via defender-admin 

//voting token proxy address
const address=process.env.ADDRESS;
const CONTRACT_BUILD=``;
const contractABI = JSON.stringify(JSON.parse(readFileSync(`artifacts/contracts/VotingToken.sol/VotingToken.json`, 'utf8')).abi);
const NETWORK = 'goerli';

async function main() {
  const VotingToken = await ethers.getContractFactory("VotingToken");

  console.log('Deploying upgrade...')
  const upgrade = await upgrades.prepareUpgrade(ADDRESS, VotingToken);
  console.log("Upgrade deployed to:", upgrade);
  appendFileSync('.env', `\nUPGRADE_IMPLEMENTATION=${upgrade}`);

  // verify upgrade
  const verification = await defender.verifyDeployment(upgrade, "VotingToken", CONTRACT_BUILD);
  console.log(`Verified artifact with hash`, verification.providedSha256);

  // admin upgrade proposal
  const adminClient = new AdminClient({apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET});
  const newImplementation = process.env.V2_IMPLEMENTATION;
  const contract = { network: NETWORK, address: ADDRESS };
  const proposal = await adminClient.proposeUpgrade({ newImplementation }, contract);
  console.log('Upgrade proposal created at ', proposal.url);
}

main().catch(console.error);
