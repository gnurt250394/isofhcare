import {
  StackRouter,
  createStackNavigator,
  StackNavigator,
} from 'react-navigation';
import {Platform} from 'react-native';
import EhealthScreen from '@containers/ehealth/EhealthScreen';
import ListProfileScreen from '@containers/ehealth/ListProfileScreen';
import ViewInMonthScreen from '@containers/ehealth/ViewInMonthScreen';
import ViewInDayScreen from '@containers/ehealth/ViewInDayScreen';
import ViewEhealthDetailScreen from '@containers/ehealth/ViewEhealthDetailScreen';
import ViewCheckupResultScreen from '@containers/ehealth/ViewCheckupResultScreen';
import ViewDiagnosticResultScreen from '@containers/ehealth/ViewDiagnosticResultScreen';
import ViewMedicalTestResultScreen from '@containers/ehealth/ViewMedicalTestResultScreen';
import ViewMedicineScreen from '@containers/ehealth/ViewMedicineScreen';
import ViewMoneyScreen from '@containers/ehealth/ViewMoneyScreen';
import ViewSurgeryResultScreen from '@containers/ehealth/ViewSurgeryResultScreen';
import SearchProfileScreen from '@containers/ehealth/SearchProfileScreen';
import HistoryEhealthScreen from '@containers/ehealth/HistoryEhealthScreen';
import HistorySharingScreen from '@containers/ehealth/HistorySharingScreen';
import EhealthSharingScreen from '@containers/ehealth/EhealthSharingScreen';
import {
  fromLeft,
  zoomIn,
  zoomOut,
  fromRight,
} from 'react-navigation-transitions';
import AddNewEhealthScreen from '@containers/ehealth/AddNewEhealthScreen';
import CreateEhealthScreen from '@containers/ehealth/uploadEhealth/CreateEhealthScreen';
import DetailsEhealthScreen from '@containers/ehealth/uploadEhealth/DetailsEhealthScreen';
import ListEhealthScreen from './ListEhealthScreen';

const handleCustomTransition = ({scenes}) => {
  return fromRight();
};
const EHealthNavigator = createStackNavigator(
  {
    listEhealth: {screen: ListEhealthScreen},
    ehealth: {screen: EhealthScreen},
    listProfile: {screen: ListProfileScreen},
    historyEhealth: {screen: HistoryEhealthScreen},
    historySharing: {screen: HistorySharingScreen},
    ehealthSharing: {screen: EhealthSharingScreen},
    viewInMonth: {screen: ViewInMonthScreen},
    viewInDay: {screen: ViewInDayScreen},
    viewCheckupResult: {screen: ViewCheckupResultScreen},
    viewDiagnosticResult: {screen: ViewDiagnosticResultScreen},
    viewMedicalTestResult: {screen: ViewMedicalTestResultScreen},
    viewMedicine: {screen: ViewMedicineScreen},
    viewMoney: {screen: ViewMoneyScreen},
    viewSurgeryResult: {screen: ViewSurgeryResultScreen},
    searchProfile: {screen: SearchProfileScreen},
    addNewEhealth: {screen: AddNewEhealthScreen},
    createEhealth: {screen: CreateEhealthScreen},
    detailsEhealth: {screen: DetailsEhealthScreen},
  },
  {
    headerMode: 'none',
    header: null,
    gesturesEnabled: false,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
    // mode: Platform.OS == 'ios' ? 'modal' : 'card'
    transitionConfig: nav => handleCustomTransition(nav),
  },
);

export {EHealthNavigator};
