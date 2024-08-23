import SubmitLoader from "@/app/(main)/components/SubmitLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddFinishedDataToProductMutation,
  useUpdateMultipleFinishedDataToProductMutation,
} from "@/features/products/productApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import { toast } from "react-toastify";

export default function ThaanAddForm({
  product,
  setOpen,
  type,
  showDefect = false,
  refetch,
}) {
  const datas = type === "update" ? product?.finished_products : [null];

  const [fields, setFields] = useState(datas);

  const [addFinishedProduct, { isLoading }] =
    useAddFinishedDataToProductMutation();
  const [updateFinishedProduct, { isLoading: isUpdateLoading }] =
    useUpdateMultipleFinishedDataToProductMutation();

  // add field
  const addField = () => {
    setFields((prev) => [...prev, null]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    unregister,
  } = useForm();

  // remove field
  const removeField = (index) => {
    setFields((prev) => {
      const newFields = [...prev];
      newFields.splice(index, 1);
      return newFields;
    });
    unregister(`amount_${index}`);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (fields.length - 1 === index) {
        addField();
        setTimeout(() => {
          document.getElementById(`amount_${index + 1}`).focus();
        }, 100);
      } else {
        document.getElementById(`amount_${index + 1}`).focus();
      }
    }
  };

  const onSubmit = (data) => {
    const values = Object.entries(data).reduce((acc, [key, value]) => {
      const [name, index] = key.split("_");

      if (name === "amount") {
        if (+value > 0) {
          acc[index] = {
            ...acc[index],
            ...product?.finished_products[index],
            amount: +value,
          };
        }
      }
      return acc;
    }, []);

    const result = {
      total_defected: +data.defect,
      productId: +product.id,
      finishedProducts: values?.filter((item) => item),
    };

    if (type === "update") {
      updateFinishedProduct(result).then((response) => {
        if (response?.data?.success) {
          setOpen(false);
          toast.success(response.data?.message);
        } else if (!response.error?.data?.success) {
          toast.error(response?.error?.data?.error?.message);
        }
      });
    } else if (type === "add") {
      addFinishedProduct(result).then((response) => {
        if (response?.data?.success) {
          setOpen(false);
          refetch && refetch();
          toast.success(response.data?.message);
        } else if (!response.error?.data?.success) {
          toast.error(response?.error?.data?.error?.message);
        }
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`${
            type === "update"
              ? "block"
              : type == "add" && showDefect
              ? "hidden"
              : "block"
          }`}
        >
          <Label
            htmlFor="defect"
            className={`${errors.name ? "text-red-500" : ""} pt-3 pb-2 block`}
          >
            Defect
          </Label>

          <Input
            id="name"
            type="number"
            className="   focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80"
            defaultValue={product?.total_defected || 0}
            {...register("defect", { min: 0 })}
          />

          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className=" grid grid-cols-2 gap-2  ">
          {fields.map((item, index, all) => (
            <div key={index} className="group pt-1">
              <Label
                htmlFor="amount"
                className={`${
                  errors[`amount_${index}`] ? "text-red-500" : ""
                } pt-3 pb-2 flex relative justify-between items-center`}
              >
                <span className="relative">Amount-{index + 1}</span>
                {all.length - 1 === index && index > 0 && (
                  <span
                    className="p-1 rounded-md bg-red-100 absolute right-0 cursor-pointer invisible group-hover:visible "
                    onClick={() => removeField(index)}
                  >
                    <RxCrossCircled className="text-base   text-red-500 " />
                  </span>
                )}
              </Label>

              <Input
                type="number"
                id={`amount_${index}`}
                defaultValue={item?.amount || 0}
                className={` focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-slate-400/80 ${
                  errors[`amount_${index}`]
                    ? "border-red-400 focus:border-red-400"
                    : ""
                } `}
                {...register(`amount_${index}`, {
                  required: "Amount is required",
                  min: 0,
                })}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />

              {errors[`amount_${index}`] && (
                <p className="text-red-500 pt-[2px]">
                  {errors[`amount_${index}`].message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-6 justify-between items-center py-4">
          <Button
            type="button"
            onClick={addField}
            className="bg-transparent border hover:bg-black/5 text-black"
          >
            Add Field
          </Button>

          <Button type="submit">
            {type === "update" ? (
              <SubmitLoader label={"Update"} loading={isUpdateLoading} />
            ) : (
              <SubmitLoader label={"Submit"} loading={isLoading} />
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
