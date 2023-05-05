// eslint-disable-next-line no-unused-vars
import LandingLayout from 'layouts/LandingLayout';
import LoginPage from 'pages/Login';
import DashboardPage from 'pages/Dashboard';
import CreateProjectPage from 'pages/Project/CreateProject';

export default [
	{
		path: '/login',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: LoginPage
	},
	{
		path: '/',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL/createProject',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: CreateProjectPage
	},
];
