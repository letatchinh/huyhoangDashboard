import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../warehouse.api'; 
import { warehouseActions } from './reducer';
import { billSliceAction } from '~/modules/sale/bill/redux/reducer';
import { STATUS_BILL } from '~/modules/sale/bill/constants';
import { omit } from 'lodash';

function* getListWarehouse({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(warehouseActions.getListSuccess(data));
    yield put(warehouseActions.clearAction());
  } catch (error:any) {
    yield put(warehouseActions.getListFailed(error));
  }
}

function* getByIdWarehouse({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(warehouseActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.getByIdFailed(error));
  }
};

function* getByIdWarehouseLinked({payload:id} : any) : any {
  try {
    const data = yield call(api.getAllWarehouse,id);
    yield put(warehouseActions.getWarehouseLinkedSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.getWarehouseLinkedFailed(error));
  }
};

function* createWarehouse({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(warehouseActions.createSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.createFailed(error));
  }
};

function* createBillToWarehouse({ payload }: any): any {
  try {
    const res = yield call(api.createBillToWarehouse,payload);
    yield put(warehouseActions.createBillToWarehouseSuccess(res));
    const data = {status: STATUS_BILL.REQUESTED, _id: payload?.billId}
    yield put(billSliceAction.updateRequest(data));
  } catch (error:any) {
    yield put(warehouseActions.createBillToWarehouseFailed(error));
  }
};

function* checkWarehouse({ payload }: any): any {
  try {
    const data = yield call(api.checkWarehouse, payload);
    if (!data?.status) {
      yield put(warehouseActions.checkWarehouseFailed(data));
      const newData = {status: 'UNREADY', _id: data?.billId, warehouseId: data?.warehouseId,warehouseBranchId: payload?.warehouseBranchId}
      yield put(billSliceAction.updateStatusAfterCheckWarehouseRequest(newData as any));
    } else {
      yield put(warehouseActions.checkWarehouseSuccess(data));
      yield put(billSliceAction.updateStatusAfterCheckWarehouseRequest({
        ...data,
        status: STATUS_BILL.READY,
        _id: data?.billId,
        warehouseId: data?.warehouseId,
        warehouseBranchId: payload?.warehouseBranchId
      }));
    };
  } catch (error:any) {
    yield put(warehouseActions.checkWarehouseFailed(error));
  }
};

function* updateWarehouse({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(warehouseActions.updateSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.updateFailed(error));
  }
};

function* updateManagementWarehouse({payload} : any) : any {
  try {
    const data = yield call(api.updateManagementWarehouse, payload);
    yield put(warehouseActions.updateManagementWarehouseSuccess(data));
    yield put(warehouseActions.getByIdRequest(data?.data?._id));
  } catch (error:any) {
    yield put(warehouseActions.updateManagementWarehouseFailed(error));
  }
};

function* deleteWarehouse({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(warehouseActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.deleteFailed(error));
  }
};

export default function* warehouseSaga() {
  yield takeLatest(warehouseActions.getListRequest, getListWarehouse);
  yield takeLatest(warehouseActions.getByIdRequest, getByIdWarehouse);
  yield takeLatest(warehouseActions.createRequest, createWarehouse);
  yield takeLatest(warehouseActions.updateRequest, updateWarehouse);
  yield takeLatest(warehouseActions.deleteRequest, deleteWarehouse);
  
  yield takeLatest(warehouseActions.createBillToWarehouseRequest, createBillToWarehouse);
  yield takeLatest(warehouseActions.updateManagementWarehouseRequest, updateManagementWarehouse);
  yield takeLatest(warehouseActions.getWarehouseLinkedRequest, getByIdWarehouseLinked);
  yield takeLatest(warehouseActions.checkWarehouseRequest, checkWarehouse);
};
