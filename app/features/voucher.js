import Cookies from "js-cookie";
import graphqlClient from "../graphql";
import { createAsyncThunk } from "@reduxjs/toolkit"; 

export const getAllVouchers = async (page, size) => {

  let query = `
        query ($page: Int, $size: Int)     {
          getAllVouchers(page: $page, pagesize: $size){
              msg,
              error,
              data{
                totalDocs
                docs{
                      _id,
                      voucher_code,
                      voucher_name,
                      discount_amount,
                      start_date,
                      end_date,
                      redeem_count,
                      redeem_limit,
                      minimum_order
                      voucher_status
                }
                     
                  }
          } 
      }

    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  let { error, data } = await client.query(query,{page,size}).toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { getAllVouchers } = data;
  //console.log('getAllVoucher Query data',data)
  return getAllVouchers;
};

export const addVoucher = async voucher => {
  let mutation = `
  mutation($voucher:VoucherInput!){    
    addVoucher(voucherInput:$voucher){
        msg,
        error
    }
 
}
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log('features voucher', voucher)
  let { error, data } = await client.query(mutation,{voucher}).toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { addVoucher } = data;
  return addVoucher;
};

export const updateVoucher = async voucher => {
  let mutation = `
  mutation($voucher:UpdateVoucherInput){
    
    updateVoucher(updateVoucherInput:$voucher){
        msg,
        error
    }
 
}
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log('sending voucher',voucher)
  let { error, data } = await client.query(mutation,{voucher}).toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { updateVoucher } = data;
  return updateVoucher;
};

export const deleteVoucher = async (id) => {
  let mutation = `
  mutation($id:ID){
    deleteVoucher(_id: $id){
      msg
      error
    }
  }
  
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log(id);
  let { error, data } = await client.query(mutation,{id}).toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { deleteVoucher } = data;
  return deleteVoucher;
};
