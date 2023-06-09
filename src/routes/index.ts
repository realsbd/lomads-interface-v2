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
import SettingsPage from 'pages/Settings';
import AttachNewSafePage from 'pages/AttachSafe/New';
import AttachExistingSafePage from 'pages/AttachSafe/Existing';
import CreateOrganisation from 'pages/CreateOrganisation';
import CreatePassTokenPage from 'pages/CreatePassToken'
import DCAuthPage from 'pages/DCAuth';
import MintPage from 'pages/Mint';
import OnlyWhitelistedPage from 'pages/OnlyWhitelisted';
import WelcomePage from 'pages/Welcome';

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
		path: '/:daoURL/welcome',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: WelcomePage
	},
	{
		path: '/:daoURL/attach-safe/new',
		exact: true,
		layout: LandingLayout,
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
		path: '/:daoURL/attach-safe/existing',
		exact: true,
		layout: LandingLayout,
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
		private: false,
		component: MintPage
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
		path: '/:daoURL/task/:taskId',
		exact: true,
		layout: DefaultLayout,
		private: true,
		component: TaskDetailsPage
	},
];
