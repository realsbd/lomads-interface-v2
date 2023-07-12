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

## Projects and Tasks

Users can create Projects and Tasks using Lomads platform. There are two folders that contain the code for Projects

|/src/pages/Projects|/src/Modals/Projects|
|:-:|:-:|
|The contains the code for full page views for the project component|This contains the code for side modals, popovers, etc that are used within the project|
|![First Image](images/Screenshot%202023-07-11%20at%2015.53.39.png?h=750&w=1260)|![Second Image](images/Screenshot%202023-07-11%20at%2015.53.00.png?h=750&w=1260)|




The main components of the project are:

**Create Project**
_/src/pages/Projects/CreateProject/index.tsx_

The main function is _handleCreateProject_ which gathers all the info required for the project creation and dispatches it to the backend using _createProjectAction_

        const handleCreateProject = () => {
        let project: any = {};
        project['name'] = name;
        project['description'] = desc;
        project['links'] = resourceList;
        project['milestones'] = milestones;
        project['compensation'] = compensation;
        project['kra'] = {
        frequency,
        results
        };
        project['daoId'] = DAO?._id;
        ...
        ...
        ...
        
        dispatch(createProjectAction(project));


**Edit project**

The file _/src/modals/Projects/ProjectEditModal/index.tsx_ is used to open the Edit Modal. This is used to edit different aspects of the Project. 

For each there is a separate modal that opens, for example for Milestone  _/src/modals/Projects/MilestonesModal/index.tsx_ file is used to open a new modal to edit. 

This file has the function _handleSubmit_ for editing.

        const handleSubmit = () => {
                let flag = 0;
                let total = 0;
                if (currency === '') {
                    setErrorCurrency(true);
                    let e = document.getElementById('currency-amt');
        ...
        ...
        ...
        if (editMilestones) {
                        dispatch(editProjectMilestonesAction({ projectId: _get(Project, '_id', ''), daoUrl: _get(DAO, 'url', ''), payload: { milestones, compensation: { currency, amount, symbol, safeAddress } } }));
        }


Same named function exists in other modals for editing


**KRA and Milestones**
    
To review KRA and submit src/modals/Project/KraReviewModal/index.tsx file is used. 
    
handleSubmit function is used to update the KRA values

        const handleSubmit = () => {
                const kra = { ...Project.kra };
                kra.tracker = getSlots.map(slot => {
                    // @ts-ignore
                    if (slot.start === currentSlot.start && slot.end === currentSlot.end)
                        return currentSlot
                    return slot
                })
                dispatch(updateProjectKraAction({ projectId: _get(Project, '_id', ''), daoUrl: _get(DAO, 'url', ''), payload: { kra } }))
            }


Similarly to approve a Milestone src/modals/Project/MilestoneDetailModal/index.tsx file is used. This opens the file src/modals/Project/AssignContributionModal/index.tsx where handleCreateTransaction function is used to create a Milestone Completion transaction

        const handleCreateTransaction = async () => {
                setNetworkError(null)
                if(Project.isDummy) {
                    const newArray1 = _get(Project, 'milestones', []).map((item: any, i: number) => {
                        if (i === _get(selectedMilestone, 'pos', '')) {
                            return { ...item, complete: true };
                        } else {
                            return item;
        ....
        ....
        ....
        }



## Gnosis Safe and Transactions

For all the transactions Gnosis Safe sdk is used. 

**Create a Safe**

The code for the same can be found here: _src/pages/AttachSafe/New/index.tsx_

SafeFactory is used within the deployNewSafe function to deploy a new safe

import { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";

        const deployNewSafe = async () => {
        		if (!chainId) return;
        		if (+state?.selectedChainId !== +chainId) {
             ...
             ...
             ...
             ...
             ...
             ...
             const safeFactory = await SafeFactory.create({ ethAdapter });
             ...
             ...
             ...
             await safeFactory
        					.deploySafe({ safeAccountConfig })
             ...
             ...
             ...



**Transactions**

The transactions are managed in the app using the following hooks. Following types of transactions can be created on Lomads app:

- Direct Token Transfer (Single or Multi Transaction)
- Task Compensation (Single or Multi Transaction)
- Milestone Compensation (Single or Multi Transaction)
- Recurring Payment

_src/hooks/useGnosisSafeTransaction.ts_ hook is used for the following type of transactions:

- Direct Token Transfer (Single or Multi Transaction)
- Task Compensation (Single or Multi Transaction)
- Milestone Compensation (Single or Multi Transaction)
- Change Safe Settings

The main functions in this file are as listed below. Details of these functions can be seen in the code. The hook is used throughout the app to interact with Gnosis Safe

        const createSafeTransaction = async ({
                safeAddress,
                chainId,
                tokenAddress,
                send,
                offChainTxHash = undefined,
                reject = false
            }: CreateSafeTransaction)
        
        const confirmTransaction = async ({ safeAddress, safeTxnHash, chainId  } : ConfirmTransaction)
        
        const rejectTransaction = async ({ safeAddress, chainId, _nonce, sign} : RejectTransaction)
        
        const executeTransaction = async ({ safeAddress, chainId, safeTxnHash }: ExecuteTransaction)
        
        const updateOwnersWithThreshold = async ({ safeAddress, chainId, newOwners = [], removeOwners = [], threshold, thresholdChanged = false, ownerCount = 0 }: any)

_src/hooks/useGnosisAllowance.ts_ hook is used to create recurring payments. Gnosis Safe Allowance module is used for this.

The following functions are used to use the allowance module and set the allowance for a particular user

        const useGnosisAllowance = (safeAddress: string | null, chainId: number | null)
        const setAllowance = async ({ allowance, label, delegate, actualAmount, stop= false }: any) 

Once the allowance is approved the following function is used to create a transaction using the allowance

        const createAllowanceTransaction = async ({ tokenAddress, amount, to, label, delegate}: { tokenAddress: string, amount: number, to: string, label: string, delegate: string} )
