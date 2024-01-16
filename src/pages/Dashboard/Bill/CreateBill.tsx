import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, ConfigProvider, Row, Tabs, TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import Bill from "~/modules/bill";
import SelectProduct from "~/modules/bill/components/SelectProduct";
import { CreateBillProvider } from "~/store/createBillContext";
import { v4 } from "uuid";
import { concat, forIn, get, unset } from "lodash";
import { billItem } from "~/modules/bill/bill.modal";
const KEY_DATA_PHARMACY = "bill-pharmacy";
type ItemDataSource = {
  billItems: billItem[];
  pharmacyId: string | null;
}
type DataSourceType = {
  [key: string]: ItemDataSource;
};
const initData : ItemDataSource = {
  billItems: [],
  pharmacyId: null,
};

const Label = ({ label, onRemove }: { label?: any; onRemove: () => void }) => (
  <Row justify={"space-between"} align="middle" gutter={16}>
    <Col>{label}</Col>
    <Col
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
    >
      <CloseCircleOutlined style={{ fontSize: 18, padding: 0 }} />
    </Col>
  </Row>
);

const items: TabsProps["items"] = new Array(1).fill(null).map((_, i) => {
  const id: string = String(i + 1);
  return {
    label: `Đơn hàng ${id}`,
    key: v4(),
  };
});
const CreateBillPage = (): React.JSX.Element => {
  const [tabs, setTabs] = useState<TabsProps["items"]>();
  const [activeKey, setActiveKey]: any = useState();
  const [dataSource, setDataSource]: any = useState<DataSourceType>();

  // Controller DataSource
  const onAddDataSource = (key: any) => {
    setDataSource({ ...dataSource, [key]: initData });
  };

  const onRemoveDataSource = (key: any) => {
    let newDataSource = { ...dataSource };
    if (newDataSource.hasOwnProperty(key)) {
      unset(newDataSource, key);
    }
    setDataSource(newDataSource);
  };
  // Controller Tabs
  const onAddTab = () => {
    const nextTab = tabs ? tabs.length + 1 : 1;
    const key = v4();
    const newTabs: any = {
      label: `Đơn hàng ${nextTab}`,
      key,
    };
    const newTab = concat(tabs, newTabs);
    setTabs(newTab);
    onAddDataSource(key);
  };

  const onRemoveTab = (targetKey: any) => {
    const newPanes = tabs?.filter((item) => item.key !== targetKey);
    if (!newPanes?.length) {
      const newId = v4();
      setTabs([
        {
          label: `Đơn hàng 1`,
          key: newId,
        },
      ]);
      onAddDataSource(newId);
      setActiveKey(newId);
    } else {
      setTabs(newPanes);
      if (activeKey === targetKey) {
        const newActiveKey = newPanes?.[0].key;
        setActiveKey(newActiveKey);
      }
    }
    onRemoveDataSource(targetKey);
  };

  const onChangeTab = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const onChangeBill = (
    activeKey: any,
    newData: ItemDataSource
  ) => {
    const newDataSource = {
      ...dataSource,
      [activeKey]: {
        ...dataSource[activeKey],
        ...newData,
      },
    };

    setDataSource(newDataSource);
  };

  useEffect(() => {
    // Initialize DataSource
    const dataFromLocalStorage = localStorage.getItem(KEY_DATA_PHARMACY);
    if (
      !dataFromLocalStorage ||
      Object.keys(dataFromLocalStorage).length === 0 ||
      dataFromLocalStorage === "{}"
    ) {
      let newDataSource: DataSourceType = {};
      items?.forEach((tab) => {
        newDataSource[get(tab, "key")] = {
          billItems: [],
          pharmacyId: null,
        };
      });
      localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(newDataSource));
      setTabs(items);
    } else {
      const dataReady = JSON.parse(dataFromLocalStorage);
      let newTabs: any = [];
      forIn(dataReady, (value, key) => {
        newTabs.push({
          key,
          label: `Đơn hàng ${newTabs?.length + 1}`,
        });
      });
      setTabs(newTabs);
      setDataSource(dataReady);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(dataSource));
  }, [dataSource]);

  useEffect(() => {
    if (!activeKey) {
      setActiveKey(tabs?.[0].key);
    }
  }, [activeKey, tabs]);
  return (
    <div>
      <div className="createBill">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "white",
                itemHoverColor: "white",
                cardBg: "#0A64CF",
              },
            },
          }}
        >
          <Tabs
            className="createBill__tabs"
            tabBarExtraContent={{
              left: (
                <SelectProduct
                  dataCurrent={dataSource?.[activeKey]}
                  onChangeBill={(newData: any) =>
                    onChangeBill(activeKey, newData)
                  }
                />
              ),
              right: (
                <PlusOutlined
                  onClick={onAddTab}
                  style={{
                    fontSize: 24,
                    color: "white",
                    padding: "0 10px",
                    cursor: "pointer",
                  }}
                />
              ),
            }}
            type="card"
            onChange={onChangeTab}
          >
            {tabs?.map((tab) => (
              <Tabs.TabPane
                active={activeKey === get(tab, "key")}
                key={tab.key}
                tab={
                  <Label
                    label={get(tab, "label", "")}
                    onRemove={() => {
                      onRemoveTab(get(tab, "key"));
                    }}
                  />
                }
              >
                <CreateBillProvider
                  bill={get(dataSource, activeKey)}
                  onChangeBill={(newData: any) =>
                    onChangeBill(get(tab, "key"), newData)
                  }
                >
                  <Bill.page.create />
                </CreateBillProvider>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default CreateBillPage;

// Controller LocalStorage

// const onAddLocalStorage = (key: any) => {
//   const dataFromLocalStorage = localStorage.getItem(KEY_DATA_PHARMACY) || "";
//   const dataParse = JSON.parse(dataFromLocalStorage) || {};
//   localStorage.setItem(
//     KEY_DATA_PHARMACY,
//     JSON.stringify({ ...dataParse, [key] : initData })
//   );
// };
// const onRemoveLocalStorage = (key: any) => {
//   const dataFromLocalStorage = localStorage.getItem(KEY_DATA_PHARMACY) || "";
//   const dataParse = JSON.parse(dataFromLocalStorage) || {};
//   if (dataParse.hasOwnProperty(key)) {
//     unset(dataParse,key)
//   }
//   localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(dataParse));
// };
