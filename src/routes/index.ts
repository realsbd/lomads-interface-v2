// eslint-disable-next-line no-unused-vars
import LandingLayout from 'layouts/LandingLayout';
import DashboardLayout from 'layouts/DashboardLayout';
import SettingsLayout from 'layouts/SettingsLayout';
import PrimaryLayout from 'layouts/PrimaryLayout';
import DefaultLayout from 'layouts/DefaultLayout';

import LoginPage from 'pages/Login';
import DashboardPage from 'pages/Dashboard';
import CreateProjectPage from 'pages/Project/CreateProject';
import ProjectDetailsPage from 'pages/Project/ProjectDetails';
import TaskDetailsPage from 'pages/Task/TaskDetails';
import AllTasksPage from 'pages/Task/AllTasks';
import AllProjectsPage from 'pages/Project/AllProjects';
import SettingsPage from 'pages/Settings';
import AttachNewSafePage from 'pages/AttachSafe/New';
import AttachExistingSafePage from 'pages/AttachSafe/Existing';
import CreateOrganisation from 'pages/CreateOrganisation';
import CreatePassTokenPage from 'pages/CreatePassToken'
import DCAuthPage from 'pages/DCAuth';
import GithubAuthPage from 'pages/GithubAuth';
import MintPage from 'pages/Mint';
import MintPageV1 from 'pages/Mint/index.v1';
import OnlyWhitelistedPage from 'pages/OnlyWhitelisted';
import NoAccessPage from 'pages/NoAccess'
import WelcomePage from 'pages/Welcome';
import DefaultFullWidthLayout from 'layouts/DefaultFullWidthLayout';
import DashboardNoHeaderLayout from 'layouts/DashboardNoHeaderLayout';

export default [
	{
		path: '/login',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: LoginPage
	},
	{
		path: '/organisation/create',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: CreateOrganisation
	},
	{
		path: "/dcauth",
		exact: true,
		layout: PrimaryLayout,
		private: false,
		component: DCAuthPage
	},
	{
		path: "/githubauth",
		exact: true,
		layout: PrimaryLayout,
		private: false,
		component: GithubAuthPage
	},
	{
		path: '/:daoURL/welcome',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: WelcomePage
	},
	{
		path: '/:daoURL/attach-safe/new',
		exact: true,
		layout: DashboardNoHeaderLayout,
		private: true,
		component: AttachNewSafePage
	},
	{
		path: '/:daoURL/only-whitelisted',
		exact: true,
		layout: DefaultLayout,
		private: false,
		component: OnlyWhitelistedPage
	},
	{
		path: '/:daoURL/no-access',
		exact: true,
		layout: DefaultLayout,
		private: false,
		component: NoAccessPage
	},
	{
		path: '/:daoURL/attach-safe/existing',
		exact: true,
		layout: DashboardNoHeaderLayout,
		private: true,
		component: AttachExistingSafePage
	},
	{
		path: '/:daoURL/project',
		exact: true,
		layout: DefaultLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL/settings',
		exact: true,
		layout: SettingsLayout,
		private: true,
		component: SettingsPage
	},
	{
		path: '/:daoURL/create-pass-token',
		exact: true,
		layout: PrimaryLayout,
		private: true,
		component: CreatePassTokenPage
	},
	{
		path: '/:daoURL/mint/:contractId',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: MintPage
	},
	{
		path: '/:daoURL/mint/v1/:contractId',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: MintPageV1
	},
	{
		path: '/',
		exact: true,
		layout: DashboardLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL',
		exact: true,
		layout: DashboardLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL/project/create',
		exact: true,
		layout: DefaultLayout,
		private: true,
		component: CreateProjectPage
	},
	{
		path: '/:daoURL/project/:projectId',
		exact: true,
		layout: DefaultLayout,
		private: true,
		component: ProjectDetailsPage
	},
	{
		path: '/:daoURL/tasks',
		exact: true,
		layout: DefaultFullWidthLayout,
		private: true,
		component: AllTasksPage
	},
	{
		path: '/:daoURL/projects',
		exact: true,
		layout: DefaultFullWidthLayout,
		private: true,
		component: AllProjectsPage
	},
	{
		path: '/:daoURL/task/:taskId',
		exact: true,
		layout: DefaultLayout,
		private: true,
		component: TaskDetailsPage
	},
];
