import dashboard from '../vi/dashboard.json';
import productGroup from '../vi/productGroup.json';
import manufacturer from '../vi/manufacturer.json';
import supplier from '../vi/supplier.json';
import rankingManufacturer from '../vi/rankingManufacturer.json';
import unit from '../vi/unit.json';
import medicine from '../vi/medicine.json';
import workBoard from '../vi/workBoard.json';
const vi = {
    ...dashboard,
    ...supplier,
    ...productGroup,
    ...manufacturer,
    ...rankingManufacturer,
    ...unit,
    ...medicine,
    ...workBoard,
}
export default vi;
