import { Layout } from 'react-admin';
import { MySidebar } from './navigation/sideBar';
import { Header as Navbar } from './navigation/header';

export const MyLayout = (props: any) => <Layout appBarAlwaysOn appBar={Navbar} {...props} sidebar={MySidebar} />
