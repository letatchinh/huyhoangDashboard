import { Divider, Statistic, Table, Typography } from 'antd';
import { get, omit } from 'lodash';
import React from 'react';
import { TARGET_VI, TYPE_DISCOUNT_VI, TYPE_VALUE } from '~/modules/cumulativeDiscount/constants';
import { formatter } from '~/utils/helpers';
import StepStatus from '../../bill/components/StepStatus';
import { STATUS_BILLITEM, STATUS_BILLITEM_VI } from '../constants';
type propsType = {
    historyStatus : any,
    status : any,
    cumulativeDiscount : any,
}
const CLONE_TARGET_VI :any = TARGET_VI; 
const CLONE_TYPE_DISCOUNT_VI :any = TYPE_DISCOUNT_VI; 
export default function ExpandRowBillItem({historyStatus,status,cumulativeDiscount}:propsType) : React.JSX.Element {
  
    return (
        <div>
            <StepStatus
              size="small"
              statuses={
                status !== STATUS_BILLITEM.CANCELLED
                  ? omit(STATUS_BILLITEM, ["CANCELLED"])
                  : omit(STATUS_BILLITEM, [
                    STATUS_BILLITEM.ORDERED,
                    STATUS_BILLITEM.PACKAGED,
                    STATUS_BILLITEM.RECEIVED,
                    STATUS_BILLITEM.SHIPPING,
                      STATUS_BILLITEM.COMPLETED,
                      STATUS_BILLITEM.PROCESSING,
                    ])
              }
              statusesVi={STATUS_BILLITEM_VI}
              currentStatus={status}
              historyStatus={historyStatus}
            />
            <Divider />
            <h5>Chiết khấu</h5>
            <Table 
            dataSource={cumulativeDiscount}
            columns={[
              {
                title : 'Tên chiết khấu',
                dataIndex : 'name',
                key : 'name',
              },
              {
                title : 'Loại chiết khấu',
                dataIndex : 'typeDiscount',
                key : 'typeDiscount',
                render(typeDiscount) {
                  return  <span>{CLONE_TYPE_DISCOUNT_VI[typeDiscount]}</span>
                }
              },
              {
                title : 'Chiết khấu của',
                dataIndex : 'target',
                key : 'target',
                render(target) {
                  return  <span>{CLONE_TARGET_VI[target]}</span>
                }
              },
              {
                title : 'Giá trị chiết khấu',
                dataIndex : 'value',
                key : 'value',
                align : 'center',
                render(value,record) {
                  return  <span>{formatter(value)}{get(record,'valueType') === TYPE_VALUE.PERCENT ? '%' : ''}</span>
                }
              },
              {
                title : 'Tổng giá trị chiết khấu',
                dataIndex : 'discountAmount',
                key : 'discountAmount',
                align : 'center',
                render (discountAmount) {
                  return <Typography.Text strong>{formatter(discountAmount)}</Typography.Text>
                }
              },
            ]}
            />
        </div>
    )
}