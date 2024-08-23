import { customersSlice } from "./customerSlice";

const customerApi = customersSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCustomer: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    getAllCustomers: builder.query({
      query: (query) => ({
        url: `/${query ? query : ""}`,
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),
    updateCustomerById: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers"],
    }),
    deleteCustomeryId: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    getCustomerById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Customer", "CustomersPayments"],
    }),
    confirmPurchase: builder.mutation({
      query: (data) => ({
        url: "/confirm-purchase",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers", "Customer"],
    }),

    getAllcustomersPayments: builder.query({
      query: (query) => ({
        url: `/all-customers-payments${query ? query : ""}`,
        method: "GET",
      }),
      providesTags: ["CustomersPayments"],
    }),
    customerChalanPayment: builder.mutation({
      query: (data) => ({
        url: "/customer-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CustomersPayments"],
    }),
    updateCustomerPayment: builder.mutation({
      query: (data) => ({
        url: `/customer-payment/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CustomersPayments", "Customer", "Customers"],
    }),
    // start
    deleteCustomerPaymentById: builder.mutation({
      query: (id) => ({
        url: `/customer-payment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers", "Customer", "CustomersPayments"],
    }),
    customerPayment: builder.mutation({
      query: (data) => ({
        url: "/customer-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers", "CustomersPayments"],
    }),
    toggleCustomerChalanMarkedById: builder.mutation({
      query: (data) => ({
        url: `/toggle-marked/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer", "Customers", "CustomersPayments"],
    }),
  }),
});

export const {
  useAddCustomerMutation,
  useDeleteCustomeryIdMutation,
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerByIdMutation,
  useConfirmPurchaseMutation,
  useCustomerChalanPaymentMutation,
  useGetAllcustomersPaymentsQuery,
  useUpdateCustomerPaymentMutation,
  useDeleteCustomerPaymentByIdMutation,
  useToggleCustomerChalanMarkedByIdMutation,
} = customerApi;
