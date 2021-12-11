import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getAllVoucherCriteria = async (page = 0, size = 10) => {
  let query = `
        query ($page: Int, $size: Int)     {
          getAllVoucherCriteria(page: $page, pagesize: $size){
              msg,
              error,
              data{
                totalDocs
                docs{
                  _id
                  name
                  max_amount
                  min_amount
                  voucher_amount
                  status
                }
              }
          } 
      }

    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  let { error, data } = await client.query(query, { page, size }).toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { getAllVoucherCriteria } = data;
  //console.log('getAllVoucher Query data',data)
  return getAllVoucherCriteria;
};

export const addVoucherCriteria = async (voucherCriteria) => {
  let mutation = `
  mutation($voucherCriteria:VoucherCriteriaInput!){    
    addVoucherCriteria(voucherCriteriaInput:$voucherCriteria){
        msg,
        error
    }
 
}
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log("features voucher", voucherCriteria);
  let { error, data } = await client
    .query(mutation, { voucherCriteria })
    .toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { addVoucherCriteria } = data;
  return addVoucherCriteria;
};

export const updateVoucherCriteria = async (voucherCriteria) => {
  let mutation = `
  mutation($voucherCriteria:UpdateVoucherCriteriaInput){
    
    updateVoucherCriteria(updateVoucherCriteriaInput:$voucherCriteria){
        msg,
        error
    }
 
}
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log("sending criteria", voucherCriteria);
  let { error, data } = await client
    .query(mutation, { voucherCriteria })
    .toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { updateVoucherCriteria } = data;
  return updateVoucherCriteria;
};

export const deleteVoucherCriteria = async (id) => {
  let mutation = `
  mutation{
    deleteVoucherCriteria(_id: $id){
      msg
      error
    }
  }
  
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  let { error, data } = await client.query(mutation).toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { deleteVoucherCriteria } = data;
  return deleteVoucherCriteria;
};
