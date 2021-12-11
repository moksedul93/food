import Cookies from "js-cookie";
import graphqlClient from "../graphql";

export const getAllPromotionalImages = async (page = 0, size = 10) => {
  let query = `
        query ($page: Int, $size: Int)     {
          getAllPromotionalImages(page: $page, pagesize: $size){
              msg,
              error,
              data{
                totalDocs
                docs{
                  _id
                  title
                  description
                  promo_img
                }
              }
          } 
      }

    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  let { error, data } = await client.query(query, { page, size }).toPromise();
  console.log("feature fetch",data)
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { getAllPromotionalImages } = data;
  //console.log('getAllVoucher Query data',data)
  return getAllPromotionalImages;
};

export const addPromotionalImage = async (promotionalImages) => {
  let title=promotionalImages.title;
  let description=promotionalImages.description;
  let promo_img=promotionalImages.promo_img;

  let mutation = `
  mutation ($title: String, $description: String, $promo_img: String){    
    addPromotionalImage(title: $title, description: $description, promo_img: $promo_img ){
        msg,
        error
    }
 
}
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  console.log("features voucher", promotionalImages);

  let { error, data } = await client
    .query(mutation, promotionalImages )
    .toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { addPromotionalImage } = data;
  return addPromotionalImage;
};


export const deletePromotionalImage = async (id) => {
  console.log("feature id",id)
  let mutation = `
  mutation($id: ID){
    deletePromotionalImage(_id: $id){
      msg
      error
    }
  }
  
    `;
  let token = Cookies.get("fj_token");
  let client = graphqlClient(token);
  let { error, data } = await client.query(mutation, {id} ).toPromise();
  if (error) {
    return { error: true, msg: "Network failed" };
  }
  let { deletePromotionalImage } = data;
  return deletePromotionalImage;
};
