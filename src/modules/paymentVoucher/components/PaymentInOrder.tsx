import { Button, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import StatusTag from '~/modules/vouchers/components/StatusTag';
import PaymentVoucherForm from './PaymentVoucherForm';
import { useVoucherInOrderStore } from '~/modules/vouchers/components/VoucherInOrder';
import { useGetPaymentVoucherByBillId, usePagingByBillId, usePaymentVoucherByBillIdQueryParams } from '../paymentVoucher.hook';
import { formatNumberThreeComma } from '~/utils/helpers';
type propsType = {

};
export default function PaymentInOrder(props: propsType): React.JSX.Element {
  const { billId } = useVoucherInOrderStore();
  const [query, onTableChange] = usePaymentVoucherByBillIdQueryParams(billId);
  const [data, isLoading] = useGetPaymentVoucherByBillId(query);
  const [refCollection, setRefCollection] = useState<string | undefined>();
  const [id, setId] = useState<string | null>();
  const [voucher, setVoucher] = useState<any>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const paging = usePagingByBillId();

  const onOpenForm = (item: any) => {
    setId(item?._id);
    setRefCollection(item?.refCollection?.toUpperCase());
    setIsOpenForm(true);
    setVoucher(item)
  };
  const onClose = () => {
    setId(null);
    setIsOpenForm(false);
    setVoucher(null);
  };

  const columns: ColumnsType = [
    {
      title: 'Mã phiếu thu',
      dataIndex: 'codeSequence',
      key: 'codeSequence',
      render: (text, record: any, index) => {
        return (
          <Button type='link' onClick={() => {
            onOpenForm(record);
          }}>
            {text}
          </Button>
        );
      },
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'issueNumber',
      key: 'issueNumber',
      render: text => text || "-",
    },
    {
      title: 'Nội dung',
      key: 'reason',
      dataIndex: 'reason',
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text, record, index) => text?.toLocaleString(),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record, index) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'dateApproved',
      key: 'dateApproved',
      render: (text, record, index) => text && dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => <StatusTag status={text}/>
    },
  ];

  return (
    <>
      <Table
        columns={columns as any}
        dataSource={data?.docs || []}
        loading={isLoading}
        size='small'
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng: ${total}`
        }}
        onChange={({ current, pageSize }: any) => onTableChange({ current, pageSize })}
        footer={() => <span>Tổng đã chi: {formatNumberThreeComma(data?.totalPrices) || 0}đ</span>}
      />
      <Modal
        footer={null}
        title={`Phiếu chi - ${voucher?.code}`}
        open={isOpenForm}
        onCancel={onClose}
        width={1366}
        destroyOnClose
      >
        <PaymentVoucherForm
          id={id}
          onClose={onClose}
          refCollection={refCollection}
        />
      </Modal>
    </>
  )
};