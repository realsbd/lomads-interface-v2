# Clone and run the project

The project code can be cloned and run on localhost. To successfully run the code complete the following steps:

### Step 1
Create and complete the .env file

        REACT_APP_INFURA_KEY=
        REACT_APP_INFURA_SECRET=
        REACT_APP_NODE_BASE_URL=
        REACT_APP_URL=
        REACT_APP_S3_BASE_URL=
        REACT_APP_NATIVE_TOKEN_ADDRESS=
        REACT_APP_NOTION_ADMIN_EMAIL=
        REACT_APP_DISCORD_APP_ID=
        REACT_APP_GITHUB_CLIENT_ID=
        REACT_APP_NFT_STORAGE=
        REACT_APP_BICONOMY_AUTH_KEY=

### Step 2

        yarn install
        yarn start

This will run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits to the code.


# Code Structure
<img align="right" src="images/Screenshot%202023-07-11%20at%2015.19.03.png" alt="drawing" width="300" > 

The figure shows the folder structure of the code. We will detail out some of the main folders namely:


- Assets Folder
- Routes Folder
- Layouts Folder
- Components Folder
- Pages Folder
- Hooks Folder
- abis Folder
- Hooks folder





### Assets Folder
it contains assets of our project i.e. images and styling files.

### Routes Folder

This folder consists of all routes of the application. It consists of private, protected, and all types of routes. Here we can even call our sub-route.

### Layouts Folder

it contains layouts available to the whole project like header, footer, etc. The following layouts are present:


### Components Folder

This folder is where you store reusable UI components that can be used across multiple pages or other components.

### Pages Folder

This folder contains individual page components that represent different views or routes of the application.

### Hooks Folder

The folder has every hook in the application that are used across multiple pages.

### abis Folder

This folder contains all the abis of the smart contract that are used in the application. These are used to call various smart contract functions

### Utils Folder

This folder holds utility functions or helper modules that can be used throughout the application


# App Building Blocks

The main building blocks or functionalities of the Lomads app are : 

- Login
- Projects and Tasks
- Gnosis Safe and Transactions
- Soul Bound Token
- 3rd Party Tools Integration
- Token Gating

## Login
For login and authentication **Web3auth** has been integrated. We use their sdk to allow users to login into the app using Metamask or Social Login (Gmail and Apple). The code can be found in _/src/pages/Login/index.tsx_. 

Web3auth instance is used to retrieve the info about the provider, chain, account etc.

        const { provider, login, account, chainId, logout, web3Auth } = useWeb3Auth();

_handleLogin_ function handles the login. a token is generated at login and is sent to the backend as params for _createAccountAction_ along with userInfo. 

        const handleLogin = async (loginType = WALLET_ADAPTERS.METAMASK, provider: undefined | string = undefined) => {
                dispatch(logoutAction())
                await logout()
                let token = null;
                if (loginType === WALLET_ADAPTERS.METAMASK) {
                    token = await login(loginType);
                } else if (loginType === WALLET_ADAPTERS.OPENLOGIN) {
                    token = await login(WALLET_ADAPTERS.OPENLOGIN, provider);
                }
                if (token) {
                    let userInfo = null;
                    if(web3Auth?.connectedAdapterName === "openlogin")
                        userInfo = await web3Auth?.getUserInfo()
                    dispatch(createAccountAction({ token, userInfo }))
                }
            }
