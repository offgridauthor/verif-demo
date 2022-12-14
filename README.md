# Smart Contract Bytecode Verification

Example repo to demonstrate bytecode verification review feature for contract upgrade proposals in OpenZeppelin Defender.

## Scripts

- `yarn deploy` - Deploy token contract, add to Defender Admin and verify bytecode
- `yarn upgrade` - Deploy token contract V2, verify bytecode and create Admin proposal for signers to review

## Walkthrough

### Deploy Proxy and Verify

1. Write an upgradeable smart contract (or use wizard.openzeppelin.com to generate one) and save in /contracts
2. Compile with `yarn hardhat compile` to generate build artifacts and ABI
3. Remove `artifacts` folder from .gitignore
4. Add the new files, commit and push to remote repository (`git add . && git commit -m "add build artifacts" && git push origin main`)
5. Copy URL of build artifact (ie `https://raw.githubusercontent.com/offgridauthor/verification-contracts/main/artifacts/build-info/1ca3e45b97b92b131128688d9d9faf68.json`)
6. Add ABI and URL to remote build artifact to `deploy-and-verify.js` script
7. Run `yarn deploy`

### Automate Upgrade Proposal and Verification (using Github Actions)

1. Add environment variables to Github Secrets
2. Add ci.yml file to `/.github/workflows`, supplying proxy address and contract owner
3. Make changes to code and push to repo

## Reference

- [Bytecode Verification - Docs](https://docs.openzeppelin.com/defender/admin#bytecode-verification)
- [Hardhat Defender - NPM](https://www.npmjs.com/package/@openzeppelin/hardhat-defender)
- [Upgrades Repo](https://github.com/OpenZeppelin/openzeppelin-upgrades)
- [Hardhat Upgrades Plugin Documentation](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#defender-propose-upgrade)
- [Defender Admin Client - NPM](https://www.npmjs.com/package/defender-admin-client)
- [Example Verification](https://github.com/OpenZeppelin/defender-client/blob/master/examples/verify-contract/index.js)
