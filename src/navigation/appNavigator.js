import {SwitchNavigator, StackNavigator} from 'react-navigation';
import Loading from '../components/Loading';
import Login from '../components/Login';
import Documents from '../components/documents';
import Home from '../components/Home';
import ImpData from '../components/ImpData';
import DocumentViewPdf from '../components/documentViewPdf';

const HomeNavigator = StackNavigator({
    Home,
    ImpData,
    Documents,
    DocumentViewPdf
    },
    {
        initialRouteName:'Home'
    });
  
export default AppNavigator = SwitchNavigator({
    Loading,
    Login,
    Home:{
        screen:HomeNavigator
    }
    },
    {
        initialRouteName:'Loading'
    });