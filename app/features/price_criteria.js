import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getAllPriceCriteria = async (page = 0, size = 10) => {
  let query = `
        query ($page: Int, $size: Int)     {
          getAllPriceCriteria(page: $page, pagesize: $size){
              msg,
              error,
              data{
                totalDocs
                docs{
                  _id
                  name
                  max_amount
                  min_amount
                  increase_percentage
                  decrease_percentage
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
  let { getAllPriceCriteria } = data;
  //console.log('getAllVoucher Query data',data)
  return getAllPriceCriteria;
};

export const addPriceCriteria = async (priceCriteria) => {
  let mutation = `
  mutation($priceCriteria:PriceCriteriaInput!){    
    addPriceCriteria(priceCriteriaInput:$priceCriteria){
        msg,
        error
    }
 
}
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log("features price", priceCriteria);
  let { error, data } = await client
    .query(mutation, { priceCriteria })
    .toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { addPriceCriteria } = data;
  return addPriceCriteria;
};

export const updatePriceCriteria = async (priceCriteria) => {
  let mutation = `
  mutation($priceCriteria:UpdatePriceCriteriaInput){
    
    updatePriceCriteria(updatePriceCriteriaInput:$priceCriteria){
        msg,
        error
    }
 
}
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log("sending criteria", priceCriteria);
  let { error, data } = await client
    .query(mutation, { priceCriteria })
    .toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { updatePriceCriteria } = data;
  return updatePriceCriteria;
};

export const deletePriceCriteria = async (id) => {
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
  let { deletePriceCriteria } = data;
  return deletePriceCriteria;
};
