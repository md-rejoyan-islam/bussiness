import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import AddFinishedProductFromMemo from "./AddFinishedProduct";
import RateAskInfo from "./RateAskInfo";

export default function EditSelectedFinishedAmount({
  product,
  originalProduct,
  setAllSelectedProducts,
  setOpen,
  allSelectedProducts,
  type,
}) {
  const [productSellRate, setProductSellRate] = useState(
    product?.sellRate || 0
  );
  const [selectedItem, setSelectedItem] = useState({
    id: product.id,
    name: product.name,
    sellRate: product?.sellRate,
    items: [...product?.items],
  });

  const handleDone = () => {
    setAllSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      const index = newSelectedProducts.findIndex(
        (product) => product.id === selectedItem.id
      );
      if (index === -1) {
        newSelectedProducts.push({
          ...selectedItem,
          sellRate: productSellRate,
        });
      } else {
        newSelectedProducts[index] = {
          ...selectedItem,
          sellRate: productSellRate,
        };
      }
      return newSelectedProducts;
    });
    setOpen(false);
  };

  const colorWiseGroupFinishedProducts = Object.groupBy(
    originalProduct?.finished_products,
    (item) => item.color && item.color?.toUpperCase()
  );

  // array  split with 2 items
  const colorGroupNameKeyArray = Object.keys(colorWiseGroupFinishedProducts);

  const [checked, setChecked] = useState(colorGroupNameKeyArray[0]);

  return (
    <div className="flex-1 h-full">
      <h3 className="text-xl font-semibold text-center pt-2 pb-2">
        Finished Amount
      </h3>
      <div className="border p-4 rounded-md ">
        <div>
          <div className="flex justify-center w-full gap-2 pb-3 px-4 ">
            {colorGroupNameKeyArray?.sort()?.map((tab, index) => {
              return (
                <label
                  key={index}
                  className={` py-1 px-2 text-[12px] font-semibold rounded-md bg-slate-200 text-gray-600 cursor-pointer ${
                    checked === tab ? "bg-blue-200" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    value={tab}
                    className="hidden"
                    onChange={(e) => setChecked(e.target.value)}
                  />
                  {tab}
                </label>
              );
            })}
          </div>
          <div className="pt-4 px-4">
            {Object?.keys(
              Object?.groupBy(
                colorWiseGroupFinishedProducts[checked] || [],
                (item) => item?.design?.toUpperCase()
              )
            )?.map((design, i) => {
              const designItems = Object.groupBy(
                colorWiseGroupFinishedProducts[checked],
                (item) => item?.design?.toUpperCase()
              )[design];
              return (
                <div key={i} className="block w-full mb-4">
                  <span className="text-gray-600 font-bold pb-2 block capitalize ">
                    {design === "null" ? "Without Design" : design}
                    <span className="px-1 font-medium">
                      ({designItems?.length})
                    </span>
                  </span>

                  <div className="flex gap-x-4 gap-y-3 items-center flex-wrap ">
                    {designItems
                      ?.sort((a, b) => a?.amount - b?.amount)
                      ?.map((item) => (
                        <p
                          className={`${
                            item?.is_sold ? "bg-red-50" : ""
                          } h-16 w-16 rounded-md border flex justify-center items-center`}
                          key={item?.id}
                        >
                          <Toggle
                            className="h-full w-full data-[state=on]:bg-slate-200"
                            disabled={
                              item?.is_sold &&
                              allSelectedProducts?.every((product) => {
                                return product?.items?.every(
                                  (dt) =>
                                    dt?.customerProductId !==
                                    item?.customerProductId
                                );
                              })
                            }
                            pressed={
                              selectedItem.items.findIndex(
                                (i) => i.id === item.id
                              ) !== -1
                            }
                            onPressedChange={(state) => {
                              setSelectedItem((prev) => {
                                if (state) {
                                  return {
                                    ...prev,
                                    id: product.id,
                                    name: product.name,
                                    items: [...prev.items, item],
                                  };
                                } else {
                                  return {
                                    ...prev,
                                    items: prev.items.filter(
                                      (i) => i.id !== item.id
                                    ),
                                  };
                                }
                              });
                            }}
                          >
                            {item?.amount}
                          </Toggle>
                        </p>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {originalProduct?.finished_products?.length === 0 && (
            <div>
              <AddFinishedProductFromMemo product={product} />
            </div>
          )}
        </div>
      </div>
      <div>
        {/* ask rate  */}
        <RateAskInfo product={product} />
      </div>
      <div className="pt-6">
        <h2 className="text-xl font-semibold text-center">Confirm Product </h2>
        <div className="mt-1  bg-slate-100 flex  p-4 rounded-md">
          <Input
            placeholder="Enter product sell rate here"
            className="  rounded-r-none h-10 border-slate-300   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
            type="number"
            value={productSellRate}
            onChange={(e) => setProductSellRate(e.target.value)}
          />
          <Button
            className="bg-violet-600 rounded-l-none"
            // disabled={!selectedItem.items.length || !productSellRate}
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
