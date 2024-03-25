import pharmacyApi from "./pharmacy.api";
import PharmacyScreen from "./screens/Pharmacy";
import reducer from "./redux/reducer";
import saga from "./redux/saga";
import * as pharmacyHook from "./pharmacy.hook";
import * as pharmacyService from "./pharmacy.service";
import * as pharmacyModals from "./pharmacy.modal";
import pharmacyAuth from "./pharmacy.auth";
import PharmacyDetailScreen from "./screens/PharmacyDetail";

const moduleExport = {
  api: pharmacyApi,
  page: {
    index: PharmacyScreen,
    pharmacyDetail: PharmacyDetailScreen,
  },
  redux: {
    reducer,
    saga,
  },
  hook: pharmacyHook,
  service: pharmacyService,
  modal: pharmacyModals,
  auth: pharmacyAuth,
};
export default moduleExport;