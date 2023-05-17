// eslint-disable-next-line no-unused-vars
import LandingLayout from 'layouts/LandingLayout';
import LoginPage from 'pages/Login';
import DashboardPage from 'pages/Dashboard';

export default [
	{
		path: '/login',
		exact: true,
		layout: LandingLayout,
		private: false,
		component: LoginPage
	},
	{
		path: '/:daoURL/project',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: DashboardPage
	},
	{
		path: '/:daoURL',
		exact: true,
		layout: LandingLayout,
		private: true,
		component: DashboardPage
	},
];
