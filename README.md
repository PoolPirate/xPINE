# Role-based DAO
Role-based, lightweight, blockchain organization blueprint which can be used by corporations, nonprofits, and open-source projects for governance and/or profit distribution.

## Folder strucure
#### `docker`
Files regarding building & running the application

#### `contracts` 
Smarts contracts. 
For reference: Contract structure diagram <br>
<img src='https://images-ext-2.discordapp.net/external/DoMnmxQTrv2I40b29a8MGNQ3ebcoGLk-AoZHpX7rYkA/https/i.imgur.com/TvWRRKp.png?width=573&height=702' width = 350>

#### `test`
Solidity smart contract unit tests

#### `src` 
Angular front end

#### `src/app/core/services`
Most of the logic about connecting to the blockchain, backend as well as caching data and wallet interactions

#### `app/src/contracts` (Created during build process)
Typechain bindings for the solidity contracts. Created with <a href="https://github.com/dethcrypto/TypeChain">Typechain</a>

## Building && Running
### Build Docker Container

- Make sure you have docker & docker compose installed and the docker daemon is running.
- Navigate to the `docker/build` directory
- `docker build . -t rolebaseddao:latest --build-arg github_username=**yourGithubUsername** --build-arg github_token=**yourGithubAccessToken**`

- This will build the image and tag it with `rolebaseddao:latest`
### Run the image
You could run it manually with `docker run` but the repository contains a `docker-compose.yml` file. 
- Navigate to the `docker` directory
- Run `docker-compose up`
    - You can add volumes / change application ports in the `docker-compose.yml` file

This image will run a local ganache instance. To get the private keys generated by that instance check `docker-compose logs`. Those private keys can then be imported into Metamask to get 1000 ETH on the local testnet.